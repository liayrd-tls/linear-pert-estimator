/**
 * PERT (Program Evaluation and Review Technique) Calculator
 *
 * Three-point estimation using:
 * - Optimistic (O): Best-case scenario
 * - Most Likely (M): Most realistic estimate
 * - Pessimistic (P): Worst-case scenario
 */

export interface PertEstimate {
  optimistic: number;
  mostLikely: number;
  pessimistic: number;
}

export interface PertResult {
  expectedTime: number;
  standardDeviation: number;
  variance: number;
  confidenceIntervals: {
    oneStdDev: { lower: number; upper: number }; // ~68% confidence
    twoStdDev: { lower: number; upper: number }; // ~95% confidence
    threeStdDev: { lower: number; upper: number }; // ~99.7% confidence
  };
}

/**
 * Calculate PERT expected time
 * Formula: (O + 4M + P) / 6
 */
export function calculateExpectedTime(estimate: PertEstimate): number {
  const { optimistic, mostLikely, pessimistic } = estimate;
  return (optimistic + 4 * mostLikely + pessimistic) / 6;
}

/**
 * Calculate standard deviation
 * Formula: (P - O) / 6
 */
export function calculateStandardDeviation(estimate: PertEstimate): number {
  const { optimistic, pessimistic } = estimate;
  return (pessimistic - optimistic) / 6;
}

/**
 * Calculate variance
 * Formula: σ²
 */
export function calculateVariance(estimate: PertEstimate): number {
  const stdDev = calculateStandardDeviation(estimate);
  return stdDev * stdDev;
}

/**
 * Calculate full PERT analysis
 */
export function calculatePert(estimate: PertEstimate): PertResult {
  const expectedTime = calculateExpectedTime(estimate);
  const standardDeviation = calculateStandardDeviation(estimate);
  const variance = calculateVariance(estimate);

  return {
    expectedTime,
    standardDeviation,
    variance,
    confidenceIntervals: {
      oneStdDev: {
        lower: expectedTime - standardDeviation,
        upper: expectedTime + standardDeviation,
      },
      twoStdDev: {
        lower: expectedTime - 2 * standardDeviation,
        upper: expectedTime + 2 * standardDeviation,
      },
      threeStdDev: {
        lower: expectedTime - 3 * standardDeviation,
        upper: expectedTime + 3 * standardDeviation,
      },
    },
  };
}

/**
 * Calculate PERT for multiple tasks (project level)
 */
export function calculateProjectPert(tasks: PertEstimate[]): PertResult {
  const totalExpectedTime = tasks.reduce(
    (sum, task) => sum + calculateExpectedTime(task),
    0
  );

  const totalVariance = tasks.reduce(
    (sum, task) => sum + calculateVariance(task),
    0
  );

  const projectStdDev = Math.sqrt(totalVariance);

  return {
    expectedTime: totalExpectedTime,
    standardDeviation: projectStdDev,
    variance: totalVariance,
    confidenceIntervals: {
      oneStdDev: {
        lower: totalExpectedTime - projectStdDev,
        upper: totalExpectedTime + projectStdDev,
      },
      twoStdDev: {
        lower: totalExpectedTime - 2 * projectStdDev,
        upper: totalExpectedTime + 2 * projectStdDev,
      },
      threeStdDev: {
        lower: totalExpectedTime - 3 * projectStdDev,
        upper: totalExpectedTime + 3 * projectStdDev,
      },
    },
  };
}

/**
 * Validate PERT estimate
 */
export function validatePertEstimate(estimate: PertEstimate): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (estimate.optimistic <= 0) {
    errors.push("Optimistic estimate must be greater than 0");
  }

  if (estimate.mostLikely <= 0) {
    errors.push("Most likely estimate must be greater than 0");
  }

  if (estimate.pessimistic <= 0) {
    errors.push("Pessimistic estimate must be greater than 0");
  }

  if (estimate.optimistic > estimate.mostLikely) {
    errors.push("Optimistic estimate must be less than or equal to most likely");
  }

  if (estimate.mostLikely > estimate.pessimistic) {
    errors.push("Most likely estimate must be less than or equal to pessimistic");
  }

  if (estimate.optimistic > estimate.pessimistic) {
    errors.push("Optimistic estimate must be less than or equal to pessimistic");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
