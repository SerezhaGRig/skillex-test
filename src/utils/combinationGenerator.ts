import fastCartesian from 'fast-cartesian';

const uppercaseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const typesGenerator = (input: number[]) => {
  const types = input.map((num, index) => {
    const subType = [];
    for (let i = 1; i <= num; i++) {
      subType.push(`${uppercaseAlphabet[index]}${i}`);
    }
    return subType;
  });
  console.info(types);
  return types;
};

export const getCombinations = (
  types: string[][],
  length: number,
): string[][][] => {
  if (length > types.length || length <= 0) return [];
  if (length === types.length) return [types];
  if (length === 1) return types.map((type) => [type]);

  const result = [];

  for (let i = 0; i <= types.length - length; i++) {
    const head = types[i];
    const tailCombinations = getCombinations(types.slice(i + 1), length - 1);

    for (const tail of tailCombinations) {
      result.push([head, ...tail]);
    }
  }

  return result;
};

export const combinationGenerator = (input: number[], length: number) => {
  const types = typesGenerator(input);
  const combos = getCombinations(types, length);
  const combination = combos.flatMap((combo) => fastCartesian(combo));
  return { combination, types };
};
