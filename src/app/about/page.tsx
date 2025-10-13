import Link from 'next/link'
import { Info, Github, Coffee, ArrowLeft, Heart, Users, Code2, Zap, Settings } from 'lucide-react'
import { Navigation } from '@/components/Navigation'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto px-4 py-16 pt-20">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-6">
                        <Info className="w-8 h-8 text-purple-600 mr-3" />
                        <h1 className="text-4xl font-bold text-foreground">
                            About sf toolbox
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-3xl">
                        A suite of Salesforce development tools and frameworks designed to streamline your workflow and boost productivity.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                    <p className="text-muted-foreground mb-6">
                        sf toolbox was born from the frustration of juggling multiple tools and interfaces while developing on the Salesforce platform. 
                        We believe that developers should have access to powerful, integrated tools and frameworks that work seamlessly together, 
                        allowing them to focus on what matters most: building great applications.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Developer-First</h3>
                            <p className="text-muted-foreground text-sm">
                                Built by developers who understand the daily challenges of Salesforce development.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Community-Driven</h3>
                            <p className="text-muted-foreground text-sm">
                                Open source and community-driven, with contributions from developers worldwide.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Passion Project</h3>
                            <p className="text-muted-foreground text-sm">
                                Created with love for the Salesforce developer community.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Overview */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">What's Included</h2>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <Code2 className="w-6 h-6 text-blue-600 mr-2" />
                                <h3 className="text-lg font-semibold text-foreground">DevConsole</h3>
                            </div>
                            <ul className="space-y-2 text-muted-foreground">
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
                            <div className="flex items-center mb-4">
                                <Zap className="w-6 h-6 text-green-600 mr-2" />
                                <h3 className="text-lg font-semibold text-foreground">Event Framework</h3>
                            </div>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>• Metadata-driven configuration</li>
                                <li>• Separation of concerns</li>
                                <li>• Comprehensive error handling</li>
                                <li>• 100% test coverage</li>
                                <li>• Extensible architecture</li>
                                <li>• Platform event management</li>
                                <li>• Integration event handling</li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center mb-4">
                                <Settings className="w-6 h-6 text-purple-600 mr-2" />
                                <h3 className="text-lg font-semibold text-foreground">Trigger Framework</h3>
                            </div>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>• Clean trigger architecture</li>
                                <li>• Best practices implementation</li>
                                <li>• Lightweight and efficient</li>
                                <li>• Maintainable code structure</li>
                                <li>• Scalable design patterns</li>
                                <li>• Comprehensive documentation</li>
                                <li>• Easy integration</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Creator Section */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Created by</h2>
                    <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold text-xl">AN</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Alexander Noble</h3>
                            <p className="text-muted-foreground">Salesforce Developer & Open Source Enthusiast</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        A passionate Salesforce developer with years of experience building enterprise applications. 
                        This project represents a commitment to improving the developer experience on the Salesforce platform.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://github.com/anoble2020"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-muted-foreground hover:text-foreground"
                        >
                            <Github className="w-5 h-5 mr-2" />
                            GitHub
                        </a>
                        <a
                            href="https://buymeacoffee.com/alexandernoble"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-muted-foreground hover:text-foreground"
                        >
                            <Coffee className="w-5 h-5 mr-2" />
                            Buy me a coffee
                        </a>
                    </div>
                </div>

                {/* Support Section */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Support the Project</h2>
                    <p className="text-muted-foreground mb-6">
                        sf toolbox is free and open source. If you find it useful, consider supporting the project to help 
                        cover hosting costs and fund future development.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="https://github.com/anoble2020/sf-toolbox"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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
