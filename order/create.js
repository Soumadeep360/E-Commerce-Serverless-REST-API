// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { ReturnDocument }=require('mongodb');
const {verifyToken}=require('../helper/verifyToken')

module.exports = async function (params, context) {
 const tokenUser=await verifyToken(context);
  if(tokenUser!=null){
    const {products,amount,address,status}=params;

    //checking mandatory fields..
    if(!products || !amount || !address){
      context.status(400);
      return {"message":"Mandatory fields required"};
    }

    const orderTable =await aircode.db.table('order');

    try{
      const order={
        ...params,
        userId:tokenUser._id
      }
      const result = await orderTable.save(order);
      context.status(201);
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
