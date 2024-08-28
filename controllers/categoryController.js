const categoryModel = require("../models/categoryModel");

async function addCategory(req, res) {
  const name = req.body.name;
  console.log(req.body);
  const category = new categoryModel({ name: name });
  category
    .save()
    .then(() => {
      res.send("Category created");
    })
    .catch((err) => {
      res.send(err.message);
    });
}

async function getCategories(req, res) {
  find()
    .then((categories) => {
      res.send(categories);
    })
    .catch((err) => {
      res.send(err.message);
    });
}

module.exports = {
  addCategory,
  getCategories,
};
