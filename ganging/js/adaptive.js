// Turns a student's FactStats rows into selection weights for Character
// Development mode: facts they get wrong more, or answer slower than their
// own average, come up more often. Computed once per round from stats
// fetched at the start -- no repeated Sheet calls while the clock is running.
function computeFactWeights(facts) {
  const attemptedTimes = facts.filter(f => f.attempts > 0).map(f => f.avg_time_ms);
  const sorted = attemptedTimes.slice().sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;

  return facts.map(f => {
    let weight;
    if (f.attempts === 0) {
      weight = 1.5; // unseen facts still get a fair shot at showing up
    } else {
      const errorRate = f.error_rate || 0;
      const timeRatio = median > 0 ? f.avg_time_ms / median : 1;
      weight = 1 + errorRate * 3 + Math.max(0, timeRatio - 1) * 1.5;
    }
    return { factor_a: f.factor_a, factor_b: f.factor_b, weight };
  });
}

function pickWeightedFact(weightedFacts) {
  const total = weightedFacts.reduce((sum, f) => sum + f.weight, 0);
  let r = Math.random() * total;
  for (const f of weightedFacts) {
    r -= f.weight;
    if (r <= 0) return { a: f.factor_a, b: f.factor_b };
  }
  const last = weightedFacts[weightedFacts.length - 1];
  return { a: last.factor_a, b: last.factor_b };
}
