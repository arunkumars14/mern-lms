
import MediaProgressBar from '@/components/media-progress-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InstructorContext } from '@/context/instructor-context'
import { mediaUploadService } from '@/services'
import React, { useContext } from 'react'

function CourseSettings() {
    const { couserLandingFormData, setCouserLandingFormData, mediaUploadProgress, setMediaUploadProgress, mediaUploadProgressPercentage, setMediaUploadProgressPercentage } = useContext(InstructorContext)

    async function handleImageUpload(event) {
        const selectedImage = event.target.files[0]
        if (selectedImage) {
            const imageFormData = new FormData()
            imageFormData.append("file", selectedImage)
            try {
                setMediaUploadProgress(true)
                const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage)
                if (response.success) {
                    setCouserLandingFormData({
                        ...couserLandingFormData,
                        image: response?.data?.url
                    })
                    setMediaUploadProgress(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Course Setting
                </CardTitle>
            </CardHeader>
            <div className="p-4">
            {
                mediaUploadProgress ? <MediaProgressBar isMediaUploading={mediaUploadProgress} progress={mediaUploadProgressPercentage} /> : null
            }
            </div>
            <CardContent>
                {
                    couserLandingFormData?.image ? <img src={couserLandingFormData?.image} alt="" className="" /> : <div className="flex flex-col gap-3">
                        <Label>
                            Uplaod Course Image
                        </Label>
                        <Input type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>
                }

            </CardContent>
        </Card>
    )
}

export default CourseSettings
