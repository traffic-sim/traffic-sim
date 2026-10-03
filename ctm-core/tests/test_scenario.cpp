#include "scenario.hpp"

#include <catch2/catch_test_macros.hpp>
#include <catch2/matchers/catch_matchers_floating_point.hpp>
#include <cmath>
#include <set>
using Catch::Matchers::WithinAbs;

static CtmScenario create_scenario(const CtmScenarioKind kind, const double base,
                                   const double amplitude, const uint32_t period_ticks,
                                   const uint32_t seed = 0) {
    CtmScenario scenario{};
    scenario.kind = kind;
    scenario.base_inflow_veh_per_s = base;
    scenario.amplitude = amplitude;
    scenario.period_ticks = period_ticks;
    scenario.seed = seed;
    return scenario;
}

TEST_CASE("scenarios are non-negative, finite and bounded by their peak", "[scenario]") {
    for (const auto kind : {CTM_SCEN_CONSTANT, CTM_SCEN_SINUSOIDAL, CTM_SCEN_NYC_PEAK,
                            CTM_SCEN_RANDOM_PULSE, CTM_SCEN_RAMP_UP}) {
        for (const double amplitude : {0.0, 0.3, 1.0}) {
            for (const uint32_t period_ticks : {1u, 7u, 100u, 3600u}) {
                const auto scenario = create_scenario(kind, 0.4, amplitude, period_ticks, 17);
                const double peak = ctm::scenario_peak(scenario);

                for (uint64_t tick = 0; tick < 4 * period_ticks + 50; ++tick) {
                    const double lambda = ctm::compute_lambda(scenario, tick);

                    REQUIRE(std::isfinite(lambda));
                    REQUIRE(lambda >= 0.0);
                    REQUIRE(lambda <= peak + 1e-12);
                }
            }
        }
    }
}

TEST_CASE("constant, and amplitude 0", "[scenario]") {
    CHECK(ctm::compute_lambda(create_scenario(CTM_SCEN_CONSTANT, 0.5, 0.9, 10), 123) == 0.5);
    for (const auto kind : {CTM_SCEN_SINUSOIDAL, CTM_SCEN_NYC_PEAK, CTM_SCEN_RAMP_UP}) {
        for (const uint64_t tick : {0ull, 5ull, 77ull}) {
            const auto scenario = create_scenario(kind, 0.5, 0.0, 50);
            const auto lambda = ctm::compute_lambda(scenario, tick);

            CHECK_THAT(lambda, WithinAbs(0.5, 1e-15));
        }
    }
}

TEST_CASE("sinusoidal: B at t=0 and mean B over whole periods", "[scenario]") {
    const auto scenario = create_scenario(CTM_SCEN_SINUSOIDAL, 0.4, 0.8, 200);
    const auto lambda = ctm::compute_lambda(scenario, 0);

    CHECK_THAT(lambda, WithinAbs(0.4, 1e-15));

    double sum = 0;
    for (uint64_t tick = 0; tick < 200; ++tick) {
        sum += ctm::compute_lambda(scenario, tick);
    }

    CHECK_THAT(sum / 200, WithinAbs(0.4, 1e-9));
}

TEST_CASE("nyc peak: two bumps, floor B(1-A), exact periodicity", "[scenario]") {
    const auto scenario = create_scenario(CTM_SCEN_NYC_PEAK, 1.0, 0.6, 1000);

    CHECK_THAT(ctm::compute_lambda(scenario, 330), WithinAbs(1.0 * (1 - 0.6 + 2.5 * 0.6), 1e-6));
    CHECK_THAT(ctm::compute_lambda(scenario, 750), WithinAbs(1.0 * (1 - 0.6 + 2.5 * 0.6), 1e-6));
    CHECK_THAT(ctm::compute_lambda(scenario, 550),
               WithinAbs(0.4, 5e-3)); // between the bumps (Gaussian tails)

    for (uint64_t tick = 0; tick < 1000; tick += 37) {
        CHECK(ctm::compute_lambda(scenario, tick) == ctm::compute_lambda(scenario, tick + 1000));
    }
}

TEST_CASE("ramp up: monotone, B(1-A) at 0, B(1+A) from P on, never resets", "[scenario]") {
    const auto scenario = create_scenario(CTM_SCEN_RAMP_UP, 0.5, 0.4, 100);
    auto lambda = ctm::compute_lambda(scenario, 0);

    CHECK_THAT(lambda, WithinAbs(0.5 * 0.6, 1e-15));

    double prev = -1;
    for (uint64_t tick = 0; tick < 400; ++tick) {
        lambda = ctm::compute_lambda(scenario, tick);
        REQUIRE(lambda >= prev);
        prev = lambda;
    }

    for (const uint64_t tick : {100ull, 101ull, 1000ull}) {
        lambda = ctm::compute_lambda(scenario, tick);
        CHECK_THAT(lambda, WithinAbs(0.5 * 1.4, 1e-12));
    }
}

TEST_CASE("random pulse: two values, bucketed, seeded, probability A", "[scenario]") {
    const auto scenario =
        create_scenario(CTM_SCEN_RANDOM_PULSE, 0.2, 0.3, 100, 42); // bucket_len = 10
    std::set<double> values;

    for (uint64_t tick = 0; tick < 10000; ++tick) {
        values.insert(ctm::compute_lambda(scenario, tick));
    }

    CHECK(values == std::set<double>{0.2 * 0.1, 0.2 * 2.5});

    for (uint64_t bucket = 0; bucket < 50; ++bucket) {
        // constant within a bucket
        for (uint64_t k = 1; k < 10; ++k) {
            CHECK(ctm::compute_lambda(scenario, bucket * 10) ==
                  ctm::compute_lambda(scenario, bucket * 10 + k));
        }
    }

    int pulses = 0;
    const int buckets = 20000;

    for (int bucket = 0; bucket < buckets; ++bucket) {
        const auto lambda = ctm::compute_lambda(scenario, static_cast<uint64_t>(bucket) * 10);
        pulses += static_cast<int>(lambda > 0.3);
    }

    CHECK_THAT(static_cast<double>(pulses) / buckets, WithinAbs(0.3, 0.02));

    // A = 0 never pulses, A = 1 always pulses
    const auto never = create_scenario(CTM_SCEN_RANDOM_PULSE, 0.2, 0.0, 100, 1);
    const auto always = create_scenario(CTM_SCEN_RANDOM_PULSE, 0.2, 1.0, 100, 1);

    for (uint64_t tick = 0; tick < 2000; tick += 10) {
        CHECK(ctm::compute_lambda(never, tick) == 0.2 * 0.1);
        CHECK(ctm::compute_lambda(always, tick) == 0.2 * 2.5);
    }
}

TEST_CASE("random pulse is deterministic and different seeds differ", "[scenario]") {
    const auto scenario_a = create_scenario(CTM_SCEN_RANDOM_PULSE, 0.2, 0.5, 100, 1);
    const auto scenario_b = create_scenario(CTM_SCEN_RANDOM_PULSE, 0.2, 0.5, 100, 2);

    int diff = 0;
    for (uint64_t tick = 0; tick < 5000; tick += 10) {
        CHECK(ctm::compute_lambda(scenario_a, tick) == ctm::compute_lambda(scenario_a, tick));
        diff += static_cast<int>(ctm::compute_lambda(scenario_a, tick) !=
                                 ctm::compute_lambda(scenario_b, tick));
    }

    CHECK(diff > 200);
}
