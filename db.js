const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL; // sótt úr env gegnum dotenv pakka

const client = new Client({
  connectionString
});

async function insert(name, email, phone, about, job) {
  client.connect();
  try {
    const query =
      'INSERT INTO applications( name, email, phone, about, job, processed) VALUES ( $1, $2, $3, $4, $5, FALSE)';
    const res = await client.query(query, [name, email, phone, about, job]);
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

async function getData() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query(
      'SELECT * FROM applications ORDER BY id ASC'
    );
    const { rows } = result;
    return rows;
  } catch (error) {
    console.error('Gat ekki sótt gögn');
    throw error;
  } finally {
    await client.end();
  }
}

async function runQuery(id, query) {
  const client = new Client({ connectionString });
  await client.connect();
  const string = query + id;
  console.log(string);
  try {
    const result = await client.query(string);
    const { rows } = result;
    return rows;
  } catch (error) {
    console.error('Error running query');
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = {
  insert,
  getData,
  runQuery
};
