const mongoose = require("mongoose");
const slugify = require("slugify");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Sub-category name must be unique"],
      minLegnth: [2, "Sub-category name must be at least 2 characters long"],
      trim: true, // if there's a space before or after the name, it will be removed
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    // parent category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Sub-category must belong to a category"],
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate slug before saving the document
subCategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

// on update generate slug
subCategorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name);
  }
  next();
});

subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});

const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategoryModel;
