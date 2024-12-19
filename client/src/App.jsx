import { Route, Routes } from 'react-router-dom'
import { Button } from './components/ui/button'
import AuthPage from './pages/auth'
import RouteGuard from './components/route-guard'
import { useContext } from 'react'
import { AuthContext } from './context/auth-context'
import InstructorDashboardPage from './pages/instructor'
import StudentViewCommonLayout from './components/student-view/common-layout'
import StudentHomePage from './pages/student/home'
import NotFound from './pages/not-found'
import AddNewCoursePage from './pages/instructor/add-new-course'
import StudentViewCoursesPage from './pages/student/courses'
import StudentViewCourseDetailsPage from './pages/student/course-details'
import PaypalReturnPage from './pages/student/payment-return'
import StudentCoursesPage from './pages/student/student-courses'
import StudentViewCourseProgressPage from './pages/student/course-progress'
import { Loader } from 'lucide-react'
import load from "../public/load.gif"

function App() {

  const { auth, loading } = useContext(AuthContext)

  if (loading) {

    return (
      <div className="flex flex-col h-[100vh] w-full justify-center items-center">
        <img src={load} alt="loading" className="w-[300px]" loading="lazy" />

        <h1 className="font-bold text-[rgb(95,111,255)] text-2xl">Learning Management System</h1>
      </div>
    )

  }

  return (
    <>
      <Routes>
        <Route path='/auth' element={<RouteGuard element={<AuthPage />} authenticated={auth?.authenticate} user={auth?.user} />} />

        <Route path='/instructor' element={<RouteGuard element={<InstructorDashboardPage />} authenticated={auth?.authenticate} user={auth?.user} />} />

        <Route path='/instructor/create-new-course' element={<RouteGuard element={<AddNewCoursePage />} authenticated={auth?.authenticate} user={auth?.user} />} />

        <Route path='/instructor/edit-course/:courseId' element={<RouteGuard element={<AddNewCoursePage />} authenticated={auth?.authenticate} user={auth?.user} />} />

        <Route path='/' element={<RouteGuard element={<StudentViewCommonLayout />} authenticated={auth?.authenticate} user={auth?.user} />}>

          <Route path='' element={<StudentHomePage />} />

          <Route path='home' element={<StudentHomePage />} />

          <Route path='courses' element={<StudentViewCoursesPage />} />

          <Route path='courses/details/:id' element={<StudentViewCourseDetailsPage />} />

          <Route path='payment-return' element={<PaypalReturnPage />} />

          <Route path='student-courses' element={<StudentCoursesPage />} />

          <Route path='course-progress/:id' element={<StudentViewCourseProgressPage />} />

        </Route>

        <Route path='*' element={<NotFound />} />


      </Routes>
    </>
  )
}

export default App
