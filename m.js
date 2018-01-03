//import { filter } from "../../Users/Mahmoud/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/bluebird";

var csv = require("fast-csv");
const fs = require('fs');

var x = 1;
var cats = {
    '68':'SpO2',
    '74':'ECG',
    '80':'EKG',
    '84':'NIBP',
    '88':'IBP',
    '92':'Temperature',
    '95':'Fetal',
    '99':'O2',
}
var sub_cats = {
    '69':'Direct-Connect SpO2 Sensors',
    '70':'Short SpO2 Sensors',
    '71':'SpO2 Adapter Cables',
    '72':'Disposable SpO2 Sensors',
    '73':'SpO2 Accessories',
    '98':'Disposable ECG Leadwire',
    '75':'Direct-Connect ECG Cables',
    '76':'ECG Leadwires',
    '77':'ECG Telemetry Leadwires',
    '78':'ECG Trunk Cables',
    '79':'Disposable Direct-Connect ECG Cables',
    '81':'Direct-Connect EKG Cables',
    '97':'EKG Trunk Cables',
    '82':'EKG Leadwires',
    '83':'EKG Accessories',
    '85':'NIBP Cuffs',
    '86':'NIBP Hoses',
    '87':'NIBP Connectors',
    '89':'IBP Adapter Cables',
    '90':'IBP Disposable Transducers',
    '91':'IBP Infusion Bags',
    '93':'Reusable Temperature Probes',
    '94':'Disposable Temperature Probes',
    '96':'Ultrasound Transducers',
    '100':'Oxygen Sensors',
    '101':'Flow Sensors',
    '102':'EtCO2 Sensors',
}
Object.prototype.getKeyByValue = function( value ) {
    for( var prop in this ) {
        if( this.hasOwnProperty( prop ) ) {
             if( this[ prop ] === value )
                 return prop;
        }
    }
}
var logger = fs.createWriteStream('log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  })
logger.write('TRUNCATE `oc_product`;');
logger.write('TRUNCATE `oc_product_description`;');
logger.write('TRUNCATE `oc_product_filter`;');
logger.write('TRUNCATE `oc_product_image`;');
logger.write('TRUNCATE `oc_product_variants`;');
logger.write('TRUNCATE `oc_product_to_category`;');
logger.write('TRUNCATE `oc_product_to_store`;');
logger.write('TRUNCATE `oc_filter_group`;');
logger.write('TRUNCATE `oc_filter_group_description`;');
logger.write('TRUNCATE `oc_filter`;');
logger.write('TRUNCATE `oc_filter_description`;');

logger.write('INSERT INTO `oc_filter_group`(`filter_group_id`, `sort_order`) VALUES (NULL,"0");');
logger.write('INSERT INTO `oc_filter_group_description`(`filter_group_id`, `language_id`, `name`) VALUES ("1","1","Manufacturers");')
logger.write('INSERT INTO `oc_filter_group_description`(`filter_group_id`, `language_id`, `name`) VALUES ("1","2","Manufacturers");')
logger.write('INSERT INTO `oc_filter_group`(`filter_group_id`, `sort_order`) VALUES (NULL,"0");');
logger.write('INSERT INTO `oc_filter_group_description`(`filter_group_id`, `language_id`, `name`) VALUES ("2","1","Models");')
logger.write('INSERT INTO `oc_filter_group_description`(`filter_group_id`, `language_id`, `name`) VALUES ("2","2","Models");')
var filters = [];
var products = [];
csv
.fromPath("products.csv")
.on("data", function(data){
    if(data[0] && (cats.getKeyByValue(data[1]) != undefined || sub_cats.getKeyByValue(data[1]) != undefined))  {
    var sql = 'INSERT INTO `oc_product`(`product_id`, `model`, `variant_title`, `sku`, `upc`, `ean`, `jan`, `isbn`, `mpn`, `location`, `quantity`, `stock_status_id`, `image`, `manufacturer_id`, `shipping`, `price`, `points`, `tax_class_id`, `date_available`, `weight`, `weight_class_id`, `length`, `width`, `height`, `length_class_id`, `subtract`, `minimum`, `sort_order`, `status`, `viewed`, `date_added`, `date_modified`) VALUES (NULL,"'+data[0]+'","'+data[4]+'","","","","","","","","100","6","'+('catalog/products/images/'+data[0]+'.jpg')+'","0","1","'+data[5]+'","0","0",CURRENT_DATE(),"0","1","0","0","0","1","1","1","0","1","0",CURRENT_DATE(),CURRENT_DATE());'
    logger.write(sql);
    sql = 'INSERT INTO `oc_product_description`(`product_id`, `language_id`, `name`, `description`, `tag`, `meta_title`, `meta_description`, `meta_keyword`) VALUES ("'+x+'","1","'+data[3]+'","","","'+data[3]+'","","");';
    
    logger.write(sql);

    sql = 'INSERT INTO `oc_product_description`(`product_id`, `language_id`, `name`, `description`, `tag`, `meta_title`, `meta_description`, `meta_keyword`) VALUES ("'+x+'","2","'+data[3]+'","","","'+data[3]+'","","");';
    
    logger.write(sql);
    if (cats.getKeyByValue(data[1]) != undefined && sub_cats.getKeyByValue(data[2]) != undefined) {
        sql = 'INSERT INTO `oc_product_to_category`(`product_id`, `category_id`) VALUES ("'+x+'","'+cats.getKeyByValue(data[1])+'");';
        logger.write(sql);
        sql = 'INSERT INTO `oc_product_to_category`(`product_id`, `category_id`) VALUES ("'+x+'","'+sub_cats.getKeyByValue(data[2])+'");';
        logger.write(sql);
    } else if (sub_cats.getKeyByValue(data[1]) != undefined) {
        sql = 'INSERT INTO `oc_product_to_category`(`product_id`, `category_id`) VALUES ("'+x+'","'+sub_cats.getKeyByValue(data[1])+'");';
        logger.write(sql);
    }
    

    sql = 'INSERT INTO `oc_product_to_store`(`product_id`, `store_id`) VALUES ("'+x+'","0");';
    logger.write(sql);

    var text = data[9];
    var regex = /(?:with|\s*\w*\s*;)\s(.*?):/g
    var manfs = text.match(regex);
    while (m = regex.exec(text)) {
        if(!filters.includes(m[1])) {
            logger.write('INSERT INTO `oc_filter`(`filter_id`, `filter_group_id`, `sort_order`) VALUES (NULL,"1","0");');
            logger.write('INSERT INTO `oc_filter_description`(`filter_id`, `language_id`, `filter_group_id`, `name`) VALUES ("'+(filters.length+1)+'","1","1","'+m[1]+'");');
            logger.write('INSERT INTO `oc_filter_description`(`filter_id`, `language_id`, `filter_group_id`, `name`) VALUES ("'+(filters.length+1)+'","2","1","'+m[1]+'");');
            filters.push(m[1]);
        }
        logger.write('INSERT INTO `oc_product_filter` (`product_id`, `filter_id`) VALUES ("'+x+'", "'+(filters.indexOf(m[1])+1)+'");');
        var regex2 = new RegExp(m[1] + ": (.*?);");
        
        n = regex2.exec(text)
        if(n) {
            var s = n[1].replace(' ', '');
            s = s.split(',');
            //console.log(regex2)
            s.forEach(element => {
                if(!filters.includes(element)) {
                    filters.push(element);
                    logger.write('INSERT INTO `oc_filter`(`filter_id`, `filter_group_id`, `sort_order`) VALUES (NULL,"2","0");');
                    logger.write('INSERT INTO `oc_filter_description`(`filter_id`, `language_id`, `filter_group_id`, `name`) VALUES ("'+(filters.indexOf(element)+1)+'","1","2","'+element+'");');
                    logger.write('INSERT INTO `oc_filter_description`(`filter_id`, `language_id`, `filter_group_id`, `name`) VALUES ("'+(filters.indexOf(element)+1)+'","2","2","'+element+'");');
                }
                logger.write('INSERT INTO `oc_product_filter` (`product_id`, `filter_id`) VALUES ("'+x+'", "'+(filters.indexOf(element)+1)+'");');
            });
        }
    }
    //console.log(data[10])
    if (data[10] != '{}') {
        data[10] = data[10].replace('{','').replace('}','').replace(/\'/g,'').split(',');
        data[10].forEach(element => {
            logger.write('INSERT INTO `oc_product_image`(`product_image_id`, `product_id`, `image`, `sort_order`) VALUES (NULL,"'+x+'","'+('catalog/products/images/'+data[0].replace(/[\/\\|&;$%@"<>()+,]/g, "-")+'_'+(data[10].indexOf(element)+1)+'.jpg')+'","0");');
        });
    }
    products.push({name:data[3],variant:data[4]});
    x++;
}
})
.on("end", function(){
    //logger.write(cats.getKeyByValue('O2'));
    products.forEach(product => {
        products.forEach(product2 => {
            if(product.name == product2.name) {
                logger.write('INSERT INTO `oc_product_variants`(`product_id`, `variants_id`) VALUES ("'+(products.indexOf(product)+1)+'","'+(products.indexOf(product2)+1)+'");');
            }
        });
    });
    //console.log(products.map(p => p.name))
});