const router = require('express').Router()
const db = require("../db")
const bcrypt = require('bcrypt');
const authMiddleware = require('../authMiddleware');
const jwt = require('jsonwebtoken');
const {
    secret
} = require("../config")

// all users
router.get('/', (req, res) => {
    db.query("SELECT * FROM users", (err, users) => {
        if (err) res.status(400).json(err);
        res.status(200).json(users);
    });
});

// registration
router.post('/', (req, res) => {
    try {
        if (req.body.email.length > 6 && req.body.name.length >= 4 && req.body.surname.length >= 4 && req.body.password.length >= 8) {
            db.query(`SELECT * from users WHERE email = "${req.body.email}"`, (err, users) => {
                if (users.length) {
                    let error = 'Account with this mail has already exsist. Please choose another email.';
                    return res.status(400).json(error);
                } else {
                    console.log('fin')
                    let user = {
                        email: req.body.email,
                        name: req.body.name,
                        surname: req.body.surname,
                    }
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) res.status(400).send(err);
                        bcrypt.hash(req.body.password, salt,
                            (err, hash) => {
                                if (err) res.status(400).send(err);
                                user.password = hash;
                                let sql = `INSERT INTO users set ?`;
                                db.query(sql, user, (err, u) => {
                                    if (err) res.status(400).send(err);
                                    res.status(200).send("You have successfully registered.");
                                });
                            });
                    });
                }
            });
        } else {
            res.status(400).send("Please enter all fields correctly!");
        }
    } catch (err) {
        res.status(400).send("Please enter all fields correctly!");
    }
});


// login
router.post('/login', (req, res) => {
    try {
        if (req.body.email.length > 6 && req.body.password.length >= 8) {
            let sql = `SELECT * from users WHERE email = "${req.body.email}"`;
            db.query(sql, (err, users) => {
                if (!users.length) {
                    return res.status(400).json('Account has not found.');
                } else {
                    bcrypt.compare(req.body.password, users[0].password)
                        .then(isMatch => {
                            if (isMatch) {
                                const payload = {
                                    id: users[0].id,
                                    username: users[0].email
                                };
                                jwt.sign(payload, secret, {
                                        expiresIn: 36000
                                    },
                                    (err, token) => {
                                        if (err) res.status(500)
                                            .json({
                                                error: "Error signing token",
                                                raw: err
                                            });
                                        res.status(200).send(`Bearer token ${token}`);
                                    });
                            } else {
                                res.status(400).json("Password is incorrect");
                            }
                        });
                }
            });
        } else {
            res.status(400).json("Please enter all fields correctly!");
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

// logout
router.get('/logout', authMiddleware, (req, res) => {
    res.clearCookie('connect.sid');
    res.status(200).send("You has successfully loged out")
});

// delete
router.delete('/', authMiddleware, (req, res) => {
    let sql = `DELETE FROM users WHERE id= ${req.user.id}`;
    res.clearCookie('connect.sid');
    db.query(sql, (err, results) => {
        res.status(200).json('Your account has been successfully deleted.')

    })
});

// update
router.put('/', authMiddleware, (req, res) => {
    try {
        if (req.body.email.length > 6 && req.body.name.length >= 4 && req.body.surname.length >= 4) {
            db.query(`SELECT * from users WHERE email = "${req.body.email}"`, (err, users) => {
                if (users.length) {
                    if (users[0].id !== req.user.id) {
                        let error = 'Email has allready used!';
                        return res.status(400).json(error);
                    }
                }
                let sql = `UPDATE users SET name="${req.body.name}", surname="${req.body.surname}", email="${req.body.email}" where id = ${req.user.id}`;
                db.query(sql, (err, u) => {
                    if (err) res.send({
                        err
                    });
                    res.status(200).send("You have successfully updated your account");
                });
            })
        } else {
            res.status(400).send("Please enter all fields correctly!");
        }
    } catch (err) {
        res.status(400).send("Please enter all fields correctly!");
    }
});


// find by id
router.get('/:id', (req, res) => {
    try {
        db.query(`SELECT * FROM users WHERE users.id = ${req.params.id}`, (err, users) => {
            if (users && users.length) {
                db.query(`SELECT note,createdAt,updatedAt,deletedAt,id FROM notes  WHERE author = ${req.params.id}`, (err, notes) => {
                    if (err) res.status(400).json(err);
                    users[0].notes = notes
                    res.status(200).json(users[0]);
                });
            } else res.status(400).json("User not found.");
        });
    } catch (err) {
        res.status(400).json(err);
    }
});


// update password
router.put('/newPassword', authMiddleware, (req, res) => {
    try {
        if (req.body.newPassword.length >= 8 && req.body.oldPassword.length >= 8) {
            db.query(`SELECT * from users WHERE id= "${req.user.id}"`, (err, users) => {
                bcrypt.compare(req.body.oldPassword, users[0].password)
                    .then(isMatch => {
                        if (isMatch) {
                            bcrypt.compare(req.body.newPassword, users[0].password)
                                .then(isMatch => {
                                    if (isMatch) return res.status(400).send("New password can't be same as old!!!")

                                    bcrypt.genSalt(10, (err, salt) => {
                                        if (err) res.status(400).send({
                                            err
                                        });
                                        bcrypt.hash(req.body.newPassword, salt,
                                            (err, hash) => {
                                                if (err) res.status(400).send(err);

                                                let sql = `UPDATE users SET password="${hash}" where id = ${req.user.id}`;
                                                db.query(sql, (err, u) => {
                                                    if (err) res.status(400).send(err);
                                                    res.status(200).send("Password has been changed successfully.");

                                                });
                                            });
                                    });
                                })
                        } else {
                            res.status(400).json("Password is incorrect");
                        }
                    });
            })
        } else {
            res.status(400).send("Please enter all fields correctly!");
        }
    } catch (err) {
        res.status(400).send("Please enter all fields correctly!");
    }
});
module.exports = router