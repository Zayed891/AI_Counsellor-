import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { GraduationCap, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface NavbarProps {
    variant?: 'dark' | 'light'
}

export default function Navbar({ variant = 'dark' }: NavbarProps) {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const isActive = (path: string) => location.pathname === path

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/discover', label: 'Discover' },
        { path: '/shortlist', label: 'Shortlist' },
        { path: '/guidance', label: 'Guidance' },
        { path: '/counselor', label: 'AI Counselor' },
    ]

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                (scrolled || mobileMenuOpen) ? 'bg-black/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent',
                variant === 'light' && 'bg-white/95'
            )}
        >
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-5">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-foreground">
                        <GraduationCap size={28} />
                        <span className="font-bold text-xl">AI Counsellor</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {user ? (
                            <>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={cn(
                                            'text-sm font-mono uppercase tracking-wider transition-colors',
                                            isActive(link.path)
                                                ? 'text-foreground'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Button variant="sharp-outline" size="sm" onClick={handleSignOut}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Login
                                </Link>
                                <Button variant="sharp" size="sm" asChild>
                                    <Link to="/signup">Get Started →</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 flex flex-col gap-4">
                        {user ? (
                            <>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={cn(
                                            'text-sm font-mono uppercase tracking-wider py-2',
                                            isActive(link.path)
                                                ? 'text-foreground'
                                                : 'text-muted-foreground'
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Button variant="sharp-outline" onClick={handleSignOut}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-mono uppercase tracking-wider text-muted-foreground py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Button variant="sharp" asChild>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                        Get Started →
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
