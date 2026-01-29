import { useState, useCallback } from 'react'
import { getCloudinarySignature } from '../utils/api'

export function useCloudinaryUpload() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)

    const upload = useCallback(async (file) => {
        setUploading(true)
        setProgress(0)
        setError(null)

        try {
            // Get signed upload params from backend
            const { data: signatureData } = await getCloudinarySignature()
            const { signature, timestamp, cloudName, apiKey, folder } = signatureData

            // Create form data for upload
            const formData = new FormData()
            formData.append('file', file)
            formData.append('api_key', apiKey)
            formData.append('timestamp', timestamp)
            formData.append('signature', signature)
            formData.append('folder', folder)
            formData.append('resource_type', 'raw')

            // Upload directly to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || 'Upload failed')
            }

            const result = await response.json()
            setProgress(100)

            return {
                url: result.secure_url,
                publicId: result.public_id,
            }
        } catch (err) {
            setError(err.message || 'Failed to upload file')
            throw err
        } finally {
            setUploading(false)
        }
    }, [])

    return { upload, uploading, progress, error }
}

export default useCloudinaryUpload
