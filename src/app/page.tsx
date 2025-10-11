import Link from 'next/link'
import { Terminal, BookOpen, Info, ArrowRight, Github, Coffee, Zap, Settings, ExternalLink, Star, Download, Code } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">

            <div className="flex-1">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                        sf toolbox
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        A comprehensive suite of Salesforce development tools and frameworks to streamline your workflow and boost productivity.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                            href="/devconsole/dashboard"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                        >
                            Launch DevConsole
                        </Link>
                        <Link 
                            href="/docs"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                        >
                            View Documentation
                        </Link>
                    </div>
                </div>

                {/* Tools Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Development Tools & Frameworks</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            A comprehensive suite of tools designed to enhance your Salesforce development experience
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* DevConsole */}
                        <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                        <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground">DevConsole</h3>
                                        <p className="text-sm text-muted-foreground">Web Application</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground mb-6">
                                    Advanced Salesforce development console with debugging, testing, query execution, and deployment tools. 
                                    Features real-time log monitoring, trace flag management, and comprehensive org exploration.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Code className="w-4 h-4 mr-2" />
                                        <span>Real-time debugging & monitoring</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Settings className="w-4 h-4 mr-2" />
                                        <span>Trace flag management</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        <span>Query execution & exploration</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link 
                                        href="/devconsole"
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                                    >
                                        Launch DevConsole
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Event Framework */}
                        <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground">Event Framework</h3>
                                        <p className="text-sm text-muted-foreground">Apex Framework</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground mb-6">
                                    A lightweight, metadata-driven platform event framework for Salesforce that provides a clean, 
                                    extensible architecture for handling integration events across your org.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Settings className="w-4 h-4 mr-2" />
                                        <span>Metadata-driven configuration</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Code className="w-4 h-4 mr-2" />
                                        <span>Separation of concerns</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Star className="w-4 h-4 mr-2" />
                                        <span>100% test coverage</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <a 
                                        href="https://github.com/anoble2020/sf-toolbox_event-framework"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                                    >
                                        View on GitHub
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Trigger Framework */}
                        <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                        <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground">Trigger Framework</h3>
                                        <p className="text-sm text-muted-foreground">Apex Framework</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground mb-6">
                                    A personal, lightweight Apex trigger framework designed to streamline trigger management 
                                    in Salesforce with clean architecture and best practices.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Code className="w-4 h-4 mr-2" />
                                        <span>Clean trigger architecture</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Settings className="w-4 h-4 mr-2" />
                                        <span>Best practices implementation</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Star className="w-4 h-4 mr-2" />
                                        <span>Lightweight & efficient</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <a 
                                        href="https://github.com/anoble2020/sf-toolbox_trigger-framework"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                                    >
                                        View on GitHub
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose sf toolbox?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Built by developers, for developers. Our tools are designed to solve real-world Salesforce development challenges.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Developer-First</h3>
                            <p className="text-sm text-muted-foreground">
                                Built by Salesforce developers who understand the daily challenges of working with the platform.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Lightweight</h3>
                            <p className="text-sm text-muted-foreground">
                                Minimal overhead with maximum functionality. No bloat, just the tools you need.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Best Practices</h3>
                            <p className="text-sm text-muted-foreground">
                                Follows Salesforce best practices and design patterns for maintainable, scalable code.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Well Tested</h3>
                            <p className="text-sm text-muted-foreground">
                                Comprehensive test coverage ensures reliability and confidence in production environments.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-8">Get Started</h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                            href="/docs"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Documentation
                        </Link>
                        <Link 
                            href="/about"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                        >
                            <Info className="w-4 h-4 mr-2" />
                            About
                        </Link>
                    </div>
                </div>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="border-t bg-background mt-auto">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                            Tools created by Alexander Noble © 2024
                        </p>
                        <p className="text-xs text-muted-foreground">
                            These tools are not created, supported or endorsed by Salesforce.com. Use at your own risk and discretion.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}