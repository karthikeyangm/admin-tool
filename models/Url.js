const mongoose = require('mongoose');

var ObjectID = require('mongodb').ObjectID;
const urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  ScenarioId: ObjectID,
  tenantCode:String,
  date: { type: String, default: Date.now }
});

module.exports = mongoose.model('Url', urlSchema);
