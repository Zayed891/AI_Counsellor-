import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
    LayoutDashboard,
    MessageSquare,
    GraduationCap,
    Target,
    CheckSquare,
    User,
    LogOut,
    Menu,
    X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function DashboardLayout() {
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        window.location.replace('/')
    }

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/counselor', label: 'AI Counsellor', icon: MessageSquare },
        { path: '/discover', label: 'Universities', icon: GraduationCap },
        { path: '/shortlist', label: 'Shortlist', icon: Target },
        { path: '/guidance', label: 'Tasks', icon: CheckSquare },
        { path: '/onboarding', label: 'Profile', icon: User },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
            {/* Main Container with rounded corners */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl min-h-[calc(100vh-48px)] flex overflow-hidden">
                {/* Sidebar (Desktop) */}
                <aside className="hidden md:flex flex-col w-52 border-r border-gray-100 bg-white/50">
                    {/* Logo */}
                    <div className="p-5 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                                <path d="M12 2L4 6v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V6l-8-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg text-gray-900 tracking-tight">AI Counsellor</span>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 py-4 px-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                                    isActive(link.path)
                                        ? 'bg-gray-900 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                )}
                            >
                                <link.icon size={18} />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                        >
                            <LogOut size={18} />
                            Log out
                        </button>
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/30 z-40 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Mobile Menu Content (Slide-out) */}
                {mobileMenuOpen && (
                    <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col md:hidden animate-in slide-in-from-left shadow-2xl">
                        <div className="p-5 flex items-center justify-between border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                                        <path d="M12 2L4 6v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V6l-8-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="font-bold text-lg text-gray-900">AI Counsellor</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="text-gray-500">
                                <X size={20} />
                            </Button>
                        </div>
                        <div className="flex-1 p-3 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all',
                                        isActive(link.path)
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    )}
                                >
                                    <link.icon size={18} />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-100">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-3 px-3 py-2.5 w-full text-gray-500 hover:text-gray-900 text-sm"
                            >
                                <LogOut size={18} />
                                Log out
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content Wrapper */}
                <div className="flex-1 flex flex-col min-h-full">
                    {/* Mobile Header */}
                    <header className="h-14 bg-white/50 border-b border-gray-100 sticky top-0 z-20 px-4 flex items-center justify-between md:hidden">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
                                <Menu size={20} />
                            </Button>
                            <span className="font-bold text-gray-900">AI Counsellor</span>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-5 md:p-8 overflow-y-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}
