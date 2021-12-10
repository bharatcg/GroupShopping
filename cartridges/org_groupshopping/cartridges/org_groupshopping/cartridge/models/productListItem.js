'use strict';

var base = module.superModule;

/**

 * creates a plain object that contains product list item information

 * @param {dw.customer.ProductListItem} productListItemObject - productlist Item

 * @returns {Object} an object that contains information about the users address

 */

function createProductListItemObject(productListItemObject) {

    base.call(this, productListItemObject);

    var result = this.productListItem;

    if (productListItemObject) {

        result.addedBy = productListItemObject.custom.addedBy;
        

        return { productListItem: result };

    }

    return result;

}

module.exports = createProductListItemObject;