const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

const authenticateUser = (email, password, done) => {
  pool.query(
    `SELECT * FROM users WHERE email =$1`,
    [email],
    (error, result) => {
      if (error) {
        throw error;
      }
      console.log(result.rows);

      if (result.rows.length > 0) {
        const user = result.rows[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            throw err;
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Password is not correct",
            });
          }
        });
      } else {
        return done(null, false, { message: "Email is not registered" });
      }
    }
  );
};

function initialize(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
      if (err) {
        throw err;
      }
      return done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;
