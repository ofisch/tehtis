const express = require("express");
const Database = require("better-sqlite3");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session); // Store sessions in SQLite

const app = express();
const db = new Database("database.db");

// määritellään CORS-asetukset
app.use(
  cors({
    origin: "http://localhost:5173", // annetaan frontendin osoite yhdistämistä varten
    credentials: true, // sallitaan evästeiden käyttö
  })
);

app.use(bodyParser.json());

// käytetään SQLiteStorea sessioiden tallentamiseen
app.use(
  session({
    store: new SQLiteStore({ db: "sessions.db", dir: "./" }),
    secret: "asfkasf13t90",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // vaihdetaan TRUE, jos HTTPS
      httpOnly: true,
      sameSite: "lax", // perehdy TÄHÄN
      maxAge: 60 * 60 * 1000, // tunti, kunnes sessio vanhenee
    },
  })
);

// varmistetaan, että sessio tallennetaan SQLite-tietokantaan
db.prepare(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, password TEXT)"
).run();

// luodaan testikäyttäjä, jos sitä ei ole olemassa
const testUser = db
  .prepare("SELECT * FROM users WHERE email = ?")
  .get("matti@posti");
if (!testUser) {
  db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(
    "matti",
    "matti@posti",
    "matti"
  );
}

// käyttäjän lisääminen
app.post("/add", (req, res) => {
  const { name, email, password } = req.body;
  const stmt = db.prepare(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
  );
  const info = stmt.run(name, email, password);
  res.json(info);
});

// sisäänkirjautuminen
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // säilötään sessioon käyttäjän id ja sähköposti
  req.session.userId = user.id;
  req.session.email = user.email;

  console.log("Session stored:", req.session);
  return res.json({ message: "Login successful", userId: user.id });
});

// varmistetaan session olemassaolo
app.get("/session", (req, res) => {
  if (req.session.userId) {
    return res.json({
      loggedIn: true,
      userId: req.session.userId,
      email: req.session.email,
    });
  } else {
    return res.json({ loggedIn: false });
  }
});

// uloskirjautuminen
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // poistetaan eväste
    res.json({ message: "Logged out successfully" });
  });
});

// haetaan kaikki käyttäjät
app.get("/users", (req, res) => {
  const rows = db.prepare("SELECT * FROM users").all();
  console.log("All users:", rows);
  res.json(rows);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
