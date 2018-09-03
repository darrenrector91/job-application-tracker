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
    const queryText = 'UPDATE job SET company = $1, contact = $2, email = $3, notes = $4, date = $5, status = $6, filename = $7 WHERE id = $8';
    pool.query(queryText, [req.body.company, req.body.contact, req.body.email, req.body.notes, req.body.date, req.body.status, req.body.filename, req.params.id])
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
    console.log('in router.post');
    const queryText = 'INSERT INTO job(company, contact, email, notes, date, status, filename) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    pool.query(queryText, [req.body.company, req.body.contact, req.body.email, req.body.notes, req.body.date, req.body.filename, req.body.status])
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



// router.put('/:id', (req, res) => {
//     const queryText = 'UPDATE job SET notes = $1 WHERE id = $2';
//     pool.query(queryText, [req.body.notes, req.params.id])
//         .then((result) => {
//             console.log('result:', result.rows);
//             res.sendStatus(200);
//         })
//         .catch((err) => {
//             console.log('error:', err);
//             res.sendStatus(500);
//         });
// });
module.exports = router;