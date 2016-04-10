var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var multer = require('multer');
var upload = multer({"dest": "uploads/"}); // for parsing multipart/form-data
var ejs = require('ejs');

var path = require('path');
var fs = require('fs');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json())

app.use("/uploads", express.static("uploads"));

app.get('/', function(req, res) {
  fs.readdir("./uploads/",function(err, files){
    res.render("home.ejs", {"images": files});
  });
});

app.post('/upload', upload.single('photo'), function(req, res, next) {
  console.log(req.file);
  var source = path.join(__dirname , req.file.path);
  fs.readFile(source, "utf8", function(err, data){
    if(err) {
      return res.status(500).send("Error: " + err).end();
    }
    var dest = path.join(source, path.extname(req.file.originalname));
    console.log(dest);

    fs.rename(source, dest, function(err) {
      res.redirect("/");
      res.end();
      next();
    });
  });
});

app.listen(3000);
