export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* Main content */}
            <div className="flex items-center justify-center min-h-screen">
                {children}
            </div>
        </div>
    )
}
