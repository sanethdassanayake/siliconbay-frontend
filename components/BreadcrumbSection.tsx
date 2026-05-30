'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb'
import Link from 'next/link'

const BreadcrumbSection = () => {
    const pathname = usePathname()
    
    // Split the pathname into segments and filter out empty strings
    const segments = pathname.split('/').filter(segment => segment !== '')
    
    // Function to capitalize and format segment names
    const formatSegment = (segment: string) => {
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }
    
    // Build the breadcrumb path
    const breadcrumbs = segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`
        const label = formatSegment(segment)
        const isLast = index === segments.length - 1
        
        return { path, label, isLast }
    })
    
    return (
        <Breadcrumb>
            <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className={crumb.isLast ? 'flex-1 min-w-0' : ''}>
                            {crumb.isLast ? (
                                <span className="truncate block">{crumb.label}</span>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={crumb.path}>{crumb.label}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadcrumbSection