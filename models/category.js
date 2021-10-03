const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // relatedBooks: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Book",
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
