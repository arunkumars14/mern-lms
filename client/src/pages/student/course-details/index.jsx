
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import VideoPlayer from '@/components/video-player'
import { AuthContext } from '@/context/auth-context'
import { StudentContext } from '@/context/student-context'
import { checkCoursePurchaseInfoService, createPaymentService, fetchStudentViewCourseDetailsService } from '@/services'
import { CheckCircle, GlobeIcon, LockIcon, PlayCircle, PlayCircleIcon } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

function StudentViewCourseDetailsPage() {

    const { currentCourseDetailsId, setCurrentCourseDetailsId, studentViewCourseDetails, setStudentViewCourseDetails, loadingState, setLoadingState } = useContext(StudentContext)

    const navigate = useNavigate()

    const {auth} = useContext(AuthContext)

    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null)

    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false)

    const [approvalUrl, setApprovalUrl] = useState('')


    const { id } = useParams()

    const location = useLocation()

    async function fetchStudentViewCourseDetails() {
        const checkCoursePurchaseInfoResponse = await checkCoursePurchaseInfoService(currentCourseDetailsId, auth?.user?._id)

        if(checkCoursePurchaseInfoResponse?.success && checkCoursePurchaseInfoResponse?.data){
            navigate(`/course-progress/${currentCourseDetailsId}`)
            return
        }

        const response = await fetchStudentViewCourseDetailsService(currentCourseDetailsId)

        if (response?.success) {
            setStudentViewCourseDetails(response?.data)
            setLoadingState(false)
        } else {
            setStudentViewCourseDetails(null)
            setLoadingState(false)
        }
    }

    function handleSetFreePreview(getCurrentVideoInfo) {
        setDisplayCurrentVideoFreePreview(getCurrentVideoInfo)
    }

    async function handleCreatePayment(){
        const paymentPayload = { 
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            orderStatus: "pending",
            paymentMethod: "paypal",
            paymentStatus: "initiated",
            orderDate: new Date(),
            paymentId: "",
            payerId: "",
            instructorId: studentViewCourseDetails?.instructorId,
            instructorName: studentViewCourseDetails?.instructorName,
            courseImage: studentViewCourseDetails?.image,
            courseTitle: studentViewCourseDetails?.title,
            coursePricing: studentViewCourseDetails?.pricing,
            courseId: studentViewCourseDetails?._id
        }
        const response = await createPaymentService(paymentPayload)

        if(response.success){
            sessionStorage.setItem("currentOrderId", JSON.stringify(response?.data?.orderId))
            setApprovalUrl(response?.data?.approvalUrl)
        }
    }


    useEffect(() => {
        if (displayCurrentVideoFreePreview !== null) {
            setShowFreePreviewDialog(true)
        }
    }, [displayCurrentVideoFreePreview])

    useEffect(() => {
        if (id) setCurrentCourseDetailsId(id)

        return () => {
            setCurrentCourseDetailsId(null)
            setStudentViewCourseDetails(null)
        }
    }, [id])

    useEffect(() => {

        if (currentCourseDetailsId) fetchStudentViewCourseDetails()

    }, [currentCourseDetailsId])

    useEffect(() => {
        if (!location.pathname.includes("courses/details")) {

            setStudentViewCourseDetails(null)
            setCurrentCourseDetailsId(null)
        }

    }, [location.pathname]);

    if (loadingState) return <Skeleton />



    if(approvalUrl !== ""){
        window.location.href = approvalUrl
    }

    const getIndexOfFreePreview = studentViewCourseDetails !== null ? studentViewCourseDetails?.curriculum.findIndex(item => item.freePreview) : -1

    return (
        <div className='mx-auto p-4'>

            <div className="bg-gray-900 text-white p-8 rounded-t-lg">
                <h1 className="text-3xl font-bold mb-4">{studentViewCourseDetails?.title}</h1>

                <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>

                <div className="flex items-center space-x-4 mt-2 text-sm ">
                    <span className="">Created by {studentViewCourseDetails?.instructorName}</span>
                    <span className="">Created on {studentViewCourseDetails?.date.split("T")[0]}</span>
                    <span className="flex items-center capitalize">
                        <GlobeIcon className='mr-1 h-4 w-4' />
                        {studentViewCourseDetails?.primaryLanguage}
                    </span>
                    <span className="">{studentViewCourseDetails?.students.length} {studentViewCourseDetails?.students.length <= 1 ? "Student" : "Students"}</span>
                </div>

            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>
                                What you'll learn
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                {
                                    studentViewCourseDetails?.objectives.split(",").map((objective, index) => <li key={index} className='flex items-start'>
                                        <CheckCircle className='mr-2 h-5 w-5 text-green-500 shrink-0' />
                                        <span className="">{objective}</span>
                                    </li>)
                                }
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>
                                Course Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {studentViewCourseDetails?.description}
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>
                                Course Curriculum
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                studentViewCourseDetails?.curriculum?.map((curriculumItem, index) => (
                                    <li className={`${curriculumItem?.freePreview ? "cursor-pointer" : "cursor-not-allowed"} flex items-center mb-4`} key={curriculumItem?._id} onClick={curriculumItem?.freePreview ? () => handleSetFreePreview(curriculumItem) : null}>
                                        {
                                            curriculumItem?.freePreview ? <PlayCircle className='mr-2 h-4 w-4' /> : <LockIcon className='mr-2 h-4 w-4' />
                                        }
                                        <span className="">{curriculumItem?.title}</span>
                                    </li>
                                ))
                            }
                        </CardContent>
                    </Card>
                </main>
                <aside className="w-full md:w-[500px]">
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">

                                <VideoPlayer url={getIndexOfFreePreview !== -1 ? studentViewCourseDetails?.curriculum[getIndexOfFreePreview].videoUrl : null} height='200px' width='450px' key={studentViewCourseDetails?.curriculum[getIndexOfFreePreview]?.videoUrl} />

                            </div>

                            <div className="mb-4">
                                <span className="text-3xl font-bold">${studentViewCourseDetails?.pricing}</span>
                            </div>

                            <Button className="w-full" onClick={handleCreatePayment}>Buy Now</Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>

            <Dialog open={showFreePreviewDialog} onOpenChange={() => {
                setShowFreePreviewDialog(false)
                setDisplayCurrentVideoFreePreview(null)
            }}>
                <DialogContent className="w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Course Preview</DialogTitle>
                    </DialogHeader>

                    <DialogDescription className="sr-only">
                        Description
                    </DialogDescription>

                    <div className="aspect-video rounded-lg flex items-center justify-center">

                        <VideoPlayer url={displayCurrentVideoFreePreview?.videoUrl} height='200px' width='450px' key={studentViewCourseDetails?.curriculum[getIndexOfFreePreview]?.videoUrl} />

                    </div>

                    <div className="flex flex-col gap-2">
                        {
                            studentViewCourseDetails?.curriculum.filter(item => item.freePreview).map(filteredItem => <p className={`cursor-pointer text-[16px] font-medium flex gap-1 p-2 rounded ${displayCurrentVideoFreePreview?.title === filteredItem?.title ? "bg-slate-200" : ""}`} key={filteredItem?._id} onClick={() =>handleSetFreePreview(filteredItem)}><PlayCircleIcon />{filteredItem?.title}</p>)
                        }
                    </div>

                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default StudentViewCourseDetailsPage
