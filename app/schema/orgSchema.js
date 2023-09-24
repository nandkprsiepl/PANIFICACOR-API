// ============================= requiring modules ==================== //
// var MongoClient = require('mongodb').MongoClient

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// ====================================================================//

const OrgSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: false },
  orgId: { type: String, required: false },
  orgName: { type: String, required: false },
  orgAdminId: { type: String, required: false },
  orgAdminFirstName : { type: String, required: false },
  orgAdminLastName : { type: String, required: false },
  orgAdminEmailId: { type: String, required: false },
  phone: { type: String, required: false },
  alternatePhone: { type: String, required: false },
  address:  { type: String, required: false },
  countryOfInc:  { type: String, required: false },
  stateOfInc:  { type: String, required: false },
  zipCode:  { type: String, required: false },
  role:  { type: String, required: false },
  buisnessType:  { type: String, required: false },
  organizationType:  { type: String, required: false },
  status: { type: String, required: false },
  password: { type: String, required: false },
}, { collection: 'Org' });

// exporting the module
module.exports = mongoose.model('Org', OrgSchema);
