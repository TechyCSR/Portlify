import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'

function UploadZone({ onFileSelect, uploading, progress, accept = { 'application/pdf': ['.pdf'] } }) {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0])
        }
    }, [onFileSelect])

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept,
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
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
                        ? 'border-primary-400 bg-primary-500/10'
                        : 'border-dark-600 hover:border-primary-500/50 bg-dark-800/30'
                    }
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
            >
                <input {...getInputProps()} />

                {/* Upload progress overlay */}
                {uploading && (
                    <div
                        className="absolute inset-0 bg-primary-500/20 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                )}

                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    {/* Icon */}
                    <div className={`
            w-20 h-20 rounded-2xl mb-6 flex items-center justify-center
            ${isDragActive
                            ? 'bg-primary-500/20'
                            : 'bg-gradient-to-br from-primary-500/20 to-accent-500/20'
                        }
          `}>
                        {uploading ? (
                            <div className="spinner" />
                        ) : (
                            <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        )}
                    </div>

                    {/* Text */}
                    {uploading ? (
                        <>
                            <p className="text-lg font-medium text-white mb-2">Uploading...</p>
                            <p className="text-dark-400">{progress}% complete</p>
                        </>
                    ) : isDragActive ? (
                        <>
                            <p className="text-lg font-medium text-primary-300 mb-2">Drop your resume here</p>
                            <p className="text-dark-400">Release to upload</p>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-medium text-white mb-2">
                                Drag & drop your resume
                            </p>
                            <p className="text-dark-400 mb-4">
                                or click to browse
                            </p>
                            <p className="text-sm text-dark-500">
                                PDF files only, max 10MB
                            </p>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Error messages */}
            {fileRejections.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                >
                    <p className="text-red-400 text-sm">
                        {fileRejections[0].errors[0].message}
                    </p>
                </motion.div>
            )}
        </div>
    )
}

export default UploadZone
