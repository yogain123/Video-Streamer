const express = require("express");
const router = express.Router();
const fs = require("fs");
var zlib = require("zlib");
const path = require("path");

router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

router.get("/video/v0", (req, res) => {
  let path = "./assets/sample.mp4";
  let result = fs.readFileSync(path);
  const head = {
    "Content-Type": "video/mp4"
  };
  res.setHeader("Content-Type", "video/mp4");
  res.send(result);
});

router.get("/video/v1", (req, res) => {
  const path = "./assets/sample.mp4";
  const head = {
    "Content-Type": "video/mp4"
  };
  res.writeHead(200, head);
  fs.createReadStream(path).pipe(res);
});

router.get("/video/v2", function(req, res) {
  const path = "assets/sample.mp4";
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  console.log("routerrrr");
  if (range) {
    console.log("inside if");
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    console.log("inside else");
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

module.exports = router;
