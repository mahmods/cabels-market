var csv = require("fast-csv");
var fs = require('fs');
var request = require('request');
var Promise = require('bluebird');
var path = require('path');

var download = function(uri, filename){
    request.head(uri, function(err, res, body){
    
        request(uri).pipe(fs.createWriteStream('images/'+filename));
      });
  };
images = [];
csv
.fromPath("products.csv")
.on("data", function(data){
    if(data[0] && data[8]) {
        //download(data[8], data[0].replace(/[|&;$%@"<>()+,]/g, "-")+'.jpg');
        images.push({url: data[8], file_name: data[0].replace(/[\/\\|&;$%@"<>()+,]/g, "-")+'.jpg'});
        //console.log(data[10])
        if (data[10] != '{}') {
            data[10] = data[10].replace('{','').replace('}','').replace(/\'/g,'').split(',');
            data[10].forEach(element => {
                images.push({url: element, file_name: data[0].replace(/[\/\\|&;$%@"<>()+,]/g, "-")+'_'+(data[10].indexOf(element)+1)+'.jpg'});
            });
        }
    }
})
.on("end", function(){
    //console.log(images);
    // To Download Serially
Promise.each(images, image => new Promise((resolve, reject) => {
    if (!fs.existsSync('images/'+image.file_name)){
    request(image.url).on('error', reject).pipe(fs.createWriteStream(path.join(__dirname, 'images/'+image.file_name))).on('finish', () => {
        resolve();
    });} else {
        resolve();
    }
})).then(() => {
    console.log('All Image Downloaded!');
}).catch(err => {
    console.error('Failed: ' + err.message);
});

});
