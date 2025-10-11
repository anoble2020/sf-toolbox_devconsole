'use client'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DocsSidebar } from "@/components/DocsSidebar"

interface DocsLayoutProps {
  children: React.ReactNode
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <SidebarProvider>
        <DocsSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-6">
              <SidebarTrigger className="md:hidden" />
            </div>
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
