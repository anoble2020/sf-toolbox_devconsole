'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Disc, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RefreshCw } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface Log {
    id: string
    user: string
    userId: string
    operation: string
    time: string
    duration: string
    status: string
    size: string
    content?: string
    durationMilliseconds?: number
}

interface SortConfig {
    key: keyof Log
    direction: 'asc' | 'desc'
}

// Create a type for the header configuration
type HeaderConfig = {
    key: keyof Log
    label: string
}

interface LogsTableProps {
    logs: Log[]
    onSelectLog: (log: Log) => void
    onRefresh: () => void
    currentUserOnly: boolean
    onToggleCurrentUser: (checked: boolean) => void
    isLoadingLog?: boolean
    isCollapsed: boolean
    onToggleCollapse: () => void
    isLiveTailing: boolean
    onToggleLiveTailing: () => void
    countdown: number
    tableLoading: boolean
}

export function LogsTable({
    logs,
    onSelectLog,
    onRefresh,
    currentUserOnly,
    onToggleCurrentUser,
    isLoadingLog,
    isCollapsed,
    onToggleCollapse,
    isLiveTailing,
    onToggleLiveTailing,
    countdown,
    tableLoading,
}: LogsTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'time',
        direction: 'desc',
    })
    const logsPerPage = 5

    // Animated ellipsis component
    const AnimatedEllipsis = () => (
        <span className="inline-block">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
        </span>
    )

    const handleSort = (key: keyof Log) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }))
    }

    // Sort logs
    const sortedLogs = [...logs].sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        
        if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
    })

    // Get current page logs
    const paginatedLogs = sortedLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage)

    // Add a helper function to format duration
    const formatDuration = (ms?: number): string => {
        console.log(`Formatting duration: ${ms}`)
        if (!ms) return '-'

        if (ms < 1000) {
            return `${ms}ms`
        }

        const seconds = Math.floor(ms / 1000)
        const remainingMs = ms % 1000

        if (seconds < 60) {
            return `${seconds}.${remainingMs.toString().padStart(3, '0')}s`
        }

        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60

        return `${minutes}m ${remainingSeconds}s`
    }

    // Add a helper function to format datetime
    const formatDateTime = (dateStr: string): string => {
        try {
            const date = new Date(dateStr)
            return new Intl.DateTimeFormat('en-US', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(date)
        } catch (e) {
            return dateStr
        }
    }

    // Define headers with their sort keys
    const headers: HeaderConfig[] = [
        { key: 'user', label: 'User' },
        { key: 'operation', label: 'Operation' },
        { key: 'time', label: 'Time' },
        { key: 'duration', label: 'Duration' },
        { key: 'status', label: 'Status' },
        { key: 'size', label: 'Size' },
    ]

    return (
        <div className="bg-background border-t border-gray-200 dark:border-gray-700 h-full flex flex-col">
            {/* Table controls at the top */}
            <div className="flex justify-end gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleCollapse}
                >
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>

            {/* Table content */}
            <div className="flex-1 overflow-auto relative">
                {tableLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                    </div>
                )}
                <table className="w-full text-[11px]">
                    <TableHeader>
                        <TableRow>
                            {headers.map((header) => (
                                <TableHead
                                    key={`header-${header.key}`}
                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 text-[11px] whitespace-nowrap"
                                    onClick={() => handleSort(header.key)}
                                >
                                    {header.label}
                                    {sortConfig.key === header.key && (
                                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedLogs
                            .filter((log) => log && log.id)
                            .map((log) => (
                                <TableRow
                                    key={log.id}
                                    className={cn(
                                        'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600',
                                        isLoadingLog && 'opacity-50 pointer-events-none',
                                    )}
                                    onClick={() => !isLoadingLog && onSelectLog(log)}
                                >
                                    <TableCell className="whitespace-nowrap">{log.user}</TableCell>
                                    <TableCell className="whitespace-nowrap">{log.operation}</TableCell>
                                    <TableCell className="whitespace-nowrap">{formatDateTime(log.time)}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {formatDuration(log.durationMilliseconds)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap truncate max-w-[200px]">
                                        {log.status}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">{log.size}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </table>
            </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center p-2 border-t bg-background">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="current-user-logs"
                                    checked={currentUserOnly}
                                    onCheckedChange={onToggleCurrentUser}
                                    className="dark:bg-white"
                                />
                                <Label htmlFor="current-user-logs" className="text-xs text-gray-600 dark:text-gray-400">
                                    My Logs Only
                                </Label>
                                <Button
                                    variant="outline"
                                    aria-label="Refresh"
                                    size="sm"
                                    onClick={onRefresh}
                                    >
                                    <RefreshCw className="h-4 w-4" />
                                    Refresh
                                </Button>
                                <Button
                                    variant={isLiveTailing ? "default" : "outline"}
                                    aria-label="Live Tailing"
                                    size="sm"
                                    onClick={onToggleLiveTailing}
                                    className={isLiveTailing ? "bg-red-500 hover:bg-red-600 text-white" : ""}
                                    >
                                    <Disc className={cn("h-4 w-4", isLiveTailing && "animate-pulse text-red-200")} />
                                    Live Tailing
                                </Button>
                                {isLiveTailing && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                        Refreshing logs in {countdown} <AnimatedEllipsis />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                Page {currentPage} of {Math.ceil(logs.length / logsPerPage)}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.min(Math.ceil(logs.length / logsPerPage), p + 1))}
                                disabled={currentPage === Math.ceil(logs.length / logsPerPage)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
        </div>
    )
}
