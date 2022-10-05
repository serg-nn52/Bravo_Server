"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const cors = require("cors");
const path = require("path");
const uuid_1 = require("uuid");
const jsonParser = express_1.default.json();
const app = (0, express_1.default)();
app.use(cors());
const filePath = "data.json";
const PORT = process.env.PORT || 5000;
const corsReq = cors();
// GET - request----------------------------------------------
app.get("/api/books", corsReq, (req, res) => {
    try {
        const content = fs_1.default.readFileSync(filePath, "utf-8");
        const books = JSON.parse(content);
        res.send(books);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
// POST - request---------------------------------------------
app.post("/api/books", corsReq, jsonParser, (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send();
        }
        const { body: { name, title }, } = req;
        const id = (0, uuid_1.v4)();
        const book = { id, name, title };
        const data = fs_1.default.readFileSync(filePath, "utf-8");
        const books = JSON.parse(data);
        books.push(book);
        const content = JSON.stringify(books);
        fs_1.default.writeFileSync(filePath, content);
        res.sendStatus(200);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
app.use(express_1.default.static(path.resolve(__dirname, "./build")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./build/index.html"));
});
app.listen(PORT, () => {
    console.log(`Start server port ${PORT} on http://localhost:${PORT}`);
});
