const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minLegnth: [3, "Category name must be at least 3 characters long"],
      trim: true,
    },

    // A and B => localhost:8000/a-and-b
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },

    image: String,
  },
  { timestamps: true }
);

// Pre-save hook to generate slug before saving the document
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

// on update generate slug
categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name);
  }
  next();
});

const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
