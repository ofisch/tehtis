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

// luodaan taulu käyttäjille
db.prepare(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, password TEXT)"
).run();

// luodaan taulu kursseille
db.prepare(
  "CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY, name TEXT, description TEXT, ownerId INTEGER, FOREIGN KEY(ownerId) REFERENCES users(id) ON DELETE CASCADE)"
).run();

// luodaan testikurssi
const testCourse = db
  .prepare("SELECT * FROM courses WHERE name = ?")
  .get("Testikurssi");
if (!testCourse) {
  db.prepare(
    "INSERT INTO courses (name, description, ownerId) VALUES (?, ?, ?)"
  ).run("Testikurssi", "Tämä on testikurssi", 1);
}

// haetaan kaikki kurssit
app.get("/courses", (req, res) => {
  const rows = db.prepare("SELECT * FROM courses").all();
  res.json(rows);
});

// haetaan yksittäinen kurssi
app.get("/course-info/:id", (req, res) => {
  const { id } = req.params;
  const row = db.prepare("SELECT * FROM courses WHERE id = ?").get(id);
  res.json(row);
});

// haetaan kurssin osallistujat
app.get("/course-members/:id", (req, res) => {
  const { id } = req.params;
  const rows = db
    .prepare(
      "SELECT users.id, users.name, users.email FROM users JOIN course_members ON users.id = course_members.userId WHERE course_members.courseId = ?"
    )
    .all(id);
  res.json(rows);
});

// luodaan taulu osallistujille
db.prepare(
  `CREATE TABLE IF NOT EXISTS course_members (
    courseId INTEGER,
    userId INTEGER,
    FOREIGN KEY(courseId) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (courseId, userId)
  )`
).run();

// käyttäjä liittyy kurssille
app.post("/join-course", (req, res) => {
  const { courseId } = req.body;
  const { userId } = req.session;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const stmt = db.prepare(
      "INSERT INTO course_members (courseId, userId) VALUES (?, ?)"
    );
    const info = stmt.run(courseId, userId);
    res.json({ message: "Joined course successfully", info });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to join course", details: error.message });
  }
});

// opettaja liittää käyttäjän kurssille
app.post("/add-member-to-course", (req, res) => {
  const { courseId, userId } = req.body;

  if (!req.session.userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const stmt = db.prepare(
      "INSERT INTO course_members (courseId, userId) VALUES (?, ?)"
    );
    const info = stmt.run(courseId, userId);
    res.json({ message: "Added member to course successfully", info });
  } catch (error) {
    res.status(500).json({
      error: "Failed to add member to course",
      details: error.message,
    });
  }
});

// haetaan kurssit, joihin käyttäjä osallistuu
app.get("/my-courses", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const rows = db
    .prepare(
      "SELECT courses.id, courses.name, courses.description FROM courses JOIN course_members ON courses.id = course_members.courseId WHERE course_members.userId = ?"
    )
    .all(req.session.userId);

  res.json(rows);
});

// haetaan kurssin osallistujat
app.get("/course/:id/members", (req, res) => {
  const { id } = req.params;
  const rows = db
    .prepare(
      "SELECT users.id, users.name, users.email FROM users JOIN course_members ON users.id = course_members.userId WHERE course_members.courseId = ?"
    )
    .all(id);
  res.json(rows);
});

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
  req.session.name = user.name;
  req.session.email = user.email;

  console.log("Session stored:", req.session);
  return res.json({ message: "Login successful", userId: user.id });
});

//rekisteröityminen
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  // jos sähköposti on jo käytössä, palautetaan virhe
  if (user) {
    return res.status(409).json({ error: "User already exists" });
  }

  // lisätään uusi käyttäjä tietokantaan
  const stmt = db.prepare(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
  );
  const info = stmt.run(name, email, password);
  res.json(info);
});

// varmistetaan session olemassaolo
app.get("/session", (req, res) => {
  if (req.session.userId) {
    return res.json({
      loggedIn: true,
      userId: req.session.userId,
      email: req.session.email,
      username: req.session.name,
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
