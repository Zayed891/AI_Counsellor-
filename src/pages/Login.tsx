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
    const { signIn, signInWithGoogle } = useAuth()
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

    const handleGoogleSignIn = async () => {
        setError('')
        setLoading(true)
        const { error } = await signInWithGoogle()
        if (error) {
            setError(error.message)
            setLoading(false)
        }
        // Redirect is handled by Supabase automatically
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

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-2 text-neutral-500 font-mono">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleSignIn}
                        className="w-full h-12 bg-white text-black hover:bg-neutral-200 border-none font-bold tracking-wide"
                        disabled={loading}
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        GOOGLE
                    </Button>

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
