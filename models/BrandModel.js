const mongoose = require("mongoose");
const slugify = require("slugify");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minLegnth: [2, "Brand name must be at least 2 characters long"],
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },

    image: String,
  },
  { timestamps: true }
);

brandSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

brandSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name);
  }
  next();
});

const BrandModel = mongoose.model("Brand", brandSchema);
module.exports = BrandModel;
