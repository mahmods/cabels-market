//import { filter } from "../../Users/Mahmoud/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/bluebird";
if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}
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
    '98':'Disposable ECG Leadwires',
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

    '103':'ECG Accessories',
    '104':'Toco Transducers',
    '105':'Transducer Repair Cables',
    '106':'Transducer Repair Cases',
    '107':'Temperature Adapters',
    '108':'Temperature Accessories',
    '109':'Fetal Accessories'
}

var parent = {
    'Direct-Connect SpO2 Sensors':'68',
    'Short SpO2 Sensors':'68',
    'SpO2 Adapter Cables':'68',
    'Disposable SpO2 Sensors':'68',
    'SpO2 Accessories':'68',
    'Disposable ECG Leadwires':'74',
    'Direct-Connect ECG Cables':'74',
    'ECG Leadwires':'74',
    'ECG Telemetry Leadwires':'74',
    'ECG Trunk Cables':'74',
    'Disposable Direct-Connect ECG Cables':'74',
    'Direct-Connect EKG Cables':'80',
    'EKG Trunk Cables':'80',
    'EKG Leadwires':'80',
    'EKG Accessories':'80',
    'NIBP Cuffs':'84',
    'NIBP Hoses':'84',
    'NIBP Connectors':'84',
    'IBP Adapter Cables':'88',
    'IBP Disposable Transducers':'88',
    'IBP Infusion Bags':'88',
    'Reusable Temperature Probes':'92',
    'Disposable Temperature Probes':'92',
    'Ultrasound Transducers':'95',
    'Oxygen Sensors':'99',
    'Flow Sensors':'99',
    'EtCO2 Sensors':'99',

    'ECG Accessories':'74',
    'Toco Transducers':'95',
    'Transducer Repair Cables':'95',
    'Transducer Repair Cases':'95',
    'Temperature Adapters':'92',
    'Temperature Accessories':'92',
    'Fetal Accessories':'95'
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
var handleFile = fs.createWriteStream('handle.txt', {
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
logger.write('TRUNCATE `oc_category_filter`;');

logger.write('INSERT INTO `oc_filter_group`(`filter_group_id`, `sort_order`) VALUES (NULL,"0");');
logger.write('INSERT INTO `oc_filter_group_description`(`filter_group_id`, `language_id`, `name`) VALUES ("1","1","Manufacturers");')
logger.write('INSERT INTO `oc_filter_group_description`(`filter_group_id`, `language_id`, `name`) VALUES ("1","2","Manufacturers");')
logger.write('INSERT INTO `oc_filter_group`(`filter_group_id`, `sort_order`) VALUES (NULL,"0");');
logger.write('INSERT INTO `oc_filter_group_description`(`filter_group_id`, `language_id`, `name`) VALUES ("2","1","Models");')
logger.write('INSERT INTO `oc_filter_group_description`(`filter_group_id`, `language_id`, `name`) VALUES ("2","2","Models");')
var filters = [];
var products = [];
var jsonProducts = [];
csv
.fromPath("products.csv")
.on("data", function(data){
    if(data[0]) {// && (cats.getKeyByValue(data[1]) != undefined || sub_cats.getKeyByValue(data[1]) != undefined))  {
        jsonProducts.push({id: x, model: data[0]})
        handleFile.write(data[7]+";");
    var sql = "INSERT INTO `oc_product`(`product_id`, `model`, `variant_title`, `sku`, `upc`, `ean`, `jan`, `isbn`, `mpn`, `location`, `quantity`, `stock_status_id`, `image`, `manufacturer_id`, `shipping`, `price`, `points`, `tax_class_id`, `date_available`, `weight`, `weight_class_id`, `length`, `width`, `height`, `length_class_id`, `subtract`, `minimum`, `sort_order`, `status`, `viewed`, `date_added`, `date_modified`) VALUES (NULL,'"+data[0]+"', '"+data[4]+"'"+',"","","","","","","","100","6","'+('catalog/products/images/'+data[0]+'.jpg')+'","0","1","'+data[5]+'","0","0",CURRENT_DATE(),"0","1","0","0","0","1","1","1","0","1","0",CURRENT_DATE(),CURRENT_DATE());'
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
        sql = 'INSERT INTO `oc_product_to_category`(`product_id`, `category_id`) VALUES ("'+x+'","'+parent[data[1]]+'");';
        console.log(parent[data[1]]);
        logger.write(sql);
    }
    

    sql = 'INSERT INTO `oc_product_to_store`(`product_id`, `store_id`) VALUES ("'+x+'","0");';
    logger.write(sql);

    var text = data[9];
    var regex = /(?:b'|\s*\w*\s*;)\s*(.*?):/g
    var manfs = text.match(regex);
    product_filter = [];
    while (m = regex.exec(text)) {
        if(!filters.includes(m[1])) {
            logger.write('INSERT INTO `oc_filter`(`filter_id`, `filter_group_id`, `sort_order`) VALUES (NULL,"1","0");');
            logger.write('INSERT INTO `oc_filter_description`(`filter_id`, `language_id`, `filter_group_id`, `name`) VALUES ("'+(filters.length+1)+'","1","1","'+m[1]+'");');
            logger.write('INSERT INTO `oc_filter_description`(`filter_id`, `language_id`, `filter_group_id`, `name`) VALUES ("'+(filters.length+1)+'","2","1","'+m[1]+'");');
            filters.push(m[1]);
        }
        logger.write('INSERT INTO `oc_product_filter` (`product_id`, `filter_id`) VALUES ("'+x+'", "'+(filters.indexOf(m[1])+1)+'");');
        var regex2 = new RegExp(m[1] + ": (.*?)(;|\.')");
        
        n = regex2.exec(text)
        if(n) {
            var s = n[1];
            s = s.split(',');
            //console.log(regex2)
            s.forEach(element => {
                
                element = element.trim()
                if(filters.includes(element)) {
                    if(!product_filter.includes(element)) {
                        product_filter.push(element);
                        logger.write('INSERT INTO `oc_product_filter` (`product_id`, `filter_id`) VALUES ("'+x+'", "'+(filters.indexOf(element)+1)+'");');
                    }
                } else {
                    if(!filters.includes(element) && !product_filter.includes(element)) {
                    filters.push(element);
                    product_filter.push(element);
                    logger.write('INSERT INTO `oc_filter`(`filter_id`, `filter_group_id`, `parent_id`, `sort_order`) VALUES (NULL,"2", "' + (filters.indexOf(m[1])+1) + '", "0");');
                    logger.write('INSERT INTO `oc_filter_description`(`filter_id`, `language_id`, `filter_group_id`, `name`) VALUES ("'+(filters.indexOf(element)+1)+'","1","2","'+element+'");');
                    logger.write('INSERT INTO `oc_filter_description`(`filter_id`, `language_id`, `filter_group_id`, `name`) VALUES ("'+(filters.indexOf(element)+1)+'","2","2","'+element+'");');
                    logger.write('INSERT INTO `oc_product_filter` (`product_id`, `filter_id`) VALUES ("'+x+'", "'+(filters.indexOf(element)+1)+'");');
                }}
            });
        }
    }
    if (data[10] != '{}') {
        data[10] = data[10].replace('{','').replace('}','').replace(/\'/g,'').split(',');
        data[10].forEach(element => {
                logger.write('INSERT INTO `oc_product_image`(`product_image_id`, `product_id`, `image`, `sort_order`) VALUES (NULL,"'+x+'","'+('catalog/products/images/'+data[0].replace(/[\/\\|&;$%@"<>()+,]/g, "-")+'_'+(data[10].indexOf(element)+1)+'.jpg')+'","0");');
        });
    }
    products.push({name:data[3],variant:data[4]});
    if(x == 1) {
        console.log(product_filter)
    }
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
    cats = [
        {id:'68',category:'SpO2'},
        {id:'74',category:'ECG'},
        {id:'80',category:'EKG'},
        {id:'84',category:'NIBP'},
        {id:'88',category:'IBP'},
        {id:'92',category:'Temperature'},
        {id:'95',category:'Fetal'},
        {id:'99',category:'O2'},

        {id:'69', category:'Direct-Connect SpO2 Sensors'},
        {id:'70', category:'Short SpO2 Sensors'},
        {id:'71', category:'SpO2 Adapter Cables'},
        {id:'72', category:'Disposable SpO2 Sensors'},
        {id:'73', category:'SpO2 Accessories'},
        {id:'98', category:'Disposable ECG Leadwires'},
        {id:'75', category:'Direct-Connect ECG Cables'},
        {id:'76', category:'ECG Leadwires'},
        {id:'77', category:'ECG Telemetry Leadwires'},
        {id:'78', category:'ECG Trunk Cables'},
        {id:'79', category:'Disposable Direct-Connect ECG Cables'},
        {id:'81', category:'Direct-Connect EKG Cables'},
        {id:'97', category:'EKG Trunk Cables'},
        {id:'82', category:'EKG Leadwires'},
        {id:'83', category:'EKG Accessories'},
        {id:'85', category:'NIBP Cuffs'},
        {id:'86', category:'NIBP Hoses'},
        {id:'87', category:'NIBP Connectors'},
        {id:'89', category:'IBP Adapter Cables'},
        {id:'90', category:'IBP Disposable Transducers'},
        {id:'91', category:'IBP Infusion Bags'},
        {id:'93', category:'Reusable Temperature Probes'},
        {id:'94', category:'Disposable Temperature Probes'},
        {id:'96', category:'Ultrasound Transducers'},
        {id:'100', category:'Oxygen Sensors'},
        {id:'101', category:'Flow Sensors'},
        {id:'102', category:'EtCO2 Sensors'},
        {id:'103', category:'ECG Accessories'},
        {id:'104', category:'Toco Transducers'},
        {id:'105', category:'Transducer Repair Cables'},
        {id:'106', category:'Transducer Repair Cases'},
        {id:'107', category:'Temperature Adapters'},
        {id:'108', category:'Temperature Accessories'},
        {id:'109', category:'Fetal Accessories'},
    ]
    cats.forEach(cat => {
        filters.forEach(filter => {
            logger.write('INSERT INTO `oc_category_filter`(`category_id`, `filter_id`) VALUES ("'+cat.id+'","'+(filters.indexOf(filter)+1)+'");');
        });
    });
    
    var fs = require('fs');
    fs.writeFile("test.txt", JSON.stringify(jsonProducts), function(err) {
        if(err) {
            return console.log(err);
        }
    });
    //console.log(products.map(p => p.name))
});