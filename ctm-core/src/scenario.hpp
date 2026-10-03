#pragma once
#include "ctm_ffi.h"

namespace ctm {

uint32_t lowbias32(uint32_t hash);                              // "lowbias32" integer mixer
double compute_lambda(const CtmScenario& scenario, uint64_t tick);  // veh/s
double scenario_peak(const CtmScenario& scenario);               // upper bound of compute_lambda, veh/s

}  // namespace ctm
