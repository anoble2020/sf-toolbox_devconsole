import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Terminal, BookOpen, Bug, Star, ExternalLink, Zap, Settings, Search, Play, FlaskConical, Telescope, Flag } from 'lucide-react'
import Link from 'next/link'

export function DevConsoleDocs() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">DevConsole</h1>
            <p className="text-muted-foreground">Advanced Salesforce development console with debugging, testing, and deployment tools</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary">Web Application</Badge>
          <Badge variant="outline">Real-time</Badge>
          <Badge variant="outline">Multi-Org</Badge>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            DevConsole is a comprehensive web-based development console designed to streamline your Salesforce development workflow with advanced debugging, testing, and deployment capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            DevConsole provides a unified interface for all your Salesforce development needs, eliminating the need to switch between multiple tools and interfaces. It's designed to work seamlessly with multiple orgs and provides real-time monitoring and debugging capabilities.
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong>Real-time Debugging</strong> - Monitor logs and debug issues as they happen</li>
            <li>• <strong>Multi-Org Support</strong> - Switch between production, sandbox, and scratch orgs</li>
            <li>• <strong>Advanced Query Tools</strong> - SOQL query builder with syntax highlighting</li>
            <li>• <strong>Test Management</strong> - Execute and monitor test classes with coverage reports</li>
            <li>• <strong>Org Exploration</strong> - Browse metadata and understand org structure</li>
            <li>• <strong>API Monitoring</strong> - Track API usage and limits in real-time</li>
          </ul>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card id="getting-started">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Launch DevConsole and connect your Salesforce orgs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Launch DevConsole</h4>
              <p className="text-muted-foreground mb-2">
                Click the button below to launch DevConsole and start your development session.
              </p>
              <Link 
                href="/devconsole"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                <Terminal className="w-4 h-4" />
                Launch DevConsole
              </Link>
            </div>
            
            <div id="authentication">
              <h4 className="font-semibold mb-2">2. Authentication</h4>
              <p className="text-muted-foreground mb-2">
                DevConsole uses OAuth 2.0 authentication to securely connect to your Salesforce orgs. Supported org types:
              </p>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Production orgs</li>
                <li>• Sandbox orgs</li>
                <li>• Scratch orgs</li>
                <li>• Developer orgs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Comprehensive development tools and capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold">Debug Logs</h4>
              </div>
              <p className="text-muted-foreground text-sm">
                Real-time log monitoring with advanced filtering, search, and analysis capabilities.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold">Trace Flags</h4>
              </div>
              <p className="text-muted-foreground text-sm">
                Manage debug trace flags for users and classes with easy enable/disable controls.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold">Query Builder</h4>
              </div>
              <p className="text-muted-foreground text-sm">
                Visual SOQL query builder with syntax highlighting and result visualization.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <h4 className="font-semibold">Anonymous Apex</h4>
              </div>
              <p className="text-muted-foreground text-sm">
                Execute anonymous Apex code with syntax highlighting and error handling.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <h4 className="font-semibold">Test Execution</h4>
              </div>
              <p className="text-muted-foreground text-sm">
                Run test classes with detailed coverage reports and performance metrics.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <Telescope className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="font-semibold">Org Exploration</h4>
              </div>
              <p className="text-muted-foreground text-sm">
                Browse metadata, objects, fields, and understand your org structure.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Your central hub for development activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The dashboard provides an overview of your current development session, including:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong>Current Org Information:</strong> Connected org details and authentication status</li>
            <li>• <strong>API Limits:</strong> Real-time monitoring of API usage and remaining limits</li>
            <li>• <strong>Recent Activity:</strong> Quick access to recent logs, queries, and executions</li>
            <li>• <strong>Quick Actions:</strong> Fast access to common development tasks</li>
            <li>• <strong>Org Health:</strong> Overview of org status and any issues</li>
          </ul>
        </CardContent>
      </Card>

      {/* Debug Logs */}
      <Card id="debug-logs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Debug Logs
          </CardTitle>
          <CardDescription>
            Advanced log monitoring and analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Real-time Monitoring</h4>
              <p className="text-muted-foreground">
                Monitor debug logs in real-time as they're generated in your org. Filter by user, log level, and time range.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Advanced Filtering</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Filter by log level (DEBUG, INFO, WARN, ERROR)</li>
                <li>• Filter by user or class</li>
                <li>• Time range filtering</li>
                <li>• Text search within log content</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Log Analysis</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Syntax highlighting for better readability</li>
                <li>• Expandable/collapsible sections</li>
                <li>• Performance metrics and timing</li>
                <li>• Error highlighting and stack traces</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Query Builder */}
      <Card id="query-builder">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Query Builder
          </CardTitle>
          <CardDescription>
            Visual SOQL query builder with advanced features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">SOQL Query Interface</h4>
              <p className="text-muted-foreground">
                Execute SOQL queries with a clean interface for building and running queries against your Salesforce data.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Execute SOQL queries</li>
                <li>• View query results in a table format</li>
                <li>• Query history for recent queries</li>
                <li>• Basic query validation</li>
                <li>• Export results to CSV</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Supported Query Types</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• SELECT queries with WHERE clauses</li>
                <li>• Aggregate queries (COUNT, SUM, AVG, etc.)</li>
                <li>• Relationship queries with parent/child objects</li>
                <li>• SOSL search queries</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anonymous Apex */}
      <Card id="anonymous-apex">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Anonymous Apex
          </CardTitle>
          <CardDescription>
            Execute anonymous Apex code for testing and debugging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Code Execution</h4>
              <p className="text-muted-foreground">
                Write and execute anonymous Apex code directly in the browser for testing, debugging, and data manipulation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Execute Apex code snippets</li>
                <li>• View execution results and debug output</li>
                <li>• Error handling and stack traces</li>
                <li>• Code history for recent executions</li>
                <li>• Governor limit monitoring</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Use Cases</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Testing custom code snippets</li>
                <li>• Data manipulation and cleanup</li>
                <li>• Debugging and troubleshooting</li>
                <li>• Quick data queries and updates</li>
                <li>• Prototyping and experimentation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Execution */}
      <Card id="test-execution">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Test Execution
          </CardTitle>
          <CardDescription>
            Comprehensive test management and execution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Test Class Execution</h4>
              <p className="text-muted-foreground">
                Execute individual test classes or multiple test classes with detailed reporting and coverage analysis.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Coverage Reports</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Line-by-line coverage analysis</li>
                <li>• Coverage trends over time</li>
                <li>• Identify uncovered code sections</li>
                <li>• Export coverage reports</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Test Results</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Detailed test method results</li>
                <li>• Failure analysis and debugging</li>
                <li>• Performance metrics</li>
                <li>• Test execution history</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Limits */}
      <Card id="api-limits">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            API Limits Monitoring
          </CardTitle>
          <CardDescription>
            Real-time API usage tracking and limit monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Real-time Monitoring</h4>
              <p className="text-muted-foreground">
                Monitor your org's API usage in real-time with visual indicators and alerts when approaching limits.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Tracked Limits</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Daily API calls</li>
                <li>• Daily SOQL queries</li>
                <li>• Daily DML statements</li>
                <li>• Daily SOSL queries</li>
                <li>• Daily Apex CPU time</li>
                <li>• Daily email sends</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Usage Analytics</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Historical usage trends</li>
                <li>• Peak usage identification</li>
                <li>• Usage by operation type</li>
                <li>• Optimization recommendations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong>Regular Monitoring:</strong> Check API limits regularly to avoid hitting daily limits</li>
            <li>• <strong>Efficient Queries:</strong> Use the query builder to optimize SOQL queries and reduce API calls</li>
            <li>• <strong>Debug Log Management:</strong> Clean up old debug logs and use appropriate log levels</li>
            <li>• <strong>Test Coverage:</strong> Maintain high test coverage and run tests regularly</li>
            <li>• <strong>Org Organization:</strong> Use the org explorer to understand your org structure</li>
            <li>• <strong>Security:</strong> Always use secure authentication and be mindful of data access</li>
            <li>• <strong>Performance:</strong> Monitor query performance and optimize slow-running operations</li>
          </ul>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card id="troubleshooting">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Common Issues</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Authentication Errors:</strong> Check org credentials and OAuth configuration</li>
                <li>• <strong>API Limit Exceeded:</strong> Monitor usage and optimize queries</li>
                <li>• <strong>Permission Errors:</strong> Ensure proper object and field permissions</li>
                <li>• <strong>Query Timeouts:</strong> Optimize complex queries and add proper filters</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Getting Help</h4>
              <p className="text-muted-foreground">
                If you encounter issues or need assistance, check the documentation or reach out for support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trace Flags */}
      <Card id="trace-flags">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Trace Flags
          </CardTitle>
          <CardDescription>
            Manage debug trace flags for enhanced logging and debugging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Debug Trace Management</h4>
              <p className="text-muted-foreground">
                Create and manage debug trace flags to control logging levels and capture detailed debug information for your development and testing processes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Create new trace flags for users and automated processes</li>
                <li>• Set debug levels (ERROR, WARN, INFO, DEBUG, FINE, FINER, FINEST)</li>
                <li>• Configure log categories and retention periods</li>
                <li>• Monitor trace flag status and expiration</li>
                <li>• Bulk operations for multiple trace flags</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Use Cases</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Debug complex Apex code execution</li>
                <li>• Monitor automated process performance</li>
                <li>• Troubleshoot integration issues</li>
                <li>• Track user activity and behavior</li>
                <li>• Optimize code performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Org Exploration */}
      <Card id="org-exploration">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Telescope className="w-5 h-5" />
            Org Exploration
          </CardTitle>
          <CardDescription>
            Browse and explore your Salesforce org's code components and metadata
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Code Component Browser</h4>
              <p className="text-muted-foreground">
                Explore your org's Apex classes, triggers, and Lightning components in an organized, searchable interface. View code content, metadata details, and component relationships.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Current Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Browse Apex classes and triggers</li>
                <li>• View Lightning Web Components (LWC)</li>
                <li>• Explore Aura components</li>
                <li>• Search and filter by component name</li>
                <li>• View component metadata and properties</li>
                <li>• Access component source code</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Supported Component Types</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Apex Classes</li>
                <li>• Apex Triggers</li>
                <li>• Lightning Web Components (LWC)</li>
                <li>• Aura Components</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Coming Soon</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Coming Soon</Badge>
                  <span className="text-muted-foreground">Custom Objects and Fields exploration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Coming Soon</Badge>
                  <span className="text-muted-foreground">Metadata dependencies and relationships</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Coming Soon</Badge>
                  <span className="text-muted-foreground">Flows and Process Builders</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Benefits</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Quickly locate and review code components</li>
                <li>• Understand component structure and relationships</li>
                <li>• Access source code for debugging and maintenance</li>
                <li>• Search across all code components efficiently</li>
                <li>• Streamline code review and documentation processes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
