const db = require("./db")
module.exports = function(passport) {

    // serialize user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize user
    passport.deserializeUser(function(id, done) {
        db.query("select * from users where id = " + id, function(err, rows) {
            done(err, rows[0]);
        });
    });

};