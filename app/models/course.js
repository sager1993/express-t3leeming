const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      default: ""
    },
    img: {
      type: String,
      default: ""
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
