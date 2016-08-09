'use strict';

// ----------------
//   Dependencies
// ----------------

var Config                      = require('../config.json');
var Request                     = require('request');
var Multiparty                  = require('multiparty');

// ---------------------
//   Process Image Upload
// ---------------------
exports.upload = function(req, res) {

    var imgCategory = req.headers['category'];
    var uploadStream = null;

    // Parse a multipart form data
    var form = new Multiparty.Form();

    form.on('part', function(part) {
        // check whether part is file or field
        if (!part.filename) {
            part.resume();
        } else {
            // Part is file. upload file...
            var fileName = part.filename;
            var category = (imgCategory && imgCategory != '') ? imgCategory : 'uncategorized';

            var uploadDirName = get_image_upload_path(category, fileName);
            var uploadUrl = Config.images_cdn.server + uploadDirName + "/" + fileName;

            // Create upload stream
            uploadStream = create_upload_stream_request(uploadDirName, fileName);

            part.pipe(uploadStream).on('end', function(){
                upload_complete(res, uploadUrl);
            }).on('error', function(err){
                upload_error(res, err);
            });
        }
    });

    form.on('error', function(err) {
        upload_error(res, err);
    });

    form.parse(req);
}


// ---------------------
//   Create Request Stream to Files server
// ---------------------
function create_upload_stream_request(dirname, filename){
    return Request.put({
        url: Config.images_cdn.server +'/upload',
        json: true,
        headers: {
            'dirname' : dirname,
            'filename' : filename
        }
    });
}

// ---------------------
//   Create image upload path
// ---------------------
function get_image_upload_path(imgCategory, imgName) {
    var imgHash = generate_file_hash(imgName);
    var date = new Date(),
        pathArray = [
            Config.images_cdn.path,
            imgCategory,
            date.getFullYear(),
            date.getMonth()+1,
            date.getDate(),
            imgHash
        ];
    return pathArray.join('/');
};

// ---------------------
//   Generate hashed unique image name
// ---------------------
function generate_file_hash (data) {
    var crypto = require('crypto'),
        md5sum = crypto.createHash('md5');
    md5sum.update(data);
    return md5sum.digest('hex');
};


// ---------------------
//   Upload complete callback
// ---------------------
function upload_complete(res, url) {
    res.json(200, {imgUrl: url});
}


// ---------------------
//   Upload Error callback
// ---------------------
function upload_error(res, err) {
    res.json(500, {error: {message: err.message}});
}