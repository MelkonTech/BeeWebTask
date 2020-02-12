const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');
const notesRouter = require("./routes/notes");
const usersRouter = require("./routes/users");
const passport = require('passport');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))

require('./passport-config.js')(passport);

app.use(passport.initialize());

// routes 
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/*", (req, res) => res.status(404).send("Error 404: URL was not found."))


// Server listening
app.listen(3000, () => {
    console.log('Server started on port 3000...');
});