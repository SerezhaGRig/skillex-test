import { Pool } from 'mysql2/promise';
import { GenerateSchemaParams } from '../types';
import { combinationGenerator } from '../utils/combinationGenerator';
import { buildSaveItems } from '../model/item/save';
import { buildSaveCombination } from '../model/combination/save';
import { buildSaveResponse } from '../model/response/save';

export const buildGenerateService =
  (pool: Pool) =>
  async ({ items, length }: GenerateSchemaParams) => {
    console.info('params', { items, length });
    const { combination, types } = combinationGenerator(items, length);
    console.info('comb', { combination, types });
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await buildSaveItems(conn)(types.flat());
      const combId = await buildSaveCombination(conn)(combination);
      const respId = await buildSaveResponse(conn)(combId);
      await conn.commit();
      return { id: respId, combination };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  };
