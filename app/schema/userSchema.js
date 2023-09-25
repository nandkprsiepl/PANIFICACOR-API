// ============================= requiring modules ==================== //
// var MongoClient = require('mongodb').MongoClient

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// ====================================================================//

const UserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  orgId: { type: String, required: true },
  orgName: { type: String, required: true },
  orgType:  {type: String, required: true},
  role: {type: String,required: true},
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, required: true },
}, { collection: 'User' });

// exporting the module
module.exports = mongoose.model('User', UserSchema);