let userService = require('../service/userService')

let fetchOrganizationId = async function(userId){
    //Fetch OrganizationId
    let param = { "key": "userId", value: userId }
    let userDetails = await userService.fetchUserDetails(param)
    userDetails = userDetails[0];
    if(userDetails.organizationId || userDetails.organizationId != undefined){
      return userDetails.organizationId;
    }else{
      return null;
    } 
  }

  

module.exports = {
    fetchOrganizationId
  };