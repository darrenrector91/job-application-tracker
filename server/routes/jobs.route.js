const pool = require('../modules/pool');

const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
    console.log('hit get jobs');

    const queryText = 'SELECT * FROM job ORDER BY id';
    pool.query(queryText)
        .then((result) => {
            console.log('query results:', result);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error making query:', err);
            res.sendStatus(500);
        });
});

router.get('/:id', function(req, res) {
    console.log('hit get jobs');

    const queryText = 'SELECT * FROM job WHERE id=$1';
    pool.query(queryText, [req.params.id])
        .then((result) => {
            console.log('query results:', result);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error making query:', err);
            res.sendStatus(500);
        });
});

router.put('/update/:id', (req, res) => {
    const queryText = 'UPDATE job SET name = $1, contact = $2, email = $3, notes = $4, date = $5 WHERE id = $6';
    pool.query(queryText, [req.body.name, req.body.contact, req.body.email, req.body.notes, req.body.date, req.params.id])
        .then((result) => {
            console.log('result:', result.rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
});

router.put('/:id', (req, res) => {
    const queryText = 'UPDATE job SET notes = $1 WHERE id = $2';
    pool.query(queryText, [req.body.notes, req.params.id])
        .then((result) => {
            console.log('result:', result.rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
});

router.post('/', function(req, res) {
    const queryText = 'INSERT INTO job (name, email, contact, notes, date) VALUES ($1, $2, $3, $4, $5)';
    pool.query(queryText, [req.body.name, req.body.email, req.body.contact, req.body.notes, req.body.date])
        .then((result) => {
            console.log('result:', result.rows);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
});

router.delete('/:id', function(req,res) {
    const queryText = 'DELETE FROM job WHERE id = $1';
    pool.query(queryText,[req.params.id])
        .then((result) => {
            console.log('result:', result.rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });

});
module.exports = router;