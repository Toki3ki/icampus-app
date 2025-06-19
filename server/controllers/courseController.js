const Course = require("../models/courseModel");
const Assignment = require("../models/assignmentModel");
const User = require("../models/userModel");

module.exports.getCourses = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const courses = await Course.find({ userId }).select([
      "name",
      "description",
      "location",
      "teacher",
      "schedule",
      "_id", 
      "createdAt", 
    ]);
    return res.json(courses);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAssignments = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const assignments = await Assignment.find({ courseId }).select([
      "title",
      "description",
      "dueDate",
      "_id",
      "createdAt",
    ]);
    return res.json(assignments);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addCourse = async (req, res, next) => { // teacher can add a course
  // 这个函数用于添加新课程，只有教师角色的用户可以调用
  try {
    // 确保 req.user 已经被 verifyToken 中间件填充
    if (!req.user || req.user.role !== 'teacher') {
      return res.status(403).json({ msg: "Access Denied: Only teachers can create courses." });
    }

    const { name, description, schedule, location } = req.body;
    const teacherId = req.user._id; // 从 JWT token 中获取当前登录的教师ID

    // 你可以在这里进行更细致的验证，例如检查 schedule 数组是否有效

    const newCourse = await Course.create({
      name,
      description,
      teacher: teacherId, // 自动填充当前登录的教师ID
      schedule,
      location,
      students: [], // 新建课程时，学生列表为空
    });

    return res.status(201).json({ status: true, course: newCourse, msg: "Course created successfully." });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getTeacherCourses = async (req, res, next) => {
  try {
    // 确保 req.user 已经被 verifyToken 中间件填充
    if (!req.user || req.user.role !== 'teacher') {
      return res.status(403).json({ msg: "Access Denied: Only teachers can view their courses." });
    }

    const teacherId = req.user._id; // 从认证信息中获取教师ID

    // 查找该教师创建的所有课程
    const courses = await Course.find({ teacher: teacherId })
                               .populate("teacher", "username email") // 填充教师的 username 和 email
                               .populate("students", "username email"); // 填充学生信息

    return res.status(200).json({ status: true, courses });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getCourseDetails = async (req, res, next) => {
// 获取单个课程的详细信息 (用于教师课程管理界面)
  try {
    // 确保 req.user 已经被 verifyToken 中间件填充
    if (!req.user) {
      return res.status(401).json({ msg: "Authentication required." });
    }

    const courseId = req.params.courseId;
    const course = await Course.findById(courseId)
                               .populate("teacher", "username email")
                               .populate("students", "username email"); // 填充学生列表

    if (!course) {
      return res.status(404).json({ msg: "Course not found.", status: false });
    }
    // // 额外权限检查：确保只有课程的教师或管理员才能查看详细信息
    // if (req.user.role === 'teacher' && course.teacher._id.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ msg: "Access Denied: You are not the teacher of this course." });
    // }
    return res.status(200).json({ status: true, course });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getStudentCourses = async (req, res, next) => {
  try {
    // 确保 req.user 已经被 verifyToken 中间件填充，并包含用户ID和角色
    if (!req.user) {
      return res.status(401).json({ msg: "Authentication required." });
    }

    const studentId = req.user._id; 
    // 从 req.user._id 获取更安全，因为它是通过 JWT 验证的
    // 查找 students 数组中包含当前学生ID的课程
    const courses = await Course.find({ students: studentId })
      .select([
        "name",
        "description",
        "location",
        "teacher",
        "schedule",
        "_id", // 返回课程ID
        "createdAt", // 返回创建时间 (如果需要)
      ])
      .populate("teacher", "username email"); // 填充授课教师的 username 和 email

    return res.status(200).json({ status: true, courses }); // 返回 status: true 和 courses 数组
  } catch (ex) {
    next(ex);
  }
};