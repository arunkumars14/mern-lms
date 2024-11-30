
import FormControls from '@/components/common-form/form-control'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { courseLandingPageFormControls } from '@/config'
import { InstructorContext } from '@/context/instructor-context'
import React, { useContext } from 'react'

function CourseLanding() {
    const { couserLandingFormData, setCouserLandingFormData } = useContext(InstructorContext)
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Course Landing Page
                </CardTitle>
            </CardHeader>
            <CardContent>
                <FormControls
                    formControls={courseLandingPageFormControls}
                    formData={couserLandingFormData}
                    setFormData={setCouserLandingFormData}
                />
            </CardContent>
        </Card>
    )
}

export default CourseLanding
