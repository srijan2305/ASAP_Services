const express = require("express");
const app = express();
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { pool } = require("./dbConfig");
const initializePassport = require("./passportConfig");
const bodyParser = require("body-parser");

initializePassport(passport);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(bodyParser.json());

app.use(express.static("ASAP"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/ASAP/home.html");
});

app.get("/users/login", (req, res) => {
  // const messages = {
  //   success_msg: "Enter Your Credentials",
  // };
  res.render("login.ejs");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/home1", checkNotAuthenticated, (req, res) => {
  res.render("home1.html");
});

app.get("/users/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      throw err;
    }
  });
  //   req.flash("success_msg", "You have logged out");
  res.redirect("/home.html");
});

// app.get("/home", (req, res) => {
//   res.sendFile(__dirname + "/home.html");
// });

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  console.log({
    name,
    email,
    password,
    password2,
  });

  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }

  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          errors.push({ message: "Email already registered" });
          res.render("register", { errors });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              //   req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/home1.html",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/home1");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

//painting scheduling db
app.post("/schedule", (req, res) => {
  const { date, time, address } = req.body;

  pool.query(
    "INSERT INTO public.schedules (date,time,address) VALUES ($1, $2, $3)",
    [date, time, address],
    (err, result) => {
      if (err) {
        console.log("Error executing query", err);
        res.sendStatus(500);
      } else {
        console.log("Painting schedule inserted successfully");
        res.redirect("/payment.html");
      }
    }
  );
});

// electrical
app.post("/electrical", (req, res) => {
  const { date, time, address } = req.body;

  pool.query(
    "INSERT INTO public.electrical (date, time, address) VALUES ($1, $2, $3)",
    [date, time, address],
    (err, result) => {
      if (err) {
        console.log("Error executing query", err);
        res.sendStatus(500);
      } else {
        console.log("Electrical schedule inserted successfully");
        res.redirect("/payment.html");
      }
    }
  );
});

// plumbing
app.post("/plumbing", (req, res) => {
  const { date, time, address } = req.body;

  pool.query(
    "INSERT INTO public.plumbing (date, time, address) VALUES ($1, $2, $3)",
    [date, time, address],
    (err, result) => {
      if (err) {
        console.log("Error executing query", err);
        res.sendStatus(500);
      } else {
        console.log("Plumbing schedule inserted successfully");
        res.redirect("/payment.html");
      }
    }
  );
});

// cleaning
app.post("/cleaning", (req, res) => {
  const { date, time, address } = req.body;

  pool.query(
    "INSERT INTO public.cleaning (date, time, address) VALUES ($1, $2, $3)",
    [date, time, address],
    (err, result) => {
      if (err) {
        console.log("Error executing query", err);
        res.sendStatus(500);
      } else {
        console.log("Cleaning schedule inserted successfully");
        res.redirect("/payment.html");
      }
    }
  );
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
