import { Connection } from 'mysql2/promise';
import { buildSaveCombination } from '../../../src/model/combination/save';

describe('buildSaveCombination', () => {
  let mockConnection: jest.Mocked<Partial<Connection>>;
  let mockQuery: jest.Mock;

  beforeEach(() => {
    mockQuery = jest.fn();
    mockConnection = {
      query: mockQuery,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('inserts combination and returns insertId', async () => {
    const mockResult = {
      insertId: 123,
      affectedRows: 1,
      fieldCount: 0,
      info: '',
      serverStatus: 2,
      warningStatus: 0,
    };

    mockQuery.mockResolvedValue([mockResult, undefined]);

    const saveCombination = buildSaveCombination(mockConnection as Connection);
    const combination = [
      ['a', 'b'],
      ['c', 'd'],
    ];

    const result = await saveCombination(combination);

    expect(result).toBe(123);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      'Insert into combinations (combination) values (?)',
      [JSON.stringify(combination)],
    );
  });

  it('correctly stringifies different combination structures', async () => {
    const mockResult = {
      insertId: 456,
      affectedRows: 1,
      fieldCount: 0,
      info: '',
      serverStatus: 2,
      warningStatus: 0,
    };

    mockQuery.mockResolvedValue([mockResult, undefined]);

    const saveCombination = buildSaveCombination(mockConnection as Connection);

    // Test with empty arrays
    const emptyCombination: string[][] = [[], []];
    await saveCombination(emptyCombination);

    expect(mockQuery).toHaveBeenCalledWith(
      'Insert into combinations (combination) values (?)',
      ['[[],[]]'],
    );

    // Test with single element arrays
    const singleCombination = [['single']];
    await saveCombination(singleCombination);

    expect(mockQuery).toHaveBeenCalledWith(
      'Insert into combinations (combination) values (?)',
      ['[["single"]]'],
    );

    const mixedCombination = [['a'], ['b', 'c', 'd'], ['e', 'f']];
    await saveCombination(mixedCombination);

    expect(mockQuery).toHaveBeenCalledWith(
      'Insert into combinations (combination) values (?)',
      ['[["a"],["b","c","d"],["e","f"]]'],
    );
  });

  it('handles empty combination array', async () => {
    const mockResult = {
      insertId: 789,
      affectedRows: 1,
      fieldCount: 0,
      info: '',
      serverStatus: 2,
      warningStatus: 0,
    };

    mockQuery.mockResolvedValue([mockResult, undefined]);

    const saveCombination = buildSaveCombination(mockConnection as Connection);
    const emptyCombination: string[][] = [];

    const result = await saveCombination(emptyCombination);

    expect(result).toBe(789);
    expect(mockQuery).toHaveBeenCalledWith(
      'Insert into combinations (combination) values (?)',
      ['[]'],
    );
  });

  it('propagates database errors', async () => {
    const dbError = new Error('Database connection failed');
    mockQuery.mockRejectedValue(dbError);

    const saveCombination = buildSaveCombination(mockConnection as Connection);
    const combination = [['a', 'b']];

    await expect(saveCombination(combination)).rejects.toThrow(
      'Database connection failed',
    );
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('handles special characters in combination strings', async () => {
    const mockResult = {
      insertId: 999,
      affectedRows: 1,
      fieldCount: 0,
      info: '',
      serverStatus: 2,
      warningStatus: 0,
    };

    mockQuery.mockResolvedValue([mockResult, undefined]);

    const saveCombination = buildSaveCombination(mockConnection as Connection);
    const specialCharCombination = [
      ['string with "quotes"'],
      ["string with 'apostrophes'"],
      ['string with \\backslash'],
      ['string with \n newline'],
    ];

    const result = await saveCombination(specialCharCombination);

    expect(result).toBe(999);

    const expectedJson = JSON.stringify(specialCharCombination);
    expect(mockQuery).toHaveBeenCalledWith(
      'Insert into combinations (combination) values (?)',
      [expectedJson],
    );
  });

  it('returns insertId of 0 when database returns 0', async () => {
    const mockResult = {
      insertId: 0,
      affectedRows: 1,
      fieldCount: 0,
      info: '',
      serverStatus: 2,
      warningStatus: 0,
    };

    mockQuery.mockResolvedValue([mockResult, undefined]);

    const saveCombination = buildSaveCombination(mockConnection as Connection);
    const combination = [['test']];

    const result = await saveCombination(combination);

    expect(result).toBe(0);
  });

  it('uses the same connection for multiple saves', async () => {
    const mockResult1 = {
      insertId: 1,
      affectedRows: 1,
      fieldCount: 0,
      info: '',
      serverStatus: 2,
      warningStatus: 0,
    };

    const mockResult2 = {
      insertId: 2,
      affectedRows: 1,
      fieldCount: 0,
      info: '',
      serverStatus: 2,
      warningStatus: 0,
    };

    mockQuery
      .mockResolvedValueOnce([mockResult1, undefined])
      .mockResolvedValueOnce([mockResult2, undefined]);

    const saveCombination = buildSaveCombination(mockConnection as Connection);

    const result1 = await saveCombination([['first']]);
    const result2 = await saveCombination([['second']]);

    expect(result1).toBe(1);
    expect(result2).toBe(2);
    expect(mockQuery).toHaveBeenCalledTimes(2);

    expect(mockQuery).toHaveBeenNthCalledWith(
      1,
      'Insert into combinations (combination) values (?)',
      ['[["first"]]'],
    );
    expect(mockQuery).toHaveBeenNthCalledWith(
      2,
      'Insert into combinations (combination) values (?)',
      ['[["second"]]'],
    );
  });
});
