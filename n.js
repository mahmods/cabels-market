"use strict"
if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}
var request = require('request');
var Promise = require('bluebird');
var c = 0;
var total = 2008;
var path = require('path');
const scrapeIt = require("scrape-it")
const fs = require('fs');
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
var json = JSON.parse(fs.readFileSync('test.txt', 'utf8'));
var jsonProducts = [];
var urls = fs.readFileSync('handle.txt', 'utf8').split(';');
var models = json.map(x => x.model);
var logger = fs.createWriteStream('desc.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  })
// Scrape Emma's profile
Promise.each(urls, url => new Promise((resolve, reject) => {
    scrapeIt({
        url: url,
        headers: { "User-agent": USER_AGENT }
    }, {
        model: ".variant-sku",
        oem: {
            listItem: "#oems- .table-specs tr",
            data: {
                manuf: "th",
                models: "td"
            }
        }
    }).then( data=> {
        var p = json[models.indexOf(data.model.trim())];
        if (p) {
            var id = p.id;
            if (id) {
                var desc = "";
                desc += `<table class="table table-bordered table-specs">`;
                desc += `<tbody>`;
                data.oem.forEach(element => {
                    desc += `<tr>`;
                    desc += `<td>${element.manuf}</td>`;
                    desc += `<td>${element.models}</td>`;
                    desc += `</tr>`;
                });
                desc += `</tbody>`;
                desc += `</table>`;
                
                logger.write("UPDATE `oc_product_description` SET `description`='"+desc+"' WHERE `product_id` = '"+id+"'");
                jsonProducts.push({id: id, desc: data.oem});
                c++;
                console.log(c + ' of ' + total)
                resolve();
            }
        }
    }).catch(console.error) 
})).then(() => {
    console.log('All Image Downloaded!');
    var fs = require('fs');
    fs.writeFile("descJSON.txt", JSON.stringify(jsonProducts), function(err) {
        if(err) {
            return console.log(err);
        }
    });
}).catch(err => {
    console.error('Failed: ' + err.message);
});