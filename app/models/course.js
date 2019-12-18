const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      default: "https://google.com"
    },
    img: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1280px-No_image_3x4.svg.png"
    },
    // language: {
    //   type: String,
    //   default: ""
    // },
    // category: {
    //   type: String,
    //   default: ""
    // },
    // description: {
    //   type: String,
    //   default: ""
    // },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

courseSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "coursePage"
});

module.exports = mongoose.model("Course", courseSchema);
