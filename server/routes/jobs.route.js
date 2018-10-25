const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
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

router.get('/:id', (req, res) => {
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

router.get('/filename/:id', (req, res) => {
    console.log('in filename');
    const queryText = 'SELECT filename FROM job WHERE id=$1';
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

router.delete('/:id', (req, res) => {
    const queryText = 'DELETE FROM job WHERE id = $1';
    pool.query(queryText, [req.params.id])
        .then((result) => {
            console.log('result:', result.rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });

});

router.put('/update/:id', (req, res) => {
    const queryText = 'UPDATE job SET company = $1, contact = $2, email = $3, position = $4, notes = $5, date = $6, status = $7, filename = $8 WHERE id = $9';
    pool.query(queryText, [req.body.company, req.body.contact, req.body.email, req.body.position, req.body.notes, req.body.date, req.body.status, req.body.filename, req.params.id])
        .then((result) => {
            console.log('result:', result.rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
})

router.post('/', (req, res) => {
    const queryText = 'INSERT INTO job (company, email, contact, position, notes, date, status, filename) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    pool.query(queryText, [req.body.company, req.body.email, req.body.contact, req.body.position, req.body.notes, req.body.date, req.body.status, req.body.filename])
        .then((result) => {
            console.log('result:', result.rows);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
});

// clear all server session information about this user
router.get('/logout', (req, res) => {
    // Use passport's built-in method to log out the user
    req.logout();
    res.sendStatus(200);
});



module.exports = router;