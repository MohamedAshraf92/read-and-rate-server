const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        required: true,
      },
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        required: true,
      },
    ],
    photo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
