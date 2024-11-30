const Course = require('../../models/Course')

const addNewCourse = async (req, res) => {
    try {

        const courseData = req.body;

        const newlyCreatedCourse = new Course(courseData);
        const saveCourse = await newlyCreatedCourse.save()

        if(saveCourse) {
            res.status(201).json({
                success: true,
                message: "Course saved successfully",
                data:  saveCourse 
            })
        }

    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }

}

const getAllCourses = async (req, res) => {
    try {
        const courseList = await Course.find({})

        res.status(200).json({
            success: true,
            data: courseList
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }

}

const getCourseDetailsById = async (req, res) => {
    try {

        const {id} = req.params;
        const cousreDetails = await Course.findById(id)

        if(!cousreDetails){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        res.status(200).json({
            success: true,
            data: cousreDetails
        })

    } catch (e) {
        console.log(e.message)
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }

}
 
const updateCourseById = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedCourseData = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(id, updatedCourseData, {
            new: true
        })

        if(!updatedCourse){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })   
        }

        res.status(200).json({
            success: true,
            data: updatedCourse,
            message: "Course updated successfully"
        })
        

    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
    }

}

module.exports = {getAllCourses, addNewCourse, getCourseDetailsById, updateCourseById}

 