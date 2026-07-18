const http = require("http");
const url = require("url");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const SECRET_KEY = "your-secret-key-12345";
const REFRESH_SECRET_KEY = "your-refresh-secret-key-12345";

const DB_PATH = "src/Data/db.json";

function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { users: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch {
    // Ошибка игнорируется
  }
}

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const db = readDB();

  // Логин
  if (path === "/login" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const { email, password } = JSON.parse(body);
        const user = db.users.find((u) => u.email === email);

        if (!user || user.password !== password) {
          res.writeHead(401);
          res.end(JSON.stringify({ message: "Неверный логин или пароль" }));
          return;
        }

        const tokens = generateTokens(user);
        const { password: _, ...userWithoutPassword } = user;
        res.writeHead(200);
        res.end(JSON.stringify({ user: userWithoutPassword, tokens }));
      } catch {
        res.writeHead(401);
        res.end(JSON.stringify({ message: "Неверный логин или пароль" }));
      }
    });
    return;
  }

  // Регистрация
  if (path === "/register" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const {
          email,
          password,
          firstName,
          lastName,
          gender,
          birthDate,
          role = "user",
        } = JSON.parse(body);

        if (db.users.find((u) => u.email === email)) {
          res.writeHead(400);
          res.end(
            JSON.stringify({
              message: "Пользователь с таким email уже существует",
            }),
          );
          return;
        }

        const newUser = {
          id: String(Date.now()),
          email,
          password,
          firstName,
          lastName,
          gender,
          birthDate,
          role,
        };

        db.users.push(newUser);
        writeDB(db);

        const tokens = generateTokens(newUser);
        const { password: _, ...userWithoutPassword } = newUser;
        res.writeHead(200);
        res.end(JSON.stringify({ user: userWithoutPassword, tokens }));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ message: "Ошибка регистрации" }));
      }
    });
    return;
  }

  // Обновление токена
  if (path === "/refresh" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const { refreshToken } = JSON.parse(body);
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const user = db.users.find((u) => u.id === decoded.id);

        if (!user) {
          res.writeHead(401);
          res.end(JSON.stringify({ message: "Invalid refresh token" }));
          return;
        }

        const tokens = generateTokens(user);
        res.writeHead(200);
        res.end(JSON.stringify({ tokens }));
      } catch {
        res.writeHead(401);
        res.end(JSON.stringify({ message: "Invalid refresh token" }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ message: "Not Found" }));
});

server.listen(3001);
