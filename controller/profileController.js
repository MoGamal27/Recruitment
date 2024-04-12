const User = require('../model/UserDB');
const userRole = require('../utils/userRole');
const companyDB = require('../model/companyDB')

async function Profile (req,res){
    
    try{
       const user = await User.findById(req.user.id)
      if(!user){
        return res.status(404).json({error:'User not found'})
      }
        
      //check user type
      let profile;
      if(user.role === userRole.JOBSEEKER ){
        profile = user.profile
      }  else if(user.role === userRole.EMPOLYER){
          profile = companyDB
          }

          res.json({profile})

    }catch(e){
        res.status(500).json({ error: e.message });
    }
}

module.exports = Profile;