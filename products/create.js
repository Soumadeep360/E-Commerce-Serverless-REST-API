// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { ReturnDocument }=require('mongodb');
const {verifyToken}=require('../helper/verifyToken')

module.exports = async function (params, context) {
 const tokenUser=await verifyToken(context);
  if(tokenUser!=null && tokenUser.isAdmin){
    const {title,description,inStock,category,price,color,size}=params;

    //checking mandatory fields..
    if(!title || !category || !price){
      context.status(400);
      return {"message":"Mandatory fields required"};
    }

    const productTable =await aircode.db.table('product');
    const productExist=await productTable
    .where({title}) // each product have a unique title..
    .findOne();
    
    if(productExist){
      context.status(400)
      return {
        "message":"Product already exists.."
      }
    }

    try{
      const result = await productTable.save(params);
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
