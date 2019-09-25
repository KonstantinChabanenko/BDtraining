'use strict';

var server = require('server');
var page = module.superModule;
server.extend(page);

server.append("Show", function(req, res, next) {
    var ProductMgr = require("dw/catalog/ProductMgr");
    var viewData = res.getViewData();
    var product = ProductMgr.getProduct(viewData.product.id);
    product = product.isVariant() ? product.getMasterProduct() : product;
    var primaryCategory = product.getPrimaryCategory();
    var products = primaryCategory.getProducts();
    products.remove(product);
    viewData.products = products;
    res.setViewData(viewData);
    next();
});

module.exports = server.exports();
