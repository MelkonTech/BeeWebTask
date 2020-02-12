const router = require("express").Router();
const db = require("../db")
const authMiddleware = require('../authMiddleware');

//show all notes
router.get('/', (req, res) => {
    let sql = `SELECT notes.note,users.email as author,notes.createdAt,notes.updatedAt,notes.deletedAt,notes.id as noteId,users.id as userId FROM notes INNER JOIN users ON users.id=notes.author where notes.deletedAt is Null`
    db.query(sql, (err, notes) => {
        if (err) throw err;
        res.status(200).send(notes);
    });
});

//show single note
router.get('/:id', (req, res) => {
    let sql = `SELECT notes.note,users.email as author,notes.createdAt,notes.updatedAt,notes.deletedAt,notes.id as noteId,users.id as userId FROM notes INNER JOIN users ON users.id=notes.author WHERE notes.id=${req.params.id} and notes.deletedAt is Null`;
    db.query(sql, (err, notes) => {
        if (err) res.status(400).send(err);
        if (notes && notes.length) {
            res.status(200).send(notes);
        } else res.status(400).json("Note not found.");
    });
});

//add new note
router.post('/', authMiddleware, (req, res) => {
    db.query(`INSERT INTO notes(note,author) values("${req.body.note ? req.body.note : "Untitled"}",${req.user.id})`, (err, u) => {
        if (err) res.status(400).send(err);
        res.status(200).send("Your note has been successfuly posted.");
    });
});



// update note
router.put('/:id', authMiddleware, (req, res) => {
    db.query(`SELECT * from notes WHERE id = "${req.params.id}"`, (err, notes) => {
        if (!notes && !notes.length || notes[0].deletedAt) {
            return res.status(400).json("Note doesn't found.");
        } else if (notes[0].author !== req.user.id) {
            return res.status(400).json("You don't have access!!!");
        }
        let sql = `UPDATE notes SET note="${req.body.note}" where id = ${notes[0].id}`;
        db.query(sql, (err, u) => {
            if (err) res.send({
                err
            });
            return res.status(200).send("You have successfully updated your note.");
        });
    })
});

// delete note
router.delete('/:id', authMiddleware, (req, res) => {
    db.query(`SELECT * from notes WHERE id = "${req.params.id}"`, (err, notes) => {
        if (!notes && !notes.length || notes[0].deletedAt) {
            return res.status(400).json("Note doesn't found.");
        } else if (notes[0].author !== req.user.id) {
            return res.status(400).json("You don't have access!!!");
        }
        let sql = `UPDATE notes SET deletedAt=NOW() where id = ${notes[0].id}`;
        db.query(sql, (err, u) => {
            if (err) res.send({
                err
            });
            return res.status(200).send("You have successfully deleted your note.");
        });
    })
});

module.exports = router;