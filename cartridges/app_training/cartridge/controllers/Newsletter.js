'use strict';

var server = require('server');

server.get("Begin", function(req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var actionUrl = URLUtils.url('Newsletter-Show');
    var form = server.forms.getForm("newsletter");
    res.render('newsletter/newsletter', {
        form: form,
        actionUrl: actionUrl
    });
    next();
});

server.post("Show", function(req, res, next) {
    var Transaction = require('dw/system/Transaction');
    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
    var CouponMgr = require('dw/campaign/CouponMgr');
    var Site = require('dw/system/Site');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');

    var form = req.form;
    var isSubscribed = false;

    Transaction.wrap(function() {
        if (!CustomObjectMgr.getCustomObject("NewsletterSubscription", form.dwfrm_newsletter_email)) {
            CustomObjectMgr.createCustomObject("NewsletterSubscription", form.dwfrm_newsletter_email);
            var emailObj = {
                to: form.dwfrm_newsletter_email,
                subject: "Newsletter Sign Up",
                from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@salesforce.com'
            };
            var context = {
                fname: form.dwfrm_newsletter_fname,
                lname: form.dwfrm_newsletter_lname,
                coupon: CouponMgr.getCoupon("20$offToEachOrder").getNextCouponCode()
            };
            emailHelpers.sendEmail(emailObj, 'email/newsletterSubscriptionEmail', {context: context});
        } else {
            isSubscribed = true;
        }
    });

    res.render("newsletter/newsletterSubscribed", {isSubscribed: isSubscribed});
    next();
});

module.exports = server.exports();
