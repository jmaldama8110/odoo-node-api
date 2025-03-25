"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("WELCOME  to Node JS with Typescript & Express");
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("Express running at port " + port);
});
