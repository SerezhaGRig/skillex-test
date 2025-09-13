import { Connection, RowDataPacket } from 'mysql2/promise';

interface Item extends RowDataPacket {
  item_code: string;
}

export const buildSaveItems = (conn: Connection) => async (items: string[]) => {
  console.log(items);
  const [rows] = await conn.query<Item[]>(
    `Select item_code from items where item_code In(?)`,
    [items],
  );

  const existingItemCodes: string[] = rows.map((row) => {
    return row.item_code;
  });
  const missingItems = items.filter(
    (item) => !existingItemCodes.includes(item),
  );

  if (missingItems.length > 0) {
    const values = missingItems.map((item) => [item]);
    await conn.query(`Insert ignore into items (item_code) values ?`, [values]);
  }
};
