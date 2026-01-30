import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, GraduationCap, Search, Brain, Target, Sparkles } from 'lucide-react'

export default function Landing() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="min-h-screen flex items-center pt-20 bg-gradient-dark relative overflow-hidden">
                {/* Background gradient orbs - Subtle Remoter style */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />

                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-20 w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
                    {/* Left Content */}
                    <div className="space-y-8 lg:space-y-10">
                        <Badge variant="secondary" className="animate-pulse-ring border-white/20">
                            <Sparkles size={14} className="mr-2 text-accent" /> AI-POWERED GUIDANCE
                        </Badge>

                        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold leading-tight tracking-tighter">
                            Land your dream
                            <br />
                            <span className="text-muted-foreground/60">university spot</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground/80 max-w-lg leading-relaxed">
                            Global universities that match your profile. Get real-time
                            recommendations and be the first one to apply with AI guidance.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                            <Button variant="sharp" size="xl" asChild className="h-14 sm:h-16 px-8 sm:px-10 text-lg w-full sm:w-auto">
                                <Link to="/signup">
                                    Get Started <ArrowRight size={20} />
                                </Link>
                            </Button>
                            <Button variant="sharp-outline" size="xl" asChild className="h-14 sm:h-16 px-8 sm:px-10 text-lg w-full sm:w-auto">
                                <Link to="/login">I have an account</Link>
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-8 sm:gap-16 pt-10 border-t border-white/10">
                            <div>
                                <p className="text-3xl sm:text-4xl font-extrabold">500+</p>
                                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1">
                                    Universities
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl sm:text-4xl font-extrabold">50+</p>
                                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1">
                                    Countries
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl sm:text-4xl font-extrabold">AI</p>
                                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1">
                                    Powered
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right - Floating Cards */}
                    <div className="hidden lg:flex gap-6 justify-center relative">
                        {/* Abstract decoration */}
                        <div className="absolute w-[600px] h-[400px] bg-accent/10 blur-[80px] -z-10 rounded-full" />

                        <Card className="w-80 p-6 animate-float bg-[#0A0A0A] border-white/10 backdrop-blur-xl shadow-2xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                                    MIT
                                </div>
                                <Badge variant="success" className="px-3">TARGET</Badge>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-1">MIT</h4>
                            <p className="text-sm font-mono text-muted-foreground mb-6">
                                Massachusetts, USA
                            </p>
                            <div className="flex justify-between text-sm text-neutral-400 font-mono pt-4 border-t border-white/5">
                                <span>RANKING: #1</span>
                                <span>$58,240/YR</span>
                            </div>
                        </Card>

                        <Card className="w-80 p-6 animate-float bg-[#0A0A0A] border-white/10 backdrop-blur-xl shadow-2xl" style={{ animationDelay: '-3s', transform: 'translateY(60px)' }}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-rose-800 flex items-center justify-center text-white font-bold text-xs">
                                    Stanford
                                </div>
                                <Badge variant="warning" className="bg-yellow-500 text-black px-3">REACH</Badge>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-1">Stanford University</h4>
                            <p className="text-sm font-mono text-muted-foreground mb-6">
                                California, USA
                            </p>
                            <div className="flex justify-between text-sm text-neutral-400 font-mono pt-4 border-t border-white/5">
                                <span>RANKING: #3</span>
                                <span>$56,169/YR</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-32 bg-black border-t border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="mb-20">
                        <p className="text-sm font-mono uppercase tracking-widest text-accent mb-4">
                            How it Works
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                            Your Journey to Success
                        </h2>
                        <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                            Four simple steps to find your perfect university match
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: GraduationCap,
                                number: '01',
                                title: 'Build Your Profile',
                                description: 'Tell us about your academic background, test scores, budget, and preferences',
                            },
                            {
                                icon: Search,
                                number: '02',
                                title: 'Discover Universities',
                                description: 'Browse and filter universities that match your profile and aspirations',
                            },
                            {
                                icon: Target,
                                number: '03',
                                title: 'Shortlist & Compare',
                                description: 'Save your favorites and categorize them as Reach, Target, or Safety',
                            },
                            {
                                icon: Brain,
                                number: '04',
                                title: 'Get AI Guidance',
                                description: 'Chat with our AI counselor for personalized recommendations and advice',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="relative p-8 border border-white/10 bg-[#0A0A0A] hover:border-accent/50 transition-colors group h-full"
                            >
                                <span className="absolute top-8 right-8 text-4xl font-bold text-white/5 font-mono">
                                    {feature.number}
                                </span>
                                <div className="w-16 h-16 bg-neutral-900 border border-white/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <feature.icon size={28} className="text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-4">
                                    {feature.title}
                                </h4>
                                <p className="text-neutral-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-40 bg-black relative border-t border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-accent/5 blur-[150px] opacity-30" />

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-8 tracking-tighter">
                        Ready to Start?
                    </h2>
                    <p className="text-xl text-neutral-400 mb-12 max-w-xl mx-auto leading-relaxed">
                        Join thousands of students who found their dream university with AI Counsellor
                    </p>
                    <Button variant="sharp" size="xl" asChild className="h-14 sm:h-16 px-8 sm:px-12 text-lg w-full sm:w-auto">
                        <Link to="/signup">
                            Create Free Account <ArrowRight size={20} />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-black">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <GraduationCap size={24} className="text-white" />
                        <span className="font-bold text-lg tracking-tight">AI Counsellor</span>
                    </div>
                    <p className="text-sm font-mono text-neutral-500">
                        © 2026 AI Counsellor. Built by Jayed Akhtar.
                    </p>
                </div>
            </footer>
        </div>
    )
}
