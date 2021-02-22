
/**
 * TenantDetails module to contain schema details
 * @module TenantDetails
 * @see {@link TenantDetails}
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;
var TenantDetails = new Schema({
    Tenant_Name: { type: String },
    Tenant_Url: { type: String },
    Tenant_DB: { type: String },
    TenantEncrpt: { type: String },
    TenantId: { type: String },
    dbUrl: { type: String },
    tenantName:{type: String },
    name: { type: String },
},
    {
        collection: 'TenantDetails',
    }
);

module.exports = mongoose.model('TenantDetails', TenantDetails);