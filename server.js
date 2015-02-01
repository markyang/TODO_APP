var http = require('http'),
    express = require('express'),
    app = express(),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database(':memory:');


app.configure(function() {
    app.set('views', __dirname);
    app.engine('.html', require('jade').__express);
    app.use(express.bodyParser());
});

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='TODO'", function(err, row) {
    if(err !== null) {
        console.log(err);
    }
    else  {
        db.run('CREATE TABLE "TODO" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "title" VARCHAR(255))', function(err) {
            if(err !== null) {
                console.log(err);
            }
            else {
                console.log("SQL Table 'TODO' initialized.");
            }
        });
    }
});

app.get('/', function(req, res) {

    db.all('SELECT * FROM TODO ORDER BY id', function(err, row) {
        if(err !== null) {
            res.send(500, "An error has occurred -- " + err);
        }
        else {
            res.render('index.jade', {lists: row}, function(err, html) {
                res.send(200, html);
            });
        }
    });
});

app.post('/add', function(req, res) {
    title = req.body.title;
    url = req.body.url;
    sqlRequest = "INSERT INTO 'TODO' (title) VALUES('" + title + "')";
    db.run(sqlRequest, function(err) {
        if(err !== null) {
            res.send(500, "An error has occurred -- " + err);
        }
        else {
            res.redirect('back');
        }
    });
});

app.get('/delete/:id', function(req, res) {
    db.run("DELETE FROM TODO WHERE id='" + req.params.id + "'", function(err) {
        if(err !== null) {
            res.send(500, "An error has occurred -- " + err);
        }
        else {
            res.redirect('back');
        }
    });
});

var server = http.createServer(app).listen("3000", "127.0.0.1", function() {
console.log("http://127.0.0.1:3000");
});
