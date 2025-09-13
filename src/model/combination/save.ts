import { Connection, ResultSetHeader } from 'mysql2/promise';

export const buildSaveCombination =
  (conn: Connection) => async (combination: string[][]) => {
    const [result] = await conn.query<ResultSetHeader>(
      'Insert into combinations (combination) values (?)',
      [JSON.stringify(combination)],
    );

    return result.insertId;
  };
