const { pool } = require('../db/pool');

// CREATE
async function insertProduct({ name, description = null, price, quantity, sku }) {
  const q = `
    INSERT INTO products (name, description, price, quantity, sku)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
  const v = [name, description, price, quantity, sku];
  const { rows } = await pool.query(q, v);
  return rows[0];
}

// LIST with pagination + optional search on name or sku
async function findProducts({ offset, limit, search }) {
  const params = [];
  const where = [];

  if (search) {
    params.push(`%${search}%`, `%${search}%`);
    where.push(`(name ILIKE $${params.length - 1} OR sku ILIKE $${params.length})`);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  // data
  params.push(limit, offset);
  const dataSql = `
    SELECT *
    FROM products
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length};`;

  const dataRes = await pool.query(dataSql, params);
  const rows = dataRes.rows;

  // count (rebuild params for count in the same order)
  const countParams = search ? [`%${search}%`, `%${search}%`] : [];
  const countSql = `SELECT COUNT(*)::int AS count FROM products ${whereSql};`;
  const countRes = await pool.query(countSql, countParams);
  const total = countRes.rows[0].count;

  return { rows, total };
}

// READ by id
async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1;', [id]);
  return rows[0] || null;
}

// UPDATE (full update)
async function updateProduct(id, { name, description = null, price, quantity, sku }) {
  const q = `
    UPDATE products
       SET name = $1,
           description = $2,
           price = $3,
           quantity = $4,
           sku = $5
     WHERE id = $6
     RETURNING *`;
  const v = [name, description, price, quantity, sku, id];
  const { rows } = await pool.query(q, v);
  return rows[0] || null;
}

// DELETE
async function removeProduct(id) {
  const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id;', [id]);
  return rows[0] || null;
}

module.exports = {
  insertProduct,
  findProducts,
  findById,
  updateProduct,
  removeProduct
};