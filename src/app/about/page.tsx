import Link from 'next/link'
import { Info, Github, Coffee, ArrowLeft, Heart, Users, Code2 } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <div className="flex items-center mb-6">
                        <Info className="w-8 h-8 text-purple-600 mr-3" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            About sf toolbox
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
                        A comprehensive suite of Salesforce development tools designed to streamline your workflow and boost productivity.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        sf toolbox was born from the frustration of juggling multiple tools and interfaces while developing on the Salesforce platform. 
                        We believe that developers should have access to powerful, integrated tools that work seamlessly together, 
                        allowing them to focus on what matters most: building great applications.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Developer-First</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Built by developers who understand the daily challenges of Salesforce development.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Community-Driven</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Open source and community-driven, with contributions from developers worldwide.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Passion Project</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Created with love for the Salesforce developer community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What's Included</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">DevConsole</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li>• Advanced log debugging and analysis</li>
                                <li>• Trace flag management</li>
                                <li>• Anonymous Apex execution</li>
                                <li>• SOQL query builder and runner</li>
                                <li>• Test class execution and coverage</li>
                                <li>• Org metadata exploration</li>
                                <li>• API limits monitoring</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Coming Soon</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li>• Deployment management tools</li>
                                <li>• Code quality analysis</li>
                                <li>• Performance monitoring</li>
                                <li>• Team collaboration features</li>
                                <li>• Custom app marketplace</li>
                                <li>• Integration with popular IDEs</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Creator Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Created by</h2>
                    <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold text-xl">AN</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alexander Noble</h3>
                            <p className="text-gray-600 dark:text-gray-300">Salesforce Developer & Open Source Enthusiast</p>
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        A passionate Salesforce developer with years of experience building enterprise applications. 
                        This project represents a commitment to improving the developer experience on the Salesforce platform.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://github.com/anoble2020"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <Github className="w-5 h-5 mr-2" />
                            GitHub
                        </a>
                        <a
                            href="https://buymeacoffee.com/alexandernoble"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <Coffee className="w-5 h-5 mr-2" />
                            Buy me a coffee
                        </a>
                    </div>
                </div>

                {/* Support Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Support the Project</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        sf toolbox is free and open source. If you find it useful, consider supporting the project to help 
                        cover hosting costs and fund future development.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="https://github.com/anoble2020/sf-toolbox"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Github className="w-5 h-5 mr-2" />
                            Star on GitHub
                        </a>
                        <a
                            href="https://buymeacoffee.com/alexandernoble"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                            <Coffee className="w-5 h-5 mr-2" />
                            Buy me a coffee
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
