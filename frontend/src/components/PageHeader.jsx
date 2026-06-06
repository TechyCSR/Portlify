function PageHeader({ title, description, className = '', children }) {
    return (
        <div className={`mb-8 ${className}`}>
            <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary leading-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-secondary mt-1 text-sm sm:text-base leading-relaxed">
                        {description}
                    </p>
                )}
                {children}
            </div>
        </div>
    )
}

export default PageHeader