const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
  mysqlId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
        maxlength: 255, // Add this validation
    validate: {
      validator: function(v) {
        return v.length <= 255;
      },
      message: props => `Title must be 255 characters or less`
    }},
  description: {
    type: String,
     maxlength: 1000,
  },
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserMongo',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProgramMongo = mongoose.model('ProgramMongo', programSchema);
module.exports = ProgramMongo;