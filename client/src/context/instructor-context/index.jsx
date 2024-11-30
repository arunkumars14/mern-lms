import {  courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null)

import React from 'react'

function InstructorProvider({ children }) {
    const [couserLandingFormData, setCouserLandingFormData] = useState(courseLandingInitialFormData)

    const [mediaUploadProgress, setMediaUploadProgress] = useState(false)

    const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData)

    const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0)

    const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null)

    const [instructorCourseList, setInstructorCourseList] = useState([])

    return (
        <InstructorContext.Provider value={{couserLandingFormData, setCouserLandingFormData, courseCurriculumFormData, setCourseCurriculumFormData, mediaUploadProgress, setMediaUploadProgress, mediaUploadProgressPercentage, setMediaUploadProgressPercentage, instructorCourseList, setInstructorCourseList, currentEditedCourseId, setCurrentEditedCourseId}}>
            {children}
        </InstructorContext.Provider>
    )
}

export default InstructorProvider
