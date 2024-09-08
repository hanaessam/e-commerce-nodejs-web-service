const multer = require("multer");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const APIError = require("../utils/APIError");

const multerOptions = () => {
  const bufferObj = multer.memoryStorage();
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new APIError("Not an image! Please upload only images.", 400), false);
    }
  };
  const upload = multer({ storage: bufferObj, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (image) => multerOptions().single(image);
exports.uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields);

exports.resizeImage = (model, dir) => {
  asyncHandler(async (req, res, next) => {
    if (!req.file) return next();
    const fileName = `${model}-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/${dir}/${fileName}`);
    // save image name to db
    req.body.image = fileName;
    next();
  });
};
