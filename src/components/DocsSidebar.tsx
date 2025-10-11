'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, Terminal, Zap, Settings, BookOpen, Download, Code, Bug, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const docsNav = [
  {
    title: "DevConsole",
    icon: Terminal,
    href: "/docs",
    items: [
      {
        title: "Getting Started",
        href: "/docs#getting-started",
      },
      {
        title: "Authentication",
        href: "/docs#authentication",
      },
      {
        title: "Debug Logs",
        href: "/docs#debug-logs",
      },
      {
        title: "Trace Flags",
        href: "/docs#trace-flags",
      },
      {
        title: "Query Builder",
        href: "/docs#query-builder",
      },
      {
        title: "Anonymous Apex",
        href: "/docs#anonymous-apex",
      },
      {
        title: "Test Execution",
        href: "/docs#test-execution",
      },
      {
        title: "Org Exploration",
        href: "/docs#org-exploration",
      },
      {
        title: "API Limits",
        href: "/docs#api-limits",
      },
      {
        title: "Troubleshooting",
        href: "/docs#troubleshooting",
      },
    ],
  },
  {
    title: "Event Framework",
    icon: Zap,
    href: "/docs/event-framework",
    items: [
      {
        title: "Architecture",
        href: "/docs/event-framework#architecture",
      },
      {
        title: "Installation",
        href: "/docs/event-framework#installation",
      },
      {
        title: "Components",
        href: "/docs/event-framework#components",
      },
      {
        title: "Custom Metadata",
        href: "/docs/event-framework#custom-metadata",
      },
      {
        title: "Implementation Example",
        href: "/docs/event-framework#implementation-example",
      },
      {
        title: "Platform Event Schema",
        href: "/docs/event-framework#platform-event-schema",
      },
      {
        title: "Best Practices",
        href: "/docs/event-framework#best-practices",
      },
      {
        title: "Resources",
        href: "/docs/event-framework#resources",
      },
    ],
  },
  {
    title: "Trigger Framework",
    icon: Settings,
    href: "/docs/trigger-framework",
    items: [
      {
        title: "Architecture",
        href: "/docs/trigger-framework#architecture",
      },
      {
        title: "Installation",
        href: "/docs/trigger-framework#installation",
      },
      {
        title: "Components",
        href: "/docs/trigger-framework#components",
      },
      {
        title: "Best Practices",
        href: "/docs/trigger-framework#best-practices",
      },
      {
        title: "Testing",
        href: "/docs/trigger-framework#testing",
      },
      {
        title: "Implementation Example",
        href: "/docs/trigger-framework#implementation-example",
      },
      {
        title: "Resources",
        href: "/docs/trigger-framework#resources",
      },
    ],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(['DevConsole'])

  // Auto-open the correct section based on current pathname
  useEffect(() => {
    if (pathname.startsWith('/docs/event-framework')) {
      setOpenSections(['Event Framework'])
    } else if (pathname.startsWith('/docs/trigger-framework')) {
      setOpenSections(['Trigger Framework'])
    } else if (pathname.startsWith('/docs')) {
      setOpenSections(['DevConsole'])
    }
  }, [pathname])

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => {
      if (prev.includes(sectionTitle)) {
        // If clicking on an already open section, close it
        return prev.filter(s => s !== sectionTitle)
      } else {
        // If clicking on a closed section, close all others and open this one
        return [sectionTitle]
      }
    })
  }

  return (
    <Sidebar className="border-r docs-sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Documentation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {docsNav.map((section) => (
                <Collapsible
                  key={section.title}
                  open={openSections.includes(section.title)}
                  onOpenChange={() => toggleSection(section.title)}
                >
                  <SidebarMenuItem>
                    <div className="flex">
                      <SidebarMenuButton asChild className="flex-1">
                        <Link href={section.href}>
                          <section.icon className="w-4 h-4" />
                          <span>{section.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-8 p-0">
                          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {section.items.map((item) => (
                          <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton asChild>
                              <Link 
                                href={item.href}
                                className={pathname === item.href ? "bg-accent text-accent-foreground" : ""}
                              >
                                {item.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/docs/api-reference">
                    <Code className="w-4 h-4" />
                    <span>API Reference</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/docs/examples">
                    <BookOpen className="w-4 h-4" />
                    <span>Examples</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/docs/faq">
                    <HelpCircle className="w-4 h-4" />
                    <span>FAQ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
