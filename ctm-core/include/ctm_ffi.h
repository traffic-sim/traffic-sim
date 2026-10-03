#ifndef CTM_FFI_H
#define CTM_FFI_H

/* This header is a C ABI boundary. It must compile as both C and C++.
   Disable C++-only modernization checks for the whole file. */
// NOLINTBEGIN(modernize-use-using, cppcoreguidelines-use-enum-class, performance-enum-size,
// modernize-deprecated-headers)

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef enum CtmStatus {
    CTM_OK = 0,
    CTM_ERR_NULL_ARG,
    CTM_ERR_BAD_LAYOUT,
    CTM_ERR_BAD_INDEX,
    CTM_ERR_CFL_VIOLATION,
    CTM_ERR_BAD_PARAM,
    CTM_ERR_ALLOC,
} CtmStatus;

typedef enum CtmScenarioKind {
    CTM_SCEN_CONSTANT = 0,
    CTM_SCEN_SINUSOIDAL,
    CTM_SCEN_NYC_PEAK,
    CTM_SCEN_RANDOM_PULSE,
    CTM_SCEN_RAMP_UP,
} CtmScenarioKind;

typedef enum CtmJunctionKind {
    CTM_JUNCTION_MERGE = 0,   /* MERGE_N1   */
    CTM_JUNCTION_DIVERGE = 1, /* DIVERGE_1M */
} CtmJunctionKind;

/* Test-only escape hatches (bit flags in CtmSimConfig.flags). */
// NOLINTNEXTLINE(cppcoreguidelines-macro-usage)
#define CTM_FLAG_SKIP_CFL_CHECK 1u

typedef struct CtmEdgeMeta {
    uint32_t density_start_offset; /* first real cell in densities/demands/supplies */
    uint32_t flux_start_offset;    /* leftmost face in fluxes */
    uint32_t n_cells;              /* real cells only, >= 1 */
    double dx;                     /* m */
    double u_f;                    /* m/s */
    double w;                      /* m/s */
    double rho_critical;           /* veh/m */
    double rho_jam;                /* veh/m */
} CtmEdgeMeta;

typedef struct CtmLamp {
    uint32_t gate_flux_a; /* upstream edge's right boundary face */
    uint32_t gate_flux_b; /* lamp edge's left boundary face */
    uint32_t group_idx;
    uint32_t phase_idx;
} CtmLamp;

typedef struct CtmChain {
    uint32_t upstream_flux_idx;   /* X's right boundary face */
    uint32_t downstream_flux_idx; /* Y's left boundary face */
} CtmChain;

typedef struct CtmScenario {
    double base_inflow_veh_per_s; /* >= 0 */
    CtmScenarioKind kind;
    double amplitude;      /* [0,1]; ignored for CONSTANT */
    uint32_t period_ticks; /* >= 1; ignored for CONSTANT */
    uint32_t seed;         /* RANDOM_PULSE only */
} CtmScenario;

typedef struct CtmSource {
    uint32_t target_flux_idx; /* the source edge's left boundary face */
    CtmScenario scenario;
} CtmSource;

typedef struct CtmSink {
    uint32_t target_flux_idx; /* the sink edge's right boundary face */
    bool unlimited;
    double capacity_veh_per_s;
} CtmSink;

typedef struct CtmJunction {
    CtmJunctionKind kind;
    uint32_t shared_flux_idx; /* MERGE: outgoing left face; DIVERGE: incoming right face */
    const uint32_t*
        per_edge_flux_indices; /* MERGE: incoming right faces; DIVERGE: outgoing left faces */
    uint32_t count;
    const double* weights; /* MERGE: priorities p_i (>0); DIVERGE: ratios beta_j (>0, sum 1) */
} CtmJunction;

typedef struct CtmPhaseCfg {
    uint32_t min_duration_ticks; /* >= 1 */
    double base_duration_ratio;  /* [0,1] */
    const uint32_t* member_lamp_indices;
    uint32_t member_lamp_count;
} CtmPhaseCfg;

typedef struct CtmGroupCfg {
    const uint32_t* lamp_indices;
    uint32_t lamp_count;
    uint32_t cycle_length_ticks;
    uint32_t offset_ticks;
    double clearance_fraction;
    const CtmPhaseCfg* phases;
    uint32_t phase_count;
} CtmGroupCfg;

typedef struct CtmSimConfig {
    double dt_seconds;
    double effective_ratio_max_step;
    uint32_t flags;

    const CtmEdgeMeta* edges;
    size_t edges_len;
    const CtmLamp* lamps;
    size_t lamps_len;
    const CtmSource* sources;
    size_t sources_len;
    const CtmSink* sinks;
    size_t sinks_len;
    const CtmJunction* junctions;
    size_t junctions_len;
    const CtmChain* chains;
    size_t chains_len;
    const CtmGroupCfg* groups;
    size_t groups_len;

    const double* initial_densities; /* len = total_density_slots; NULL means all zeros */
    size_t total_density_slots;
    size_t total_flux_slots;
} CtmSimConfig;

typedef struct CtmSim CtmSim; /* opaque handle */

