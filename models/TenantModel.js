
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;
var TenantDetailsSchema = new Schema({
    tenantName: { type: String },
    Tenant_Url: { type: String , default:null},
    Tenant_DB: { type: String },
    TenantEncrpt: { type: String },
    TenantId: { type: String },
    dbUrl: { type: String },
    name: { type: String },
    status: { type: String },
    tenantDetails: { type: String },
    email: { type: String },
    mobile: { type: String },
    password: { type: String },
    SubscriptionStartDate: { type: Date },
    SubscriptionEndDate: { type: Date },
    userlimit:{type:Number},
    shortURL:{type:String},
    urlCode:{type:String},
    tenantPrefix:{type:String},
    userAdded:{type:Number},
    userAdmin:{type:Number},
},
    {
        collection: 'TenantDetails',
    }
);

module.exports = mongoose.model('TenantDetails_model', TenantDetailsSchema);