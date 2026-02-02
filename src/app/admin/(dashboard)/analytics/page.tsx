"use client";

import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

export default function AnalyticsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Analytics</h1>
                <p className="text-white/50 mt-1">Track orders and monitor stock</p>
            </div>
            <AnalyticsDashboard />
        </div>
    );
}
