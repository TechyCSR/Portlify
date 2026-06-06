function SectionHeading({ children, className = '', as: Tag = 'h2' }) {
    return (
        <Tag className={`text-lg font-semibold text-primary mb-4 ${className}`}>
            {children}
        </Tag>
    )
}

export default SectionHeading