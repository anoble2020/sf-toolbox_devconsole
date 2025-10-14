import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Download, Zap, Settings, BookOpen, Bug, Star, ExternalLink } from 'lucide-react'

export function EventFrameworkDocs() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Event Framework</h1>
            <p className="text-muted-foreground">A lightweight, metadata-driven platform event framework for Salesforce</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary">Apex Framework</Badge>
          <Badge variant="outline">100% Test Coverage</Badge>
          <Badge variant="outline">Metadata-Driven</Badge>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            A lightweight, dynamic, and comprehensive Salesforce platform event framework that provides a clean, extensible architecture for handling integration events across your org.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Platform events are a powerful tool for decoupling systems and enabling real-time integration, but without proper structure, they can become difficult to manage and debug. This framework provides a clean, metadata-driven approach to handling platform events that promotes:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong>Separation of concerns</strong> - Event handling logic is separated from dispatching logic</li>
            <li>• <strong>Metadata-driven configuration</strong> - Event handlers are configured through custom metadata</li>
            <li>• <strong>Extensibility</strong> - Easy to add new event handlers without modifying existing code</li>
            <li>• <strong>Testability</strong> - Comprehensive test coverage with mock handlers</li>
            <li>• <strong>Error handling</strong> - Robust error handling and logging throughout the framework</li>
          </ul>
        </CardContent>
      </Card>

      {/* Architecture */}
      <Card id="architecture">
        <CardHeader>
          <CardTitle>Architecture</CardTitle>
          <CardDescription>
            The framework follows a dispatcher pattern where platform events are automatically routed to their appropriate handlers based on metadata configuration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            Platform Event → IntegrationEventDispatcher → Handler Mapping (Metadata) → Event Handler → Business Logic
          </div>
        </CardContent>
      </Card>

      {/* Installation */}
      <Card id="installation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Installation
          </CardTitle>
          <CardDescription>
            Deploy this unlocked package directly using one of these methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="quick" className="w-full">
            <TabsList>
              <TabsTrigger value="quick">Quick Install</TabsTrigger>
              <TabsTrigger value="sfdx">SFDX CLI</TabsTrigger>
              <TabsTrigger value="manual">Manual Deployment</TabsTrigger>
            </TabsList>
            <TabsContent value="quick" className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Install in Production:</p>
                <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                  <a href="#" className="text-primary hover:underline">Install in Production</a>
                </div>
                <p className="font-medium">Install in Sandbox:</p>
                <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                  <a href="#" className="text-primary hover:underline">Install in Sandbox</a>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="sfdx" className="space-y-4">
              <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                sf package install --package 04tgL0000007qptQAA
              </div>
            </TabsContent>
            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                  git clone https://github.com/anoble2020/sf-toolbox_event-framework.git<br/>
                  cd sf-toolbox_event-framework<br/>
                  sf project deploy start --source-dir force-app
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Components */}
      <Card id="components">
        <CardHeader>
          <CardTitle>Components</CardTitle>
          <CardDescription>
            Key components of the Event Framework
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">IntegrationEventDispatcher</h4>
            <p className="text-muted-foreground mb-2">
              The core dispatcher that routes platform events to their appropriate handlers based on custom metadata configuration.
            </p>
            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
              IntegrationEventDispatcher.dispatchEvents(events);
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">IEventHandler Interface</h4>
            <p className="text-muted-foreground mb-2">
              Defines the contract for all event handlers in the framework.
            </p>
            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
              public interface IEventHandler &#123;<br/>
              &nbsp;&nbsp;void handleEvent(Integration_Event__e event, Map&lt;String, Object&gt; eventData);<br/>
              &nbsp;&nbsp;void sendResponse(String message, String externalRecordId);<br/>
              &#125;
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">BaseEventHandler</h4>
            <p className="text-muted-foreground mb-2">
              Abstract base class that provides common functionality for event handlers.
            </p>
            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
              public abstract class BaseEventHandler implements IEventHandler &#123;<br/>
              &nbsp;&nbsp;public void sendResponse(String message) &#123;<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;EventUtility.sendResponse(message);<br/>
              &nbsp;&nbsp;&#125;<br/>
              &#125;
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Metadata */}
      <Card id="custom-metadata">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Custom Metadata Configuration
          </CardTitle>
          <CardDescription>
            Configure event handlers through custom metadata
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Configure event handlers through custom metadata using <code className="bg-muted px-1 rounded">Integration_Handler_Setting__mdt</code>:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Field</th>
                    <th className="border border-border p-2 text-left">Description</th>
                    <th className="border border-border p-2 text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2 font-mono">Event_Type__c</td>
                    <td className="border border-border p-2">The event type to handle</td>
                    <td className="border border-border p-2">AccountCreated</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 font-mono">Apex_Handler_Class__c</td>
                    <td className="border border-border p-2">The handler class name</td>
                    <td className="border border-border p-2">AccountEventHandler</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 font-mono">Active__c</td>
                    <td className="border border-border p-2">Whether the handler is active</td>
                    <td className="border border-border p-2">true</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Example */}
      <Card id="implementation-example">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Implementation Example
          </CardTitle>
          <CardDescription>
            How to create and use an event handler
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Create an Event Handler</h4>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`public class AccountEventHandler extends BaseEventHandler {
    
    public override void handleEvent(Integration_Event__e event, Map<String, Object> eventData) {
        try {
            String accountId = (String) eventData.get('accountId');
            String accountName = (String) eventData.get('name');
            
            // Your business logic here
            processAccountCreation(accountId, accountName);
            
            // Send response if needed
            sendResponse('Account processed successfully', accountId);
            
        } catch (Exception ex) {
            System.debug(LoggingLevel.ERROR, 'Error processing account event: ' + ex.getMessage());
        }
    }
    
    private void processAccountCreation(String accountId, String accountName) {
        // Your implementation here
    }
}`}</pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Publish Events</h4>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`// In your trigger, flow, or other Apex code
Map<String, Object> eventData = new Map<String, Object>{
    'accountId' => account.Id,
    'name' => account.Name,
    'industry' => account.Industry
};

Integration_Event__e event = EventUtility.createEvent(
    'AccountCreated', 
    JSON.serialize(eventData),
    account.Id
);

EventUtility.publishEvents(new List<Integration_Event__e>{ event });`}</pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Event Schema */}
      <Card id="platform-event-schema">
        <CardHeader>
          <CardTitle>Platform Event Schema</CardTitle>
          <CardDescription>
            Integration_Event__e platform event structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Field</th>
                  <th className="border border-border p-2 text-left">Type</th>
                  <th className="border border-border p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2 font-mono">Event_Type__c</td>
                  <td className="border border-border p-2">Text(255)</td>
                  <td className="border border-border p-2">The type of event being published</td>
                </tr>
                <tr>
                  <td className="border border-border p-2 font-mono">Data__c</td>
                  <td className="border border-border p-2">Long Text Area</td>
                  <td className="border border-border p-2">JSON data payload</td>
                </tr>
                <tr>
                  <td className="border border-border p-2 font-mono">Environment__c</td>
                  <td className="border border-border p-2">Text(255)</td>
                  <td className="border border-border p-2">Environment identifier</td>
                </tr>
                <tr>
                  <td className="border border-border p-2 font-mono">Related_Id__c</td>
                  <td className="border border-border p-2">Text(255)</td>
                  <td className="border border-border p-2">Related record ID</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card id="best-practices">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong>Event Naming:</strong> Use descriptive, consistent event type names (e.g., AccountCreated, OpportunityClosed)</li>
            <li>• <strong>Data Structure:</strong> Use consistent JSON structure for event data</li>
            <li>• <strong>Error Handling:</strong> Always include try-catch blocks in your handlers</li>
            <li>• <strong>Testing:</strong> Write comprehensive tests for all event handlers</li>
            <li>• <strong>Metadata Management:</strong> Use custom metadata to manage handler configuration</li>
            <li>• <strong>Logging:</strong> Use appropriate logging levels for debugging and monitoring</li>
          </ul>
        </CardContent>
      </Card>

      {/* Links */}
      <Card id="resources">
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <a
              href="https://github.com/anoble2020/sf-toolbox_event-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <ExternalLink className="w-4 h-4" />
              View on GitHub
            </a>
            <a
              href="https://github.com/anoble2020/sf-toolbox_event-framework/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <Bug className="w-4 h-4" />
              Report Issues
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
