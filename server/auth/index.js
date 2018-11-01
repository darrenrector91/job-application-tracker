const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Test successful!'
    });
});

function validUser(user) {
    const validEmail = typeof user.email == 'string' && user.email.trim() != '';
    const validPassword = typeof user.password == 'string' && user.password.trim() != '' && user.password.trim().length >= 6;

    return validEmail && validPassword;
}

router.post('/signup', (req, res, next) => {
    if (validUser(req.body)) {
        res.json({
            message: '✅'
        })
    }
    else {
        next(new Error('Invalid user!'))
    }

});

module.exports = router;