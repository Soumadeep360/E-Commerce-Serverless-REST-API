// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');

module.exports = async function (params, context) {
 const productTable=aircode.db.table('product');
  const product=await productTable.where().find();
  const productCount=await productTable.where().count();
  return{
    productCount, 
    product
  }
};
