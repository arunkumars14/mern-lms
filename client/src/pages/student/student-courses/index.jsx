
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { AuthContext } from '@/context/auth-context'
import { StudentContext } from '@/context/student-context'
import { fetchStudentBoughtCoursesServices } from '@/services'
import { Play } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import load from "../../../../public/load.gif"

function StudentCoursesPage() {
    const { studentBoughtCoursesList, setStudentBoughtCoursesList, loadingStateBought, setLoadingStateBought } = useContext(StudentContext)

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    async function fetchStudentBoughtCourses() {
        const response = await fetchStudentBoughtCoursesServices(auth?.user?._id)

        if (response?.success) {
            setStudentBoughtCoursesList(response?.data);
            setLoadingStateBought(false)
        }
    }

    useEffect(() => {
        fetchStudentBoughtCourses()
    }, [])

    if (loadingStateBought) {
        return (
            <div className="flex flex-col h-[100vh] w-full justify-center items-center">
                <img src={load} alt="loading" className="w-[150px]" loading="lazy" />

                <h1 className="font-bold text-[rgb(95,111,255)] text-md">Learning Management System</h1>
            </div>
        )
    }


    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-8">My Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {
                    studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? studentBoughtCoursesList.map(course => <Card key={course?._id} className="flex flex-col">
                        <CardContent className="p-4 flex-grow">
                            <img src={course?.courseImage} alt={course?.title} className="h-52 w-full object-cover rounded-md mb-4" />

                            <h3 className="font-bold mb-1">{course?.title}</h3>

                            <p className="text-sm text-gray-700 mb-2">{course?.instructorName}</p>
                        </CardContent>

                        <CardFooter>
                            <Button className="flex-1" onClick={() => navigate(`/course-progress/${course?.courseId}`)}>
                                <Play className='mr-2 h-4 w-4' />
                                Start Watching
                            </Button>
                        </CardFooter>

                    </Card>) : <h1 className="text-3xl font-bold">No Courses Found</h1>
                }
            </div>
        </div>
    )
}

export default StudentCoursesPage
