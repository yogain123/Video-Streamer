const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

const routing = require("./routing");
app.use(bodyParser.json());

app.use("/", routing);

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
