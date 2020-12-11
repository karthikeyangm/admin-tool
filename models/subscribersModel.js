
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;
var SubscribersDetailsSchema = new Schema({
    endpoint: { type: String },
    keys: { type: Object },
    userId: { type: ObjectId },
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    role: { type: String },
    tenantId: { type: String },
    tenantName: { type: String },
},
    {
        collection: 'SubscribersDetails',
    }
);

module.exports = mongoose.model('SubscribersDetails_model', SubscribersDetailsSchema);