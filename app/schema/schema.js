var TYPES = require('tedious').TYPES;
module.exports = {
    userSchema : [
        {"key":"userId","type":TYPES.VarChar,"nullable":true},
        {"key":"userName","type":TYPES.VarChar,"nullable":true},
        {"key":"password","type":TYPES.VarChar,"nullable":true},
        {"key":"email","type":TYPES.VarChar,"nullable":true},
        {"key":"phone","type":TYPES.VarChar,"nullable":true},
        {"key":"city","type":TYPES.VarChar,"nullable":true},
        {"key":"state","type":TYPES.VarChar,"nullable":true},
        {"key":"organizationId","type":TYPES.VarChar,"nullable":true},
        {"key":"organizationName","type":TYPES.VarChar,"nullable":true},
        {"key":"createdDateTime","type":TYPES.VarChar,"nullable":true},
        {"key":"modifiedDateTime","type":TYPES.VarChar,"nullable":true},
        {"key":"country","type":TYPES.VarChar,"nullable":true},
        {"key":"status","type":TYPES.VarChar,"nullable":true},
        {"key":"createdBy","type":TYPES.VarChar,"nullable":true},
        {"key":"modifiedBy","type":TYPES.VarChar,"nullable":true}
    ],
    orgSchema : [
        {"key":"organizationId","type":TYPES.VarChar,"nullable":true},
        {"key":"organizationName","type":TYPES.VarChar,"nullable":true},
        {"key":"email","type":TYPES.VarChar,"nullable":true},
        {"key":"phone","type":TYPES.VarChar,"nullable":true},
        {"key":"region","type":TYPES.VarChar,"nullable":true},
        {"key":"status","type":TYPES.VarChar,"nullable":true},
        {"key":"createdBy","type":TYPES.VarChar,"nullable":true},
        {"key":"createdDateTime","type":TYPES.VarChar,"nullable":true},
        {"key":"modifiedBy","type":TYPES.VarChar,"nullable":true},
        {"key":"modifiedDateTime","type":TYPES.VarChar}
    ] 
  };