typedef struct CtmRunningTotals {
    double total_time_spent;         /* veh*s in the network */
    double total_source_queue_time;  /* veh*s waiting in source queues */
    double total_throughput;         /* veh out through sinks */
    double total_admitted;           /* veh in through sources */
    double total_distance_travelled; /* veh*m */
    double total_delay; /* veh*s: time spent minus the free-flow time of the distance covered */
} CtmRunningTotals;

/* Per source: vehicles it offered (integral of the scenario inflow) and vehicles admitted into the
 * network. offered = admitted + the current queue */
typedef struct CtmSourceTotals {
    double offered;
    double admitted;
} CtmSourceTotals;

typedef struct CtmSourceTotalsSlice {
    const CtmSourceTotals* data;
    size_t len;
} CtmSourceTotalsSlice;

typedef struct CtmDoubleSlice {
    const double* data;
    size_t len;
} CtmDoubleSlice;

typedef struct CtmLampState {
    bool is_green;
    uint32_t phase_idx;
} CtmLampState;

typedef struct CtmLampStateSlice {
    const CtmLampState* data;
    size_t len;
} CtmLampStateSlice;

typedef struct CtmPhaseState {
    uint32_t group_idx;
    uint32_t phase_idx;
    double base_duration_ratio;
    double effective_duration_ratio;
    uint32_t duration_ticks;
    int32_t active_phase_idx; /* the owning group's state; -1 = all-red gap */
    uint32_t phase_elapsed_ticks;
    uint32_t cycle_elapsed_ticks;
    uint32_t cycle_length_ticks;
} CtmPhaseState;

typedef struct CtmPhaseStateSlice {
    const CtmPhaseState* data;
    size_t len;
} CtmPhaseStateSlice;

typedef struct CtmEdgeMetaSlice {
    const CtmEdgeMeta* data;
    size_t len;
} CtmEdgeMetaSlice;

/* Lifecycle */
CtmStatus ctm_sim_create(const CtmSimConfig* config, CtmSim** out_handle);
const char* ctm_last_error(void); /* thread-local message of the last failing call */
void ctm_sim_destroy(CtmSim* handle);
void ctm_sim_reset(CtmSim* handle);

/* Stepping: always uses config.dt_seconds (CFL-checked at creation). */
void ctm_sim_step(CtmSim* handle);

/* Read accessors. Pointers stay valid only until the next step/reset/destroy. */
CtmDoubleSlice ctm_sim_get_densities(const CtmSim* handle); /* veh/m */
CtmDoubleSlice ctm_sim_get_fluxes(const CtmSim* handle);    /* veh/s */
CtmDoubleSlice
ctm_sim_get_demands(const CtmSim* handle); /* veh/s (as of the last step's Phase 0) */
CtmDoubleSlice
ctm_sim_get_supplies(const CtmSim* handle); /* veh/s (as of the last step's Phase 0) */
CtmDoubleSlice ctm_sim_get_source_queues(const CtmSim* handle); /* veh, one per source */
CtmSourceTotalsSlice ctm_sim_get_source_totals(const CtmSim* handle);
CtmLampStateSlice ctm_sim_get_lamp_states(const CtmSim* handle);
CtmPhaseStateSlice ctm_sim_get_phase_states(CtmSim* handle);
CtmEdgeMetaSlice ctm_sim_get_edge_metadata(const CtmSim* handle);
CtmRunningTotals ctm_sim_get_running_totals(const CtmSim* handle);
uint64_t ctm_sim_get_tick(const CtmSim* handle);
uint64_t ctm_sim_get_clamp_violations(const CtmSim* handle);  /* must stay 0 */
double ctm_sim_get_vehicles_in_network(const CtmSim* handle); /* gauge, recomputed on demand */
double ctm_sim_get_vehicles_queued(const CtmSim* handle);     /* gauge */
double ctm_sim_get_initial_vehicles(const CtmSim* handle);

/* Stateless helpers, exposed so tools on the Rust side reuse the engine's exact logic instead of a
 * second copy. resolve_merge: the iterative n-to-1 merge (priorities > 0); writes n fluxes.
 * scenario_lambda: a source's inflow (veh/s) at a tick. */
void ctm_resolve_merge(const double* demands, size_t n, double supply, const double* priorities,
                       double* out_fluxes);
double ctm_scenario_lambda(const CtmScenario* scenario, uint64_t tick);

/* Write accessors (between steps only). Reject with CTM_ERR_BAD_PARAM, no state change,
 * unless every green fraction is in [0,1] and the group's resulting sum <= 1 - clearance_fraction
 * (+1e-9). */
CtmStatus ctm_sim_set_phase_base_duration(CtmSim* handle, uint32_t group_idx, uint32_t phase_idx,
                                          double green_fraction);
CtmStatus ctm_sim_set_group_base_durations(CtmSim* handle, uint32_t group_idx,
                                           const double* green_fractions, size_t n);

#ifdef __cplusplus
}
#endif

// NOLINTEND(modernize-use-using, cppcoreguidelines-use-enum-class, performance-enum-size,
// modernize-deprecated-headers)

#endif
