const express = require('express');
const app = require('./index');

app.post('/submit', (req, res) => {
  const { employeeName, department } = req.body;
  const employee = new Employee({ name: employeeName, department });
  employee.save()
    .then(() => res.send({ success: true }))
    .catch((err) => res.status(500).send({ success: false, error: err.message }));
});

module.exports = app;
