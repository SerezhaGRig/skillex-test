import { Connection, ResultSetHeader } from 'mysql2/promise';

export const buildSaveResponse =
  (conn: Connection) => async (combinationId: number) => {
    const [result] = await conn.query<ResultSetHeader>(
      'Insert into responses (combination_id) values (?)',
      [combinationId],
    );

    return result.insertId;
  };
