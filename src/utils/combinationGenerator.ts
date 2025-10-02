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

export const generateCombinations = (
  types: string[][],
  length: number,
): string[][] => {
  const result: string[][] = [];
  const backtrack = (combo: string[], typeIndex: number) => {
    if (combo.length === length) {
      result.push([...combo]);
      return;
    }
    if (typeIndex >= types.length) {
      return;
    }
    for (const item of types[typeIndex]) {
      combo.push(item);
      backtrack(combo, typeIndex + 1);
      combo.pop();
    }
    backtrack(combo, typeIndex + 1);
  };
  backtrack([], 0);
  return result;
};

export const combinationGenerator = (input: number[], length: number) => {
  const types = typesGenerator(input);
  const combination = generateCombinations(types, length);
  return { combination, types };
};
