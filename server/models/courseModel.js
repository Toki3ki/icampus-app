const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 100,
  },
  description: {
    type: String,
    max: 500,
  },
  teacher:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  students: [ // students is an array of ObjectIds referencing the Users collection
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    }
  ],
  schedule: [ // schedule is an array of objects defining the course schedule
    {
      dayOfWeek: { // 表示星期几，例如：1 (周一) - 7 (周日)
        type: Number,
        required: true,
        min: 1,
        max: 7,
      },
      startTime: { // 开始时间，建议使用字符串 'HH:MM' 或 Date 类型
        type: String,
        required: true,
        // 可以添加正则验证，确保格式为 HH:MM
        // match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      },
      endTime: { // 结束时间
        type: String,
        required: true,
        // match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      },
    }
  ],
}, { timestamps: true }); // Add timestamps to the schema for createdAt and updatedAt fields

module.exports = mongoose.model("Courses", courseSchema); // Export the course model to be used in other parts of the application
// This model will be used to interact with the 'courses' collection in MongoDB