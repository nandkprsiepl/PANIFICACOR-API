// ============================= requiring modules ==================== //
// var MongoClient = require('mongodb').MongoClient

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// ====================================================================//

const OrgSchema = new Schema({
  orgId: { type: String, required: false },
  orgType: { type: String, required: false },
  companyName: { type: String, required: false },
  companyBranch: { type: String, required: false },
  phone: { type: String, required: false },
  fax: { type: String, required: false },
  firstName : { type: String, required: false },
  lastName : { type: String, required: false },
  emailId: { type: String, required: false },
  cpfNumber: { type: String, required: false },
  district: { type: String, required: false },
  county: { type: String, required: false },
  address:  { type: String, required: false },
  countryOfInc:  { type: String, required: false },
  stateOfInc:  { type: String, required: false },
  postalCode: { type: String, required: false },
  role:  { type: String, required: false },
  dateOfInc:  { type: String, required: false },
  notes:  { type: String, required: false },
  status:  { type: String, required: false },
}, { collection: 'Org' });

// exporting the module
module.exports = mongoose.model('Org', OrgSchema);
