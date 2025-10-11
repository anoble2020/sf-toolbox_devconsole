import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Download, Settings, BookOpen, Bug, Star, ExternalLink, Zap } from 'lucide-react'

export function TriggerFrameworkDocs() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Trigger Framework</h1>
            <p className="text-muted-foreground">A personal, lightweight Apex trigger framework for Salesforce</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary">Apex Framework</Badge>
          <Badge variant="outline">Lightweight</Badge>
          <Badge variant="outline">Best Practices</Badge>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            A personal, lightweight Apex trigger framework designed to streamline trigger management in Salesforce with clean architecture and best practices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This trigger framework provides a structured approach to handling triggers in Salesforce, promoting clean code, maintainability, and scalability. The framework follows industry best practices and design patterns to ensure your trigger logic is organized and efficient.
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong>Clean Architecture</strong> - Separation of concerns with handler and helper classes</li>
            <li>• <strong>Best Practices</strong> - Follows Salesforce recommended patterns and guidelines</li>
            <li>• <strong>Lightweight</strong> - Minimal overhead with maximum functionality</li>
            <li>• <strong>Maintainable</strong> - Easy to understand and modify code structure</li>
            <li>• <strong>Scalable</strong> - Designed to handle complex business logic efficiently</li>
            <li>• <strong>Well Documented</strong> - Comprehensive documentation and examples</li>
          </ul>
        </CardContent>
      </Card>

      {/* Architecture */}
      <Card id="architecture">
        <CardHeader>
          <CardTitle>Architecture</CardTitle>
          <CardDescription>
            The framework follows a handler-helper pattern that separates trigger logic from business logic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              Trigger → TriggerHandler → TriggerHelper → Business Logic
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">TriggerHandler</h4>
                <p className="text-muted-foreground text-sm">
                  Main entry point that determines which operations to perform based on trigger context (before/after, insert/update/delete).
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">TriggerHelper</h4>
                <p className="text-muted-foreground text-sm">
                  Contains the actual business logic and processing methods. Separated for better testability and reusability.
                </p>
              </div>
            </div>
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
            Deploy the trigger framework to your Salesforce org
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sfdx" className="w-full">
            <TabsList>
              <TabsTrigger value="sfdx">SFDX CLI</TabsTrigger>
              <TabsTrigger value="manual">Manual Deployment</TabsTrigger>
            </TabsList>
            <TabsContent value="sfdx" className="space-y-4">
              <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                git clone https://github.com/anoble2020/sf-toolbox_trigger-framework.git<br/>
                cd sf-toolbox_trigger-framework<br/>
                sf project deploy start --source-dir force-app
              </div>
            </TabsContent>
            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <p className="text-muted-foreground">1. Clone the repository</p>
                <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                  git clone https://github.com/anoble2020/sf-toolbox_trigger-framework.git
                </div>
                <p className="text-muted-foreground">2. Deploy using your preferred method (VS Code, Workbench, etc.)</p>
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
            Key components of the Trigger Framework
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">BaseTriggerHandler</h4>
            <p className="text-muted-foreground mb-2">
              Abstract base class that provides the framework structure and common functionality.
            </p>
            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
              public abstract class BaseTriggerHandler implements ITriggerHandler &#123;<br/>
              &nbsp;&nbsp;public void run() &#123;<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;if (Trigger.isBefore) &#123;<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;before();<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&#125; else if (Trigger.isAfter) &#123;<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;after();<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
              &nbsp;&nbsp;&#125;<br/>
              &#125;
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">ITriggerHandler Interface</h4>
            <p className="text-muted-foreground mb-2">
              Defines the contract for all trigger handlers in the framework.
            </p>
            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
              public interface ITriggerHandler &#123;<br/>
              &nbsp;&nbsp;void run();<br/>
              &nbsp;&nbsp;void before();<br/>
              &nbsp;&nbsp;void after();<br/>
              &#125;
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">TriggerHelper Classes</h4>
            <p className="text-muted-foreground mb-2">
              Helper classes that contain the actual business logic and processing methods.
            </p>
            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
              public class AccountTriggerHelper &#123;<br/>
              &nbsp;&nbsp;public static void handleBeforeInsert(List&lt;Account&gt; accounts) &#123;<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;// Business logic here<br/>
              &nbsp;&nbsp;&#125;<br/>
              &nbsp;&nbsp;public static void handleAfterInsert(List&lt;Account&gt; accounts) &#123;<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;// Business logic here<br/>
              &nbsp;&nbsp;&#125;<br/>
              &#125;
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
            How to create and use a trigger handler
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Create a Trigger Handler</h4>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`public class AccountTriggerHandler extends BaseTriggerHandler {
    
    public override void beforeInsert() {
        try {
            AccountTriggerHelper.handleBeforeInsert(Trigger.new);
        } catch (Exception ex) {
            System.debug(LoggingLevel.ERROR, 'Error in AccountTriggerHandler.beforeInsert: ' + ex.getMessage());
        }
    }
    
    public override void afterInsert() {
        try {
            AccountTriggerHelper.handleAfterInsert(Trigger.new);
        } catch (Exception ex) {
            System.debug(LoggingLevel.ERROR, 'Error in AccountTriggerHandler.afterInsert: ' + ex.getMessage());
        }
    }
    
    public override void beforeUpdate() {
        try {
            AccountTriggerHelper.handleBeforeUpdate(Trigger.new, Trigger.oldMap);
        } catch (Exception ex) {
            System.debug(LoggingLevel.ERROR, 'Error in AccountTriggerHandler.beforeUpdate: ' + ex.getMessage());
        }
    }
    
    public override void afterUpdate() {
        try {
            AccountTriggerHelper.handleAfterUpdate(Trigger.new, Trigger.oldMap);
        } catch (Exception ex) {
            System.debug(LoggingLevel.ERROR, 'Error in AccountTriggerHandler.afterUpdate: ' + ex.getMessage());
        }
    }
}`}</pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Create a Trigger Helper</h4>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`public class AccountTriggerHelper {
    
    public static void handleBeforeInsert(List<Account> accounts) {
        // Set default values, validate data, etc.
        for (Account acc : accounts) {
            if (String.isBlank(acc.Industry)) {
                acc.Industry = 'Technology';
            }
        }
    }
    
    public static void handleAfterInsert(List<Account> accounts) {
        // Create related records, send notifications, etc.
        List<Contact> contactsToCreate = new List<Contact>();
        
        for (Account acc : accounts) {
            if (acc.Create_Default_Contact__c) {
                contactsToCreate.add(new Contact(
                    FirstName = 'Default',
                    LastName = 'Contact',
                    AccountId = acc.Id
                ));
            }
        }
        
        if (!contactsToCreate.isEmpty()) {
            insert contactsToCreate;
        }
    }
    
    public static void handleBeforeUpdate(List<Account> newAccounts, Map<Id, Account> oldAccounts) {
        // Compare old vs new values, update fields, etc.
        for (Account acc : newAccounts) {
            Account oldAcc = oldAccounts.get(acc.Id);
            if (acc.Name != oldAcc.Name) {
                acc.Name_Changed__c = true;
            }
        }
    }
    
    public static void handleAfterUpdate(List<Account> newAccounts, Map<Id, Account> oldAccounts) {
        // Process changes, update related records, etc.
        // Implementation here
    }
}`}</pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Create the Trigger</h4>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`trigger AccountTrigger on Account (before insert, after insert, before update, after update) {
    AccountTriggerHandler handler = new AccountTriggerHandler();
    handler.run();
}`}</pre>
            </div>
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
            <li>• <strong>One Trigger Per Object:</strong> Use only one trigger per object to avoid execution order issues</li>
            <li>• <strong>Bulk Processing:</strong> Always write triggers to handle bulk operations efficiently</li>
            <li>• <strong>Error Handling:</strong> Include comprehensive error handling in all trigger methods</li>
            <li>• <strong>Testing:</strong> Write thorough test classes with high code coverage</li>
            <li>• <strong>Separation of Concerns:</strong> Keep business logic in helper classes, not in triggers</li>
            <li>• <strong>Governor Limits:</strong> Be mindful of governor limits and optimize queries</li>
            <li>• <strong>Recursive Triggers:</strong> Implement mechanisms to prevent infinite recursion</li>
            <li>• <strong>Documentation:</strong> Document complex business logic and decision points</li>
          </ul>
        </CardContent>
      </Card>

      {/* Testing */}
      <Card id="testing">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The framework includes comprehensive test coverage. When writing tests for trigger helpers, use DML operations rather than calling helper methods directly to ensure the trigger handler and helper methods fire properly.
          </p>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`@isTest
public class AccountTriggerHandlerTest {
    
    @TestSetup
    static void setupTestData() {
        // Create test data using TestDataFactory
        List<Account> testAccounts = TestDataFactory.createAccounts(5);
        insert testAccounts;
    }
    
    @isTest
    static void testBeforeInsert() {
        // Test data setup
        List<Account> accounts = new List<Account>();
        for (Integer i = 0; i < 3; i++) {
            accounts.add(new Account(Name = 'Test Account ' + i));
        }
        
        Test.startTest();
        insert accounts; // This will fire the trigger
        Test.stopTest();
        
        // Assertions
        List<Account> insertedAccounts = [SELECT Industry FROM Account WHERE Name LIKE 'Test Account%'];
        for (Account acc : insertedAccounts) {
            System.assertEquals('Technology', acc.Industry, 'Default industry should be set');
        }
    }
}`}</pre>
          </div>
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
              href="https://github.com/anoble2020/sf-toolbox_trigger-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <ExternalLink className="w-4 h-4" />
              View on GitHub
            </a>
            <a
              href="https://github.com/anoble2020/sf-toolbox_trigger-framework/issues"
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
