// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  try {
    const tokenUser = await verifyToken(context);
    if (tokenUser != null && tokenUser.isAdmin) {
      const { _id, title, description, inStock, category, price, color, size } =
        params;

      const productTable = aircode.db.table('product'); //no need of await as it is not returning any promise..
      const product = await productTable
        .where({ _id })
        .projection({ isAdmin: 0, password: 0, accessToken: 0 })
        .findOne();

      if (product) {
        const result =await productTable.save(params);

        context.status(200);
        return { ...result };
      } else {
        context.status(404);
        return { message: 'product not found' };
      }
    } else {
      context.status(401);
      return { message: 'Invalid token or user not authorized' };
    }
  } catch (err) {
    context.status(500);
    return { message: err.message };
  }
};
