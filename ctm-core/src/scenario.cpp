#include "scenario.hpp"

#include <algorithm>
#include <cmath>

namespace ctm {

namespace {

double phase_of(const uint64_t tick, const uint32_t period_ticks) {
    return static_cast<double>(tick % period_ticks) / static_cast<double>(period_ticks);
}

double gaussian(const double point, const double center, const double width) {
    const double distance = (point - center) / width;
    return std::exp(-distance * distance);
}

} // namespace

uint32_t lowbias32(uint32_t hash) {
    hash ^= hash >> 16u;
    hash *= 0x7FEB352Du;
    hash ^= hash >> 15u;
    hash *= 0x846CA68Bu;
    hash ^= hash >> 16u;
    return hash;
}

double compute_lambda(const CtmScenario& scenario, const uint64_t tick) {
    const double base = scenario.base_inflow_veh_per_s;
    const double amplitude = scenario.amplitude;
    const uint32_t period_ticks = std::max<uint32_t>(scenario.period_ticks, 1);
    const double period = period_ticks;

    switch (scenario.kind) {
    case CTM_SCEN_CONSTANT:
        return base;

    case CTM_SCEN_SINUSOIDAL:
        return base * (1.0 + amplitude * std::sin(2.0 * M_PI * phase_of(tick, period_ticks)));

    case CTM_SCEN_NYC_PEAK: {
        const double phase = phase_of(tick, period_ticks);
        const double bump = std::max(gaussian(phase, 0.33, 0.08), gaussian(phase, 0.75, 0.08));
        return base * (1.0 - amplitude + 2.5 * amplitude * bump);
    }

    case CTM_SCEN_RAMP_UP: {
        const double frac = std::min(static_cast<double>(tick) / period, 1.0);
        return base * (1.0 - amplitude + 2.0 * amplitude * frac);
    }

    case CTM_SCEN_RANDOM_PULSE: {
        const uint64_t bucket_len = std::max<uint64_t>(period_ticks / 10, 1);
        const auto bucket = static_cast<uint32_t>(tick / bucket_len);
        const uint32_t bucket_hash = lowbias32(lowbias32(scenario.seed) + bucket * 0x9E3779B9u);
        const double roll = static_cast<double>(bucket_hash) / 4294967296.0;
        return roll < amplitude ? 2.5 * base : 0.1 * base;
    }
    }

    return base;
}

double scenario_peak(const CtmScenario& scenario) {
    const double base = scenario.base_inflow_veh_per_s;
    const double amplitude = scenario.amplitude;

    switch (scenario.kind) {
    case CTM_SCEN_CONSTANT:
        return base;
    case CTM_SCEN_SINUSOIDAL:
    case CTM_SCEN_RAMP_UP:
        return base * (1.0 + amplitude);
    case CTM_SCEN_NYC_PEAK:
        return base * (1.0 + 1.5 * amplitude);
    case CTM_SCEN_RANDOM_PULSE:
        return 2.5 * base;
    }

    return base;
}

} // namespace ctm
