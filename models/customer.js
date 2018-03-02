var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CustomerSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    password: {type: String,  max: 100},
    last_name: {type: String,  max: 100},
    email: {type: String, required: true, max: 100},
    fb_id: {type: String, max: 100},
  }
);

// Virtual for author's full name
CustomerSchema
.virtual('name')
.get(function () {
  return this.first_name + ', ' + this.last_name;
});

// Virtual for author's URL
CustomerSchema
.virtual('url')
.get(function () {
	//return '/catalog/'
   return '/catalog/customer/' + this._id;
});

CustomerSchema
.virtual('due_back_formatted')
.get(function () {
  return moment(this.due_back).format('MMMM Do, YYYY');
});

//Export model
module.exports = mongoose.model('Customer', CustomerSchema);