import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'

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
            setError('The email or password you entered is incorrect.')
            setLoading(false)
            return
        }

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
    }

    return (
        <div className="h-screen w-full relative flex items-center justify-center bg-zinc-50 font-sans overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop"
                    alt="University Campus"
                    className="w-full h-full object-cover"
                />
                <div
                    className="absolute inset-0 mix-blend-multiply"
                    style={{
                        background: 'linear-gradient(180deg, #D6E4FF 0%, #9AE3F8 100%)',
                        opacity: 0.2
                    }}
                />
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-[16px] shadow-[0px_8px_10px_-6px_#0000001A,0px_20px_25px_-5px_#0000001A] border border-slate-100 p-6 sm:p-8 mx-4 flex flex-col">
                {/* Back to Home */}
                <div className="flex-none mb-3">
                    <Link to="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors">
                        <ArrowRight className="mr-2 h-3 w-3 rotate-180" /> Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="flex flex-col gap-[6px] text-center mb-6">
                    <h1 className="text-2xl sm:text-[30px] font-bold text-[#0F172B] m-0 leading-tight tracking-[0.4px]">Welcome Back</h1>
                    <p className="text-sm sm:text-base font-normal text-[#62748E] m-0 leading-relaxed tracking-[-0.31px]">
                        Enter your credentials to access your <span className="bg-yellow-200 px-1 rounded-sm text-foreground font-medium">dashboard</span>
                    </p>
                </div>

                {/* Form Container */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error Message */}
                        {error && (
                            <div className="p-2.5 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="email" className="font-sans font-medium text-[14px] leading-[20px] tracking-[-0.15px] text-[#314158]">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="student@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-10 bg-white border-zinc-200 focus:border-blue-500 focus:ring-blue-500/20 text-sm"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="password" className="font-sans font-medium text-[14px] leading-[20px] tracking-[-0.15px] text-[#314158]">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-10 bg-white border-zinc-200 focus:border-blue-500 focus:ring-blue-500/20 pr-10 text-sm"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:bg-transparent"
                                    >
                                        <Lock size={14} />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-10 text-sm bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>

                        <div className="relative py-1">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-100" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleSignIn}
                            className="w-full h-10 gap-2 border-zinc-200 bg-white hover:bg-zinc-50 text-foreground font-medium text-sm"
                            disabled={loading}
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                            Google
                        </Button>
                    </form>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>

        </div>
    )
}
