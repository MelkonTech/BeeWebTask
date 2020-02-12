const { Strategy, ExtractJwt } = require('passport-jwt');
const { secret } = require("./config")
const db = require('./db');
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

//this sets how we handle tokens coming from the requests that come
// and also defines the key to be used when verifying the token.
module.exports = passport => {
    passport.use(
        new Strategy(opts, (payload, done) => {
            db.query("select * from users where id = '" + payload.id + "'", function(err, users) {
                if (Array.isArray(users) && users.length) {
                    return done(null, {
                        id: users[0].id,
                        email: users[0].email,
                    });
                }
                return done(null, false)
            })
        })
    );
};