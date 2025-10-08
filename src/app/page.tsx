import Link from 'next/link'
import { Terminal, BookOpen, Info, ArrowRight } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <img src="/icon_128_purp.png" alt="sf toolbox" className="w-16 h-16 mr-4" />
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                            sf toolbox
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        A comprehensive suite of Salesforce development tools to streamline your workflow and boost productivity.
                    </p>
                </div>

                {/* Apps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {/* DevConsole */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <Terminal className="w-8 h-8 text-blue-600 mr-3" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">DevConsole</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Advanced Salesforce development console with debugging, testing, and deployment tools.
                        </p>
                        <Link 
                            href="/devconsole"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                            Launch DevConsole
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {/* Documentation */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <BookOpen className="w-8 h-8 text-green-600 mr-3" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Documentation</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Comprehensive guides, tutorials, and API documentation for all sf toolbox applications.
                        </p>
                        <Link 
                            href="/docs"
                            className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                        >
                            View Documentation
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {/* About */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <Info className="w-8 h-8 text-purple-600 mr-3" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">About</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Learn more about sf toolbox, its mission, and the resources available to developers.
                        </p>
                        <Link 
                            href="/about"
                            className="inline-flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                        >
                            Learn More
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Why Choose sf toolbox?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Developer-Focused</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Built by developers, for developers. Every tool is designed with productivity in mind.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Well Documented</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Comprehensive documentation and examples to help you get started quickly.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Info className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Open Source</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Free and open source. Contribute, customize, and help improve the tools.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}