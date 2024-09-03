const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [2, "Product title must be at least 2 characters long"],
      maxlength: [255, "Product title must be at most 255 characters long"],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [
        20,
        "Product description must be at least 20 characters long",
      ],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Product quantity must be a positive number"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Product price must be a positive number"],
      max: [99999999, "Product price must be at most 99999999 characters long"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    images: [String],
    imageCover: {
      type: String,
      required: [true, "Product cover image is required"],
    },
    models: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [0, "Product ratings average must be a positive number"],
      max: [5, "Product ratings average must be at most 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slugify(update.title);
  }
  next();
});

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
