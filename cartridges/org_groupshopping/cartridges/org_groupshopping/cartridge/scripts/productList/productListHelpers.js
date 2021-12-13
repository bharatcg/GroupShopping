var base = module.superModule;
var extend = base;
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');

/**
* Add an Item to the current customers wishlist
* @param {dw.customer.ProductList} list - target productList
* @param {string} pid - The product's variation model
* @param {Object} config - configuration object
* @return {boolean} - boolean based on if the product was added to the wishlist
*/
extend.addItem = function (list, pid, config) {
    var Transaction = require('dw/system/Transaction'); 
    if (!list) { 
        return false; 
    } 
    var itemExist = base.itemExists(list, pid, config); 
    if (!itemExist) {
        var ProductMgr = require('dw/catalog/ProductMgr');
        var apiProduct = ProductMgr.getProduct(pid);
        if (apiProduct.variationGroup) {
            return false;
        }
        if (apiProduct && list && config.qty) {
            try {
                Transaction.wrap(function () {
                    var productlistItem = list.createProductItem(apiProduct);
                    var customerName;
                    var loggedIn = config.req.currentCustomer.profile;
                    if (loggedIn) {
                        customerName = config.req.currentCustomer.profile.firstName + ' ' + config.req.currentCustomer.profile.lastName
                    } else {
                        customerName = 'GuestUser';
                    }
                    productlistItem.custom.addedBy = customerName;
                    if (apiProduct.optionProduct) {
                        var optionModel = apiProduct.getOptionModel();
                        var option = optionModel.getOption(config.optionId);
                        var optionValue = optionModel.getOptionValue(option, config.optionValue); optionModel.setSelectedOptionValue(option, optionValue);
                        productlistItem.setProductOptionModel(optionModel);
                    } if (apiProduct.master) {
                        productlistItem.setPublic(false);
                    } productlistItem.setQuantityValue(config.qty);
                });
            } catch (e) {
                return false;
            }
        } if (config.type === 10) {
           base.updateWishlistPrivacyCache(config.req.currentCustomer.raw, config.req, config);
        }
        return true;
    } else if (itemExist && config.type === 11) {
        Transaction.wrap(function () {
            itemExist.setQuantityValue(itemExist.quantityValue + config.qty);
        });
        return true;
    } return false;
};
module.exports = extend;

