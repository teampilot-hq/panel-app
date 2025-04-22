export function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md">
                <div className="mb-4">
                    <svg className="w-16 h-16 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"/>
                        <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Loading</h2>
                <p className="mt-2 text-gray-500">Preparing your Teampilot dashboard...</p>
            </div>
        </div>
    );
}