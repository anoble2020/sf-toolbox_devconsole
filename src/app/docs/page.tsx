import Link from 'next/link'
import { BookOpen, Code, Terminal, ArrowLeft } from 'lucide-react'

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
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
                        <BookOpen className="w-8 h-8 text-green-600 mr-3" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Documentation
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
                        Comprehensive guides, tutorials, and API documentation for all sf toolbox applications.
                    </p>
                </div>

                {/* Quick Start */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Start</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Learn how to set up and configure sf toolbox for your Salesforce development workflow.
                            </p>
                            <Link 
                                href="/devconsole"
                                className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                            >
                                Launch DevConsole
                                <Terminal className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Authentication</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Connect your Salesforce orgs securely using OAuth 2.0 authentication.
                            </p>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Supported: Production, Sandbox, Scratch Orgs
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documentation Sections */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* DevConsole Docs */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-4">
                            <Terminal className="w-6 h-6 text-blue-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">DevConsole</h3>
                        </div>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                            <li>• Debug logs and trace flags</li>
                            <li>• Execute anonymous Apex</li>
                            <li>• Run test classes</li>
                            <li>• Query data with SOQL</li>
                            <li>• Explore org metadata</li>
                        </ul>
                    </div>

                    {/* API Reference */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-4">
                            <Code className="w-6 h-6 text-purple-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Reference</h3>
                        </div>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                            <li>• REST API endpoints</li>
                            <li>• Authentication methods</li>
                            <li>• Error handling</li>
                            <li>• Rate limiting</li>
                            <li>• Webhook integration</li>
                        </ul>
                    </div>

                    {/* Best Practices */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex items-center mb-4">
                            <BookOpen className="w-6 h-6 text-green-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Best Practices</h3>
                        </div>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                            <li>• Security guidelines</li>
                            <li>• Performance optimization</li>
                            <li>• Code organization</li>
                            <li>• Testing strategies</li>
                            <li>• Deployment workflows</li>
                        </ul>
                    </div>
                </div>

                {/* Support Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need Help?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Community Support</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Join our community for help, feature requests, and discussions.
                            </p>
                            <a
                                href="https://github.com/anoble2020/sf-toolbox"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                            >
                                View on GitHub
                                <Code className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Report Issues</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Found a bug or have a feature request? Let us know!
                            </p>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Use GitHub Issues for bug reports and feature requests.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
