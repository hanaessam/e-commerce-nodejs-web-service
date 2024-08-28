const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minLegnth: [3, "Category name must be at least 3 characters long"],
    },

    // A and B => localhost:8000/a-and-b
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
