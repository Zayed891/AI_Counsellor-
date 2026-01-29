import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn, profile } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await signIn(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        // Redirect based on onboarding status
        // Fetch fresh profile data to ensure we have the latest status
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('onboarding_complete')
                .eq('user_id', user.id)
                .single()

            if (profileData?.onboarding_complete) {
                navigate('/dashboard')
            } else {
                navigate('/onboarding')
            }
        } else {
            navigate('/onboarding')
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-black">
            {/* Left - Form */}
            <div className="flex flex-col p-8 lg:p-12 bg-black border-r border-white/5">
                <Link to="/" className="flex items-center gap-2 text-white mb-16">
                    <GraduationCap size={28} />
                    <span className="font-bold text-xl tracking-tight">AI Counsellor</span>
                </Link>

                <div className="flex-1 flex flex-col justify-center max-w-md">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-neutral-400 mb-8 text-lg">
                        Continue your journey to finding the perfect university.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-mono">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-neutral-500">Email Address</Label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                                />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-11 bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-neutral-500">Password</Label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                                />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-11 bg-neutral-900 border-white/10 text-white placeholder:text-neutral-600 focus:border-white/30 h-12"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="sharp"
                            size="lg"
                            className="w-full h-12 text-base"
                            disabled={loading}
                        >
                            {loading ? 'SIGNING IN...' : 'SIGN IN'} <ArrowRight size={18} />
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-neutral-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-white hover:text-neutral-300 font-medium hover:underline decoration-white/30 underline-offset-4">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right - Visual */}
            <div className="hidden lg:flex items-center justify-center bg-[#050505] p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent opacity-50" />
                <div className="max-w-md text-center relative z-10">
                    <h2 className="text-4xl font-extrabold mb-6 text-white tracking-tight">
                        Find Your Dream University
                    </h2>
                    <p className="text-neutral-400 mb-12 text-lg leading-relaxed">
                        AI-powered recommendations tailored to your profile, budget, and aspirations.
                    </p>
                    <div className="space-y-4 text-left inline-block">
                        {[
                            '500+ Universities',
                            'Personalized Matching',
                            'AI Counselor Chat'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-neutral-300 font-mono text-sm">
                                <div className="w-5 h-5 bg-white text-black flex items-center justify-center text-[10px] font-bold">✓</div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
