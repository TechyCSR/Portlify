import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { FileUp } from 'lucide-react'
import { ICON_STROKE } from './IconTile'

function UploadZone({ onFileSelect, uploading, progress, accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
} }) {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0])
        }
    }, [onFileSelect])

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept,
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024,
        disabled: uploading
    })

    return (
        <div className="w-full">
            <motion.div
                {...getRootProps()}
                whileHover={{ scale: uploading ? 1 : 1.01 }}
                whileTap={{ scale: uploading ? 1 : 0.99 }}
                className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed p-12
          transition-all duration-300 cursor-pointer
          ${isDragActive
                        ? 'border-primary-400 bg-primary-500/5'
                        : 'border-border hover:border-primary-500/30 bg-surface'
                    }
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
            >
                <input {...getInputProps()} />

                {uploading && (
                    <div
                        className="absolute inset-0 bg-primary-500/10 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                )}

                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-xl bg-tertiary mb-6 flex items-center justify-center">
                        {uploading ? (
                            <div className="spinner" />
                        ) : (
                            <FileUp size={28} strokeWidth={ICON_STROKE} className="text-secondary" />
                        )}
                    </div>

                    {uploading ? (
                        <>
                            <p className="text-lg font-medium text-primary mb-2">Uploading...</p>
                            <p className="text-secondary">{progress}% complete</p>
                        </>
                    ) : isDragActive ? (
                        <>
                            <p className="text-lg font-medium text-primary mb-2">Drop your resume here</p>
                            <p className="text-secondary">Release to upload</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-medium text-primary mb-2">
                                Drag & drop your resume
                            </p>
                            <p className="text-secondary mb-4">
                                or click to browse
                            </p>
                            <p className="text-sm text-tertiary">
                                PDF, DOC, DOCX — max 10MB
                            </p>
                        </>
                    )}
                </div>
            </motion.div>

            {fileRejections.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                    <p className="text-error text-sm">
                        {fileRejections[0].errors[0].message}
                    </p>
                </motion.div>
            )}
        </div>
    )
}

export default UploadZone