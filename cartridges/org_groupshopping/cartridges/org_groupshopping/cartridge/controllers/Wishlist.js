'use strict';

var server = require('server');
server.extend(module.superModule);
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');

server.append('AddProduct', function (req, res, next) {
    var viewData = res.getViewData();
    var loggedIn = req.currentCustomer.profile;
    var customerName;
    
    if (loggedIn) {
        customerName = req.currentCustomer.profile.firstName+" "+req.currentCustomer.profile.lastName;
        
    } else {
        customerName = 'GuestUser';
    }

    var Transaction = require('dw/system/Transaction');
    var productList = productListHelper.getList(req.currentCustomer.raw, { type: 10 });
    // var abc = productList;
    var listItems = productList.items;
    for (var i = 0; i < listItems.size(); i++) {
        var listItem = listItems[i];
        Transaction.wrap(function () {
            listItem.custom.addedBy = customerName;
           
        });
    }
    return next();
});

module.exports = server.exports();
