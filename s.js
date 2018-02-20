"use strict"
if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}
var request = require('request');
var csv = require("fast-csv");
var Promise = require('bluebird');
var path = require('path');
const scrapeIt = require("scrape-it")
const fs = require('fs');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
var json = JSON.parse(fs.readFileSync('test.txt', 'utf8'));
var jsonProducts = [];
var urls = fs.readFileSync('handle.txt', 'utf8').split(';');
var models = json.map(x => x.model);
var logger = fs.createWriteStream('desc.txt', {
    flags: 'a'
})
var urls = [];
var urls_2 = [];
//var x = 1;
csv
.fromPath("products.csv")
.on("data", function(data){
    if(data[0]) {
        urls.push(data[7]);
    }
})
.on("end", function(){
    var id_single = 1539;
    urls.splice(0, id_single - 1);
    urls.splice(1, urls.length);
    
    urls_2 = urls.slice(0);
    var total = urls.length;
    var uncompleted = total;
    var running = false;
    console.log('Total products: ' + total)
    while (uncompleted != 0 && running == false) {
        running = true;
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
                },
                compatibility: {
                    listItem: "#compatibility tr",
                    data: {
                        manuf: "th",
                        models: "td"
                    }
                },
                specs: {
                    listItem: "#specs tr",
                    data: {
                        manuf: "th",
                        models: "td"
                    }
                },
            }).then(data=> {
                var id = 1539//urls_2.indexOf(url) + 1;
                var desc = "";
                if(data.oem.length > 0) {
                    desc += `<h3 class="area-title">OEM Part Number Cross References:</h3>`;
                    desc += `<table class="table table-bordered table-specs">`;
                    desc += `<tbody>`;
                    data.oem.forEach(element => {
                        if (data.oem.indexOf(element) == 0) {
                            desc += `<tr>`;
                            desc += `<th>Manufacturer</th>`;
                            desc += `<th>OEM Part #</th>`;
                            desc += `</tr>`;
                        } else {
                            desc += `<tr>`;
                            desc += `<td>${element.manuf}</td>`;
                            desc += `<td>${element.models}</td>`;
                            desc += `</tr>`;
                        }
                    });
                    
                    desc += `</tbody>`;
                    desc += `</table>`;
                }
    
                if(data.compatibility.length > 0) {
                    desc += `<h3 class="area-title">Compatibility:</h3>`;
                    desc += `<table class="table table-bordered table-specs">`;
                    desc += `<tbody>`;
                    data.compatibility.forEach(element => {
                        if (data.compatibility.indexOf(element) == 0) {
                            desc += `<tr>`;
                            desc += `<th>Manufacturer</th>`;
                            desc += `<th>Model</th>`;
                            desc += `</tr>`;
                        } else {
                            desc += `<tr>`;
                            desc += `<td>${element.manuf}</td>`;
                            desc += `<td>${element.models}</td>`;
                            desc += `</tr>`;
                        }
                    });
                    
                    desc += `</tbody>`;
                    desc += `</table>`;
                }
    
                if(data.specs.length > 0) {
                    desc += `<h3 class="area-title">Technical Specifications:</h3>`;
                    desc += `<table class="table table-bordered table-specs">`;
                    desc += `<tbody>`;
                    data.specs.forEach(element => {
                        desc += `<tr>`;
                        desc += `<td>${element.manuf}</td>`;
                        desc += `<td>${element.models}</td>`;
                        desc += `</tr>`;
                    });
                    
                    desc += `</tbody>`;
                    desc += `</table>`;
                }
                
                desc = desc.replace(`'`, `"`);
                logger.write("UPDATE `oc_product_description` SET `description`='" + desc + "' WHERE `product_id` = '" + id + "';\n");
                jsonProducts.push({id: id, desc: data.oem});
                uncompleted--;
                urls.splice(urls.indexOf(url), 1);
                console.log((total - uncompleted) + ' of ' + total)
                resolve();
            }).catch(errr => {
                console.log("Failed");
                resolve();
            });
        })).then(() => {
            console.log('All Products Downloaded!');
            var fs = require('fs');
            fs.writeFile("descJSON.txt", JSON.stringify(jsonProducts), function(err) {
                if(err) {
                    return console.log(err);
                }
            });
            running = false;
        }).catch(err => {
            console.error('Failed: ' + err);
        });   
    }
});

