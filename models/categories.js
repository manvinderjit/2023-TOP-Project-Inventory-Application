import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
    trim: true,
  },
});

// Virtual for category's URL
const categoryURL = categorySchema.virtual("url");
categoryURL.get(function () {
    return `/catalog/${this._id}`;
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
