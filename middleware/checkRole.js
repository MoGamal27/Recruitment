const user = require('../model/UserDB')
const userRole = require('../utils/userRole')

const checkUserRole = (req, res, next) => {
    
    if (user.role !== userRole.EMPLOYER) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    next(); 
  };
  
  module.exports = checkUserRole;