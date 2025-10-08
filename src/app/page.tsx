import Link from 'next/link'
import { Terminal, BookOpen, Info, ArrowRight, Github, Coffee } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
            {/* Navigation */}
            <nav className="border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <img src="/icon_128_purp.png" alt="sf toolbox" className="w-8 h-8 mr-3" />
                            <span className="text-xl font-semibold text-gray-900 dark:text-white">sf toolbox</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a
                                href="https://github.com/anoble2020/sf-toolbox"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://buymeacoffee.com/alexandernoble"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <Coffee className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Hero Section */}
                <div className="text-center mb-40">
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        sf toolbox
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                        A (soon to be) comprehensive suite of Salesforce development tools to streamline your workflow and boost productivity.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link 
                            href="/devconsole/dashboard"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Launch DevConsole
                        </Link>
                        <Link 
                            href="/docs"
                            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            View Documentation
                        </Link>
                    </div>
                </div>

                {/* Apps Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {/* DevConsole */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Terminal className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">DevConsole</h3>
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
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Documentation</h3>
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
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Info className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">About</h3>
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
                </div>
            </div>
            
            {/* Footer */}
            <footer className="bg-slate-100 dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            Tools created by Alexander Noble © 2024
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            These tools are not created, supported or endorsed by Salesforce.com. Use at your own risk and discretion.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}