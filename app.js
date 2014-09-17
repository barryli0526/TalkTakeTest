/**
 * Created with JetBrains WebStorm.
 * User: bli111
 * Date: 9/17/14
 * Time: 9:29 AM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Module dependencies.
 */

var path = require('path');
var express = require('express');
var fs = require('fs');
var mime = require('mime');
//var ejsfilter = require('./lib/ejs_filter');

/**
 *   Instantiate redis
 */



var app = express.createServer();

app.configure(function () {
    var viewsRoot = path.join(__dirname, 'views');
    app.set('view engine', 'html');
    app.set('views', viewsRoot);
    app.register('.html', require('ejs'));
//    app.use(express.bodyParser({
//        uploadDir: path.join(__dirname,config.upload_dir)
//    }));
    app.use(express.bodyParser({uploadDir:'./upload'}));
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'TalkTakeTest'
    }));

    app.use(express.static(__dirname + '/public'));
});





//if (process.env.NODE_ENV !== 'test') {
app.listen(3002);

console.log("You can debug your app with http://localhost:3002");

app.get('/', function(req, res){
    res.render('index',{
        layout:null
    });
});

app.get('/sampleData', function(req, res){
    var file = '../Talk Take/Sample/photos.js';

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
});

app.post('/updateSampleData', function(req, res){
    //var files = req.files.files ;
    // 获得文件的临时路径
    var tmp_path = req.files.file.path;

    // 指定文件上传后的目录 - 示例为"images"目录。
    var target_path = '../Talk Take/Sample/' + req.files.file.name;

    console.log(target_path);
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // 删除临时文件夹文件,
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes');
        });
    });
});



//}

module.exports = app;


