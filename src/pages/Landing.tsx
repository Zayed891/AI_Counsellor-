import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Search, Brain, Target, Sparkles, Shield, Check, Clock, DollarSign, Users, Zap, MessageSquare, BarChart3, Star } from 'lucide-react'

export default function Landing() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-6">
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
            <section className="pt-24 pb-12 px-4 md:pt-32 md:pb-20 md:px-6 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-indigo-50 via-white to-purple-50" />
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
                                Get Into Your Dream
                                <br />
                                <span className="text-gray-400">University with AI</span>
                            </h1>

                            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                                24/7 AI-powered guidance for university admissions. Get personalized recommendations,
                                admission probability scores, and expert advice—all for a fraction of traditional counseling costs.
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
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">24/7</p>
                                    <p className="text-sm text-gray-500">AI Support</p>
                                </div>
                                <div>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">$19</p>
                                    <p className="text-sm text-gray-500">per month</p>
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200">
                                <Star size={16} className="fill-green-600" />
                                <span>Join our founding members - Early adopter pricing</span>
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
            <section className="py-12 px-4 md:py-20 md:px-6 bg-white">
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

            {/* Comparison Section - AI vs Traditional */}
            <section className="py-12 px-4 md:py-20 md:px-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                            Why AI Counsellor
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                            Better Than Traditional Counseling
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Get expert guidance at a fraction of the cost, available whenever you need it.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Traditional Counselor */}
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                                Traditional
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-2">Human Counselor</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <DollarSign className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">$3,000 - $10,000</p>
                                        <p className="text-xs text-gray-500">One-time fee</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Limited hours</p>
                                        <p className="text-xs text-gray-500">Wait 1-2 days for response</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Multiple students</p>
                                        <p className="text-xs text-gray-500">Divided attention</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <BarChart3 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Manual analysis</p>
                                        <p className="text-xs text-gray-500">Based on experience only</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Counsellor - Highlighted */}
                        <div className="bg-indigo-600 rounded-2xl p-8 shadow-xl relative transform md:-translate-y-4">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                BEST VALUE
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-6 mt-2">AI Counsellor</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <DollarSign className="w-5 h-5 text-indigo-200 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">$19/month</p>
                                        <p className="text-xs text-indigo-200">Cancel anytime</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-indigo-200 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">24/7 availability</p>
                                        <p className="text-xs text-indigo-200">Instant responses</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MessageSquare className="w-5 h-5 text-indigo-200 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Unlimited chats</p>
                                        <p className="text-xs text-indigo-200">100% focused on you</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <BarChart3 className="w-5 h-5 text-indigo-200 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">AI-powered insights</p>
                                        <p className="text-xs text-indigo-200">Data from 50K+ profiles</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-indigo-400">
                                <Link
                                    to="/signup"
                                    className="block w-full py-3 text-center bg-white text-indigo-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Start Free Trial
                                </Link>
                            </div>
                        </div>

                        {/* DIY */}
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                                DIY
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 mt-2">Do It Yourself</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <DollarSign className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Free</p>
                                        <p className="text-xs text-gray-500">But costs time</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">100+ hours</p>
                                        <p className="text-xs text-gray-500">Of research needed</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Search className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Scattered info</p>
                                        <p className="text-xs text-gray-500">Hard to find & verify</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <BarChart3 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">No insights</p>
                                        <p className="text-xs text-gray-500">Guesswork & uncertainty</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Showcase Section */}
            <section className="py-12 px-4 md:py-20 md:px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                            Powerful Features
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                            Everything You Need in One Place
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            From discovering universities to submitting applications, we've got every step covered.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Brain,
                                title: 'AI Chat Counselor',
                                description: 'Get instant answers to all your university and admission questions. Available 24/7, never wait.',
                                color: 'bg-indigo-100 text-indigo-600',
                            },
                            {
                                icon: BarChart3,
                                title: 'Admission Probability',
                                description: 'Know your chances with AI-powered probability scores based on thousands of successful applications.',
                                color: 'bg-purple-100 text-purple-600',
                            },
                            {
                                icon: MessageSquare,
                                title: 'SOP & Essay Analysis',
                                description: 'Get detailed feedback on your essays and statements. Improve your writing before submission.',
                                color: 'bg-blue-100 text-blue-600',
                            },
                            {
                                icon: Target,
                                title: 'Smart Shortlists',
                                description: 'Organize universities into Reach, Target, and Safety categories. Track deadlines effortlessly.',
                                color: 'bg-green-100 text-green-600',
                            },
                            {
                                icon: Search,
                                title: 'University Discovery',
                                description: 'Browse 500+ universities across 50 countries. Filter by budget, location, ranking, and more.',
                                color: 'bg-yellow-100 text-yellow-600',
                            },
                            {
                                icon: Zap,
                                title: 'Voice Mode',
                                description: 'Talk to your AI counselor naturally using voice. Perfect for on-the-go guidance.',
                                color: 'bg-pink-100 text-pink-600',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow"
                            >
                                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                                    <feature.icon size={24} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">
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
            <section className="py-12 px-4 md:py-20 md:px-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                            Pricing
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
                            Start free, upgrade when ready. Early adopters lock in $19/month forever.
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200">
                            <Star size={16} className="fill-green-600" />
                            <span>Limited time: Founding member pricing available</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Explorer</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">$0</span>
                                <span className="text-sm text-gray-500">/forever</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-8">
                                Perfect for getting started with your university search.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                    <span className="text-sm text-gray-600">5 AI Counselor chats per day</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                    <span className="text-sm text-gray-600">Discover universities worldwide</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                    <span className="text-sm text-gray-600">Basic profile analysis</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                    <span className="text-sm text-gray-600">Create 1 shortlist (up to 5 unis)</span>
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
                                <span className="text-sm text-gray-400">/month</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-8">
                                Everything you need to land your dream admit.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                                    <span className="text-sm text-gray-300">Unlimited AI Counselor chats</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                                    <span className="text-sm text-gray-300">Advanced Admission Probability scores</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                                    <span className="text-sm text-gray-300">SOP & Essay Analyze Tool</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                                    <span className="text-sm text-gray-300">Unlimited shortlists</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                                    <span className="text-sm text-gray-300">Voice Mode enabled</span>
                                </li>
                            </ul>
                            <Link to="/signup" className="block w-full py-3 text-center bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/25">
                                Start 7-Day Free Trial
                            </Link>
                        </div>

                        {/* Premium Tier */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Guidance</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">$199</span>
                                <span className="text-sm text-gray-500">/one-time</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-8">
                                Human expertise combined with AI power.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                    <span className="text-sm text-gray-600">Everything in Pro Student</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                    <span className="text-sm text-gray-600">2x 1-on-1 calls with Human Counselors</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                    <span className="text-sm text-gray-600">Manual application review</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                    <span className="text-sm text-gray-600">Visa interview mock session</span>
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

            {/* Founder Story Section */}
            <section className="py-12 px-4 md:py-20 md:px-6 bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                            Built by a Developer, For Students
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                            Why I Built AI Counsellor
                        </h2>
                    </div>

                    <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-indigo-100">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="shrink-0">
                                <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white">JA</span>
                                </div>
                            </div>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p className="text-lg">
                                    <span className="font-bold text-gray-900">Hi, I'm Jayed Akhtar</span>, a developer who built AI Counsellor
                                    after watching my friends struggle through the overwhelming and expensive university application process.
                                </p>
                                <p>
                                    I saw them stress over where to apply, pay thousands of dollars for counselors who barely had time for them,
                                    or spend countless hours researching alone with no clear direction. Many deserving students miss great
                                    opportunities simply because they can't afford proper guidance.
                                </p>
                                <p>
                                    <span className="font-semibold text-gray-900">As a developer, I knew I could build a better solution.</span> By
                                    combining AI technology with real admission data, I created a platform that gives every
                                    student access to quality counseling—24/7, affordable, and personalized.
                                </p>
                                <div className="pt-4 border-t border-indigo-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-indigo-600" />
                                        <span className="text-sm font-medium text-gray-900">Built with care in 2024</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-600" />
                                        <span className="text-sm font-medium text-gray-900">Personal support from me</span>
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <p className="text-sm text-gray-600 italic">
                                        "As a founding member, you'll get direct access to me as the developer. Your feedback will shape
                                        the future of AI Counsellor. Let's build something amazing together."
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 mt-2">— Jayed Akhtar, Founder & Developer</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">7-Day Money Back</h4>
                            <p className="text-sm text-gray-600">Not satisfied? Get a full refund, no questions asked.</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Early Adopter Perks</h4>
                            <p className="text-sm text-gray-600">Lock in $19/month pricing forever + priority support.</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Your Data is Safe</h4>
                            <p className="text-sm text-gray-600">Encrypted, secure, and never shared with anyone.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 px-4 md:py-20 md:px-6 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 to-purple-600/20 blur-[100px]" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-200 text-sm font-medium rounded-full mb-6 border border-indigo-400/30">
                        <Sparkles size={14} />
                        <span>Join 100+ founding members</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Start Your Journey Today
                    </h2>
                    <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                        Try AI Counsellor free for 7 days. No credit card required. Cancel anytime.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 text-lg font-medium rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
                        >
                            Start Free Trial <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/pricing"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white text-lg font-medium rounded-xl hover:bg-white/10 transition-colors border border-white/20"
                        >
                            View Pricing
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500 mt-6">
                        <Check className="inline w-4 h-4 mr-1" />
                        Free for 7 days •
                        <Check className="inline w-4 h-4 ml-3 mr-1" />
                        No credit card required •
                        <Check className="inline w-4 h-4 ml-3 mr-1" />
                        Cancel anytime
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 md:py-20 md:px-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between gap-12 mb-12 items-center md:items-start">
                        {/* Brand (Left) */}
                        <div className="max-w-xs text-center md:text-left">
                            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <Shield size={18} className="text-white" />
                                </div>
                                <span className="font-bold text-gray-900 text-lg">AI Counsellor</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                Your 24/7 AI-powered university admission counselor. Get personalized guidance and expert advice.
                            </p>
                        </div>

                        {/* Product Links (Middle) */}
                        <div className="text-center md:text-left">
                            <h4 className="font-bold text-gray-900 mb-4 text-lg">Product</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                        Pricing
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                        Sign Up
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                        Login
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company Links (Right) */}
                        <div className="text-center md:text-left">
                            <h4 className="font-bold text-gray-900 mb-4 text-lg">Company</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">
                            © 2026 AI Counsellor. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-gray-600">SSL Encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-gray-600">GDPR Compliant</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
