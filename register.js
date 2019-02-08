const express = require('express');
const { check, validationResult } = require('express-validator/check');

const { insert: insertToDB } = require('./db');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const validation = [
  check('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),
  check('email')
    .isLength({ min: 1 })
    .withMessage('Netfang má ekki vera tómt'),
  check('email')
    .isEmail()
    .withMessage('Netfang verður að vera netfang'),
  check('phone')
    .isLength({ min: 1 })
    .withMessage('Símanúmer má ekki vera tómt'),
  check('phone')
    .matches(/^[0-9]{3}( |-)?[0-9]{4}$/)
    .withMessage(
      'Símanúmer verður að vera á formi 000-0000, 0000000 eða 000 0000'
    ),
  check('about')
    .isLength({ min: 100 })
    .withMessage('Kynning á þér verður að vera að minnsta kosti 100 stafir'),
  check('job')
    .isLength({ min: 1 })
    .withMessage('Það þarf að velja starf sem verið er að sækja um')
];

const sanitazion = [];

function form(req, res) {
  res.render('index', {
    name: '',
    email: '',
    phone: '',
    about: '',
    job: '',
    errors: [],
    errorParams: []
  });
}
async function register(req, res) {
  const { body: { name, email, phone, about, job } = {} } = req;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array();
    // console.log(errorMessages);
    let errorParams = [];
    errorMessages.forEach(function(e) {
      errorParams.push(e.param);
    });
    res.render('index', {
      title: 'Umsókn',
      name,
      email,
      phone,
      about,
      job,
      errors: errorMessages,
      errorParams
    });
  } else {
    try {
      await insertToDB(name, email, phone, about, job);
    } catch (e) {
      console.log('Gat ekki búið til umsókn:', name, e);
      throw e;
    }
    res.render('thanks', { title: 'Takk fyrir' });
  }
}

router.get('/', form);
router.post('/register', validation, sanitazion, catchErrors(register));

module.exports = router;
