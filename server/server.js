require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const authRoutes = require("./routes/auth-routes/index")
const mediaRoutes = require("./routes/instructor-routes/media-routes")
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes")
const studentViewCourseRoutes = require("./routes/students-routes/course-routes")
const studentViewOrderRoutes = require("./routes/students-routes/order-routes")
const studentCoursesRoutes = require("./routes/students-routes/student-courses-routes")
const studentCourseProgressRoutes = require("./routes/students-routes/course-progress-routes")

const app = express()
const PORT = process.env.PORT || 5000;

const MONGO_URL = process.env.MONGO_URL;

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json());

mongoose.connect(MONGO_URL).then(() => console.log(`DB is connected`)).catch((e)=> console.log(e))

app.use("/auth", authRoutes)
app.use("/media", mediaRoutes)
app.use("/instructor/course", instructorCourseRoutes)
app.use("/student/course", studentViewCourseRoutes)
app.use("/student/order", studentViewOrderRoutes)
app.use("/student/courses-bought", studentCoursesRoutes)
app.use("/student/courses-progress", studentCourseProgressRoutes)

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).json({
        success: false,
        message: "Something went wrong"     
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
