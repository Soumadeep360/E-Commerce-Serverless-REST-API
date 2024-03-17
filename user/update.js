// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require("../helper/verifyToken");

module.exports = async function (params, context) {
  try {
    const tokenUser = await verifyToken(context);
    if (tokenUser != null) {
      const { _id } = tokenUser;
      const { name } = params;
      const userTable = await aircode.db.table('user');
      const user = await userTable
        .where({ _id })
        .projection({ isAdmin: 0, password: 0, accessToken: 0 })
        .findOne();
      
      if (user) {
        // Update the name
        user.name = name;
        
        await userTable.save(user);
        
        context.status(200);
        return { ...user };
      } else {
        context.status(404);
        return { "message": "User not found" };
      }
    } else {
      context.status(401);
      return { "message": "Invalid token or user not authorized" };
    }
  } catch (err) {
    context.status(500);
    return { "message": err.message };
  }
};
