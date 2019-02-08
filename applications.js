const express = require('express');
const { Client } = require('pg');
const { getData } = require('./db');
const { runQuery } = require('./db');

const connectionString = process.env.DATABASE_URL;

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const validation = [];

const sanitazion = [];

router.use(express.urlencoded({ extended: true }));

async function removeFromDB(name) {
  const client = new Client({ connectionString });
  await client.connect();
  let selection;
  try {
    await client.query('DELETE FROM applications WHERE name = ($1)', [name]);
    selection = await client.query('SELECT * FROM applications');
  } catch (error) {
    console.error('Gat ekki eytt', error);
  } finally {
    await client.end();
  }
  return selection.rows;
}
removeFromDB().catch(err => {
  console.error(err);
});

async function renderApples(res) {
  const selection = await getData();
  res.render('apples', {
    title: 'Umsóknir',
    appList: selection
  });
}

router.post('/vinna', async (req, res) => {
  const id = req.body.id;
  await runQuery(id, 'UPDATE applications SET processed = TRUE WHERE id =');
  const selection = await getData();

  renderApples(res);
  //res.send(`POST gögn: ${JSON.stringify(req.body)}`);
});

router.get('/applications', async (req, res) => {
  /*const selection = await getData();
  res.render('apples', {
    title: 'Umsóknir',
    appList: selection
  });*/
  await renderApples(res);
});
router.post('/delete', async (req, res) => {
  const id = req.body.id;
  await runQuery(id, 'DELETE FROM applications WHERE id =');
  renderApples(res);
});

module.exports = router;
