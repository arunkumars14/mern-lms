import { Button } from '@/components/ui/button'
import React, { useContext, useEffect } from 'react'
import banner from '../../../../public/banner.jpg'
import { courseCategories } from '@/config'
import { StudentContext } from '@/context/student-context'
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from '@/services'
import { AuthContext } from '@/context/auth-context'
import { useNavigate } from 'react-router-dom'

function StudentHomePage() {

  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext)

  const {auth} = useContext(AuthContext)

  const navigate = useNavigate()

  function handleNavigateToCoursePage(getCurrentId){
    sessionStorage.removeItem("filters")
    const currentFilter = {
      category: [getCurrentId]
    }

    sessionStorage.setItem("filters", JSON.stringify(currentFilter))

    navigate("/courses")
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService()
    if (response?.success) {
      setStudentViewCoursesList(response?.data)
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(getCurrentCourseId, auth?.user?._id)

    if(response?.success){
        if(response?.data){
            navigate(`/course-progress/${getCurrentCourseId}`)
        }else{
            navigate(`/courses/details/${getCurrentCourseId}`)
        }
    }
}

  useEffect(() => {
    fetchAllStudentViewCourses()
  }, [])



  return (

    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning that gets you</h1>
          <p className="text-xl">Skills for your present and your future. Start from here</p>
        </div>

        <div className="lg:w-full mb-8 lg:mb-0">
          <img src={banner} alt="" width={600} height={400} className="w-full h-auto rounded-lg shadow-lg" />
        </div>
      </section>

      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid gird-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {
            courseCategories.map(categoryItem => <Button className="justify-start" variant="outline" key={categoryItem?.id} onClick={()=>handleNavigateToCoursePage(categoryItem?.id)}>
              {categoryItem.label}
            </Button>)
          }
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {
            studentViewCoursesList && studentViewCoursesList.length > 0 ? studentViewCoursesList.map(courseItem => <div key={courseItem?._id} className='border rounded-lg overflow-hidden shadow cursor-pointer' onClick={()=> handleCourseNavigate(courseItem?._id)}>

              <img src={courseItem?.image} alt="" className="w-full h-40 object-cover" width={300} height={150}/>

              <div className="p-4">
                <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                <p className="text-sm text-gray-700 mb-2">{courseItem.instructorName}</p>
                <p className="font-bold text-[16px]">${courseItem?.pricing}</p>
              </div>

            </div>) : <h1 className="">No Courses Found</h1>
          }
        </div>
      </section>
    </div>

  )
}

export default StudentHomePage