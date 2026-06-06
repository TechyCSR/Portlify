import { SidebarMenuButton } from './DashboardLayout'

function PageHeader({ title, description, className = '', children }) {
    return (
        <div className={`flex items-start gap-3 mb-8 ${className}`}>
            <SidebarMenuButton className="mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
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