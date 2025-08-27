'use client';

import { CheckCircle2, CircleDashed, Users, Lightbulb, Wrench, Rocket, BrainCircuit } from 'lucide-react';
import StatCard from './stat-card';
import { type Aptitude } from '@/lib/questions';

interface AdminDashboardProps {
    stats: {
        completedCount: number;
        pendingCount: number;
        profileCounts: { [key in Aptitude]?: number };
    };
}

const profileIcons: { [key in Aptitude]: React.ElementType } = {
    Clarifier: BrainCircuit,
    Ideator: Lightbulb,
    Developer: Wrench,
    Implementer: Rocket,
}

const AdminDashboard = ({ stats }: AdminDashboardProps) => {
    return (
        <div className="mb-8">
             <h2 className="text-2xl font-bold mb-4">Resumen</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* General Stats */}
                <StatCard 
                    title="Completadas"
                    value={stats.completedCount}
                    icon={CheckCircle2}
                />
                <StatCard 
                    title="Pendientes"
                    value={stats.pendingCount}
                    icon={CircleDashed}
                />
                <StatCard
                    title="Total de Entrevistas"
                    value={stats.completedCount + stats.pendingCount}
                    icon={Users}
                />
                
                {/* Profile Stats */}
                 {(Object.keys(stats.profileCounts) as Aptitude[]).map(profile => (
                     <StatCard
                        key={profile}
                        title={profile}
                        value={stats.profileCounts[profile] || 0}
                        icon={profileIcons[profile]}
                     />
                 ))}
             </div>
        </div>
    )
}

export default AdminDashboard;

    