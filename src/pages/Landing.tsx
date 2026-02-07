import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Search, Brain, Target, Sparkles, Shield, Check } from 'lucide-react'

export default function Landing() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6">
                <div className="max-w-6xl mx-auto py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Shield size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-gray-900">AI Counsellor</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[100px] opacity-50" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100 rounded-full blur-[100px] opacity-50" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                                <Sparkles size={14} /> AI-Powered Guidance
                            </span>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Land your dream
                                <br />
                                <span className="text-gray-400">university spot</span>
                            </h1>

                            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                                Global universities that match your profile. Get real-time
                                recommendations and be the first one to apply with AI guidance.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white text-lg font-medium rounded-xl hover:bg-gray-800 transition-colors"
                                >
                                    Get Started <ArrowRight size={20} />
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 text-lg font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    I have an account
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-6 sm:gap-12 pt-8 border-t border-gray-200">
                                <div>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">500+</p>
                                    <p className="text-sm text-gray-500">Universities</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">50+</p>
                                    <p className="text-sm text-gray-500">Countries</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">AI</p>
                                    <p className="text-sm text-gray-500">Powered</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Floating Cards */}
                        <div className="hidden lg:flex gap-6 justify-center relative">
                            <div className="absolute w-[500px] h-[400px] bg-indigo-200 blur-[80px] -z-10 rounded-full opacity-30" />

                            <div className="w-72 p-5 bg-white rounded-2xl border border-gray-200 shadow-xl transform hover:scale-105 transition-transform">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                                        MIT
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-lg">
                                        TARGET
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">MIT</h4>
                                <p className="text-sm text-gray-500 mb-4">Massachusetts, USA</p>
                                <div className="flex justify-between text-sm text-gray-400 pt-4 border-t border-gray-100">
                                    <span>Ranking: #1</span>
                                    <span>$58,240/yr</span>
                                </div>
                            </div>

                            <div className="w-72 p-5 bg-white rounded-2xl border border-gray-200 shadow-xl transform translate-y-12 hover:scale-105 transition-transform">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-rose-800 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                                        Stanford
                                    </div>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-medium rounded-lg">
                                        DREAM
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">Stanford University</h4>
                                <p className="text-sm text-gray-500 mb-4">California, USA</p>
                                <div className="flex justify-between text-sm text-gray-400 pt-4 border-t border-gray-100">
                                    <span>Ranking: #3</span>
                                    <span>$56,169/yr</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16 text-center">
                        <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                            How it Works
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                            Your Journey to Success
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Four simple steps to find your perfect university match
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                className="relative p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors group"
                            >
                                <span className="absolute top-6 right-6 text-4xl font-bold text-gray-200">
                                    {feature.number}
                                </span>
                                <div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors">
                                    <feature.icon size={24} className="text-gray-600 group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-2">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 px-6 bg-gray-50 border-t border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                            Pricing
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                            Invest in your Future
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Choose the plan that fits your goals. Start for free, upgrade for power.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Explorer</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">$0</span>
                                <span className="text-gray-500">/forever</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-600 text-sm">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" /> 5 AI Chats / day
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 text-sm">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Basic Search
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 text-sm">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" /> 1 Shortlist
                                </li>
                            </ul>
                            <Link to="/signup" className="block w-full py-3 text-center bg-gray-100 text-gray-900 font-medium rounded-xl hover:bg-gray-200 transition-colors">
                                Get Started Free
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl relative transform md:-translate-y-4">
                            <div className="absolute top-0 center-0 transform -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Most Popular
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Pro Student</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">$19</span>
                                <span className="text-gray-400">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300 text-sm">
                                    <Check className="w-5 h-5 text-indigo-400 shrink-0" /> Unlimited AI Chats
                                </li>
                                <li className="flex items-center gap-3 text-gray-300 text-sm">
                                    <Check className="w-5 h-5 text-indigo-400 shrink-0" /> SOP Analysis
                                </li>
                                <li className="flex items-center gap-3 text-gray-300 text-sm">
                                    <Check className="w-5 h-5 text-indigo-400 shrink-0" /> Voice Mode
                                </li>
                                <li className="flex items-center gap-3 text-gray-300 text-sm">
                                    <Check className="w-5 h-5 text-indigo-400 shrink-0" /> Unlimited Shortlists
                                </li>
                            </ul>
                            <Link to="/signup" className="block w-full py-3 text-center bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/25">
                                Start Free Trial
                            </Link>
                        </div>

                        {/* Premium Tier */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Guidance</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">$199</span>
                                <span className="text-gray-500">/one-time</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-600 text-sm">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Everything in Pro
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 text-sm">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Human Planner Call
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 text-sm">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Visa Mock Interview
                                </li>
                            </ul>
                            <Link to="/pricing" className="block w-full py-3 text-center border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                                View Details
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Link to="/pricing" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center justify-center gap-2">
                            See full pricing comparison <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-[100px]" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Start?
                    </h2>
                    <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                        Join thousands of students who found their dream university with AI Counsellor
                    </p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 text-lg font-medium rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        Create Free Account <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 px-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Shield size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-gray-900">AI Counsellor</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        © 2026 AI Counsellor. Built by Jayed Akhtar.
                    </p>
                </div>
            </footer>
        </div>
    )
}
