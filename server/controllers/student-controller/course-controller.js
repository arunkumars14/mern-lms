const Course = require("../../models/Course")
const StudentCourses = require("../../models/StudentCourses")

const getAllStudentViewCourse = async (req, res) => {
    try {
        const {category=[], level=[], primaryLanguage=[], sortBy="price-lowtohigh"} = req.query

        let filters = {}
        if(category.length){
            filters.category = {$in: category.split(",")}
        }
        if(level.length){
            filters.level = {$in: level.split(",")}
        }
        if(primaryLanguage.length){
            filters.primaryLanguage = {$in: primaryLanguage.split(",")}
        }

        let sort = {}

        switch (sortBy) {
            case "price-lowtohigh":
                sort.pricing = 1 
                break;

            case "price-hightolow":
                sort.pricing = -1
                break;

            case "title-atoz":
                sort.title = 1
                break;

            case "title-ztoa":
                sort.title = -1
                break;
        
            default:
                sort.pricing = 1 
                break;
        }

        const courseList = await Course.find(filters).sort(sort)

        res.status(200).json({
            success: true,
            data: courseList
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: true,
            message: "Some error occured"
        })
    }
}

const getStudentViewCourseDetails = async (req, res) => {
    try {

        const {id} = req.params;
        const courseDetails = await Course.findById(id)

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "No Course Details Found",
                data: null
            })
        }

        res.status(200).json({
            success: true,
            data: courseDetails,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: true,
            message: "Some error occured"
        })
    }
}

const checkCoursePurchaseInfo = async(req, res) => {
    try {
        const {id, studentId} = req.params;
        
        const studentCourses = await StudentCourses.findOne({
            userId: studentId
        })

        const ifStudentAlreadyBoughtCurrentCourse = studentCourses?.courses.findIndex(item => item.courseId === id) > -1

        res.status(200).json({
            success: true,
            data: ifStudentAlreadyBoughtCurrentCourse,

        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: true,
            message: "Some error occured"
        })
    }
}

module.exports = {getAllStudentViewCourse, getStudentViewCourseDetails, checkCoursePurchaseInfo}