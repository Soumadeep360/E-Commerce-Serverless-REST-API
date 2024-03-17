// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const bcrypt=require('bcrypt')
module.exports = async function (params, context) {
  console.log('Received params:', params);
  console.log('Received context:', context);

  const {name,email,password}=params;
    if(!name || !email || !password){
        context.status(400);
      return {
        "message":"All fields are required!"
      }
    }
  const userTable=await aircode.db.table('user')

  const userExsits=await userTable
    .where({email})
    .findOne();
  
//check wherther user already exists or not..  
    if(userExsits){
        context.status(409)
      return {"message":"User already exists!"}
    }
  try{
    //assume first user to be admin user..
       const count = await userTable
         .where()
         .count();
    
      console.log("the user count is:",count);


    //password hashing..
      hashedPassword=await bcrypt.hash(password,10);
    //add new user..
    const newUser={name,email,"password":hashedPassword,"isAdmin":false};

    if(count==0){
        newUser.isAdmin=true;
    }
      await userTable.save(newUser);

    //projection is used to omit certain fields..{field,value} --> value 0 means ignore that field and return others..
    const result=await userTable
    .where({email})
    .projection({password:0,isAdmin:0}) 
    .find()
    
    console.log("the result is",result)
      context.status(201)
  return {
    ...result
  }

  }catch(err){
    context.status(500);
      return {"message":err.message};
  }
};
