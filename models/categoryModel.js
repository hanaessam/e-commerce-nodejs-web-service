const mongoose = require("mongoose");
// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      trim: true,
    },
    // A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (document) => {
  if (document.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${document.image}`;
    document.image = imageUrl;
  }
};

categorySchema.post("init", (document)=>{
  setImageUrl(document);
});

categorySchema.post("save", (document)=>{
  setImageUrl(document);
});


// 2- Create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
