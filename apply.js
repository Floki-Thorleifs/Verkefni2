/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require('express');

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/* todo útfæra */

module.exports = router;
