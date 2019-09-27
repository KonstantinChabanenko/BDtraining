"use strict";

var server = require("server");
var page = module.superModule;
server.extend(page);

server.append("AddProduct", function(req, res, next) {
    var Site = require('dw/system/Site');
    var ProductMgr = require("dw/catalog/ProductMgr");
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var currentCustomer = req.currentCustomer;
    var product = ProductMgr.getProduct(req.form.pid);
    if (currentCustomer.raw.authenticated) {
        var emailObj = {
            to: currentCustomer.profile.email,
            subject: "Test email",
            from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@salesforce.com'
        };

        emailHelpers.sendEmail(emailObj, 'email/myTemplate', {product: product});
    }
    next();
});

module.exports = server.exports();
