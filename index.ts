import express from "express";
import fs from "fs";
import cors = require("cors");
import path = require("path");
import { v4 as uuidv4 } from "uuid";

const jsonParser = express.json();
const app = express();
app.use(cors());
const filePath = "data.json";
const usersPath = "users.json";
const PORT = process.env.PORT || 5000;
const corsReq = cors();

type TBooksType = {
  id: string;
  name: string;
  title: string;
};
type TUsersType = {
  id: string;
  name: string;
};

// GET - request users----------------------------------------------

app.get("/api/users", corsReq, (req, res) => {
  try {
    const content = fs.readFileSync(usersPath, "utf-8");
    const users: TUsersType[] = JSON.parse(content);
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

// GET - request----------------------------------------------

app.get("/api/books", corsReq, (req, res) => {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const books: TBooksType[] = JSON.parse(content);
    res.send(books);
  } catch (err) {
    res.status(400).send(err);
  }
});

// POST - request---------------------------------------------

app.post("/api/books", corsReq, jsonParser, (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send();
    }

    const {
      body: { name, title },
    } = req;
    const id = uuidv4();

    const book: TBooksType = { id, name, title };
    const data = fs.readFileSync(filePath, "utf-8");
    const books: TBooksType[] = JSON.parse(data);
    books.push(book);
    const content = JSON.stringify(books);

    fs.writeFileSync(filePath, content);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.use(express.static(path.resolve(__dirname, "./build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Start server port ${PORT} on http://localhost:${PORT}`);
});
