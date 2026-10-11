export interface RandomSource {
  /** Return an integer in [0, upperBound). */
  nextInt(upperBound: number): number;
}

export const systemRandom: RandomSource = {
  nextInt: (upperBound) => Math.floor(Math.random() * upperBound),
};

export function shuffled<T>(items: readonly T[], random: RandomSource): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = random.nextInt(index + 1);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
