const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const screenSchema = new Schema({
  image: {
    type: String,
    required: true
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

module.exports = ScreenShot = mongoose.model("screenshots", screenSchema);
