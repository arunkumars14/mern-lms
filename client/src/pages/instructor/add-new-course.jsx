import CourseCurriculum from '@/components/instructor-view/courses/add-new-course/course-curriculum'
import CourseLanding from '@/components/instructor-view/courses/add-new-course/course-landing'
import CourseSettings from '@/components/instructor-view/courses/add-new-course/course-setting'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '@/config'
import { AuthContext } from '@/context/auth-context'
import { InstructorContext } from '@/context/instructor-context'
import { addNewCourseService, fetchInstructorCourseDetailsService, updateCourseByIdByService } from '@/services'
import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function AddNewCoursePage() {
    const params = useParams()

    const { couserLandingFormData, courseCurriculumFormData, setCouserLandingFormData, setCourseCurriculumFormData, currentEditedCourseId, setCurrentEditedCourseId, student, setStudent } = useContext(InstructorContext)

    const { auth } = useContext(AuthContext)

    const navigate = useNavigate()

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0
        }

        return value === "" || value === null || value === undefined
    }

    function valiidateFormData() {
        for (const key in couserLandingFormData) {
            if (isEmpty(couserLandingFormData[key])) {
                return false
            }
        }

        let hasFreePreview = false;

        for (const item of courseCurriculumFormData) {
            if (isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) {
                return false
            }
            if (item.freePreview) {
                hasFreePreview = true
            }
        }

        return hasFreePreview
    }

    async function handleCreateCourse() {

        const courseFinalFormData = {
            instructorId: auth?.user?._id,
            instructorName: auth?.user?.userName,
            date: new Date(),
            ...couserLandingFormData,
            students: student,
            curriculum: courseCurriculumFormData,
            isPublished: true,
        }
        const response = currentEditedCourseId ? await updateCourseByIdByService(currentEditedCourseId, courseFinalFormData) : await addNewCourseService(courseFinalFormData)

        if (response?.success) {
            setCouserLandingFormData(courseLandingInitialFormData)
            setCourseCurriculumFormData(courseCurriculumInitialFormData)
            navigate(-1)
            setCurrentEditedCourseId(null)
        }


    }

    async function fetchCurrentCourseDetails() {
        const response = await fetchInstructorCourseDetailsService(currentEditedCourseId)

        if(response?.success){
            const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
                acc[key] = response?.data[key] || courseLandingInitialFormData[key]
                return acc
            }, {})

            setCouserLandingFormData(setCourseFormData)
            setCourseCurriculumFormData(response?.data?.curriculum)
            setStudent(response?.data?.students)
        }
    }

    useEffect(() => {
        if (params?.courseId) {
            setCurrentEditedCourseId(params?.courseId)

        }
    }, [params?.courseId])



    useEffect(() => {
        if (currentEditedCourseId){
            fetchCurrentCourseDetails()

        } 
    }, [currentEditedCourseId])



    return (
        <div className='container mx-auto p-4'>
            <div className="flex justify-between">
                <h1 className="text-3xl font-extrabold mb-5">
                    Create New Course
                </h1>
                <Button disabled={!valiidateFormData()} className="text-sm tracking-wider font-bold px-8" onClick={handleCreateCourse}>Submit</Button>
            </div>
            <Card>
                <CardContent>
                    <div className="container mx-auto p-4">
                        <Tabs defaultValue='curriculum' className='space-y-4'>
                            <TabsList>
                                <TabsTrigger value="curriculum">
                                    Curriculum
                                </TabsTrigger>
                                <TabsTrigger value="course-landing-page">
                                    Course Landing Page
                                </TabsTrigger>
                                <TabsTrigger value="settings">
                                    Settings
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="curriculum">
                                <CourseCurriculum />
                            </TabsContent>

                            <TabsContent value="course-landing-page">
                                <CourseLanding />
                            </TabsContent>

                            <TabsContent value="settings">
                                <CourseSettings />
                            </TabsContent>

                        </Tabs>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}

export default AddNewCoursePage
