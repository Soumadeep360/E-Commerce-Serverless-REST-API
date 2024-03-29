// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
    const tokenUser = await verifyToken(context);
  
    if(tokenUser!=null){
    const {_id,products,amount,address,status}=params;

    const orderTable =await aircode.db.table('order');

    try{
      const order=await orderTable.where({_id}).findOne();
        if(!tokenUser.isAdmin && status.toLowerCase()!=='cancel'){
          context.status(400);
          return {"message":"Order update not allowed!!"};
        }
        else
        {
          order.status=status || order.status
          order.address=address || order.address
          order.products=products || order.products
        }
      
      const result = await orderTable.save(order);
      context.status(200);
      return {
        result
      }
    }catch(err){
      return {"message":err.message};
    }
    
  }
  else{
    context.status(400)
    return {
      "message":"invalid token or user not Admin.."
    }
  }
};
