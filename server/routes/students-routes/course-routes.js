const express = require("express")
const { getAllStudentViewCourse, getStudentViewCourseDetails, checkCoursePurchaseInfo } = require("../../controllers/student-controller/course-controller")

const router = express.Router()

router.get("/get", getAllStudentViewCourse)
router.get("/get/details/:id/", getStudentViewCourseDetails)
router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo)

module.exports = router