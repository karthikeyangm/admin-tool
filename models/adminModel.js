
/**
 * AdminDetails module to contain schema details
 * @module AdminDetails
 * @see {@link admin_TenantDetails}
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;
var AdminDetails = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    mobile: { type: String },
    username: { type: String },
    email: { type: String },
    role: { type: String },
    password: { type: String },
    status: { type: String },
},
    {
        collection: 'AdminDetails',
    }
);

module.exports = mongoose.model('AdminDetails', AdminDetails);