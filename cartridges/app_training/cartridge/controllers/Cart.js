'use strict';

var server = require('server');
var page = module.superModule;
server.extend(page);

server.append("Show", function(req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Site = require('dw/system/Site');
    var currentBasket = BasketMgr.getCurrentBasket();
    var totalPrice = currentBasket.adjustedMerchandizeTotalGrossPrice;
    var thresholdPrice = Site.current.getCustomPreferenceValue("thresholdPrice");
    var viewData = res.getViewData();
    viewData.totalPriceIsMore = totalPrice > thresholdPrice;
    viewData.thresholdPrice = thresholdPrice;
    viewData.totalPrice = totalPrice;
    res.setViewData(viewData);
    next();
});

module.exports = server.exports();
