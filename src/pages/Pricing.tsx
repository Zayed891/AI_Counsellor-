import { Link } from 'react-router-dom'
import { Check, Shield, Zap, Sparkles, HelpCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'

export default function Pricing() {
    const tiers = [
        {
            name: 'Explorer',
            price: '$0',
            description: 'Perfect for getting started with your university search.',
            features: [
                '5 AI Counselor chats per day',
                'Discover universities worldwide',
                'Basic profile analysis',
                'Create 1 shortlist (up to 5 unis)',
            ],
            cta: 'Get Started Free',
            ctaLink: '/signup',
            highlighted: false,
        },
        {
            name: 'Pro Student',
            price: '$19',
            period: '/month',
            description: 'Everything you need to land your dream admit.',
            features: [
                'Unlimited AI Counselor chats',
                'Advanced Admission Probability scores',
                'SOP & Essay Analyze Tool',
                'Unlimited shortlists',
                'Priority Tasks & Deadline tracking',
                'Voice Mode enabled',
            ],
            cta: 'Start 7-Day Free Trial',
            ctaLink: '/signup',
            highlighted: true,
        },
        {
            name: 'Premium Guidance',
            price: '$199',
            period: ' one-time',
            description: 'Human expertise combined with AI power.',
            features: [
                'Everything in Pro Student',
                '2x 1-on-1 calls with Human Counselors',
                'Manual application review',
                'Visa interview mock session',
                'Dedicated success manager',
            ],
            cta: 'Book Consultation',
            ctaLink: '/signup',
            highlighted: false,
        },
    ]

    const faqs = [
        {
            q: 'Is the Free plan really free?',
            a: 'Yes! You can search for universities, create a profile, and chat with our AI counselor up to 5 times a day forever.',
        },
        {
            q: 'Can I cancel my subscription?',
            a: 'Absolutely. You can cancel your monthly subscription at any time from your dashboard settings.',
        },
        {
            q: 'How accurate is the admission probability?',
            a: 'Our AI is trained on thousands of successful profiles and admission data points, but it is an estimate. We recommend targeting a mix of Safe, Target, and Reach schools.',
        },
        {
            q: 'Do you help with visas?',
            a: 'Yes, our Premium Guidance plan includes mock visa interviews and document verification by human experts.',
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar variant="light" />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 sm:px-10 lg:px-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white pointer-events-none" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                        <Sparkles size={16} />
                        <span>Invest in your future</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Simple pricing for <span className="text-indigo-600">limitless potential</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        Choose the plan that fits your journey. From exploring options to submitting that final application, we've got you covered.
                    </p>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="px-6 pb-24">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative rounded-2xl p-8 transition-all duration-300 ${tier.highlighted
                                    ? 'bg-gray-900 text-white shadow-2xl scale-105 border-0 ring-1 ring-white/10'
                                    : 'bg-white text-gray-900 shadow-xl border border-gray-100 hover:border-indigo-100 hover:shadow-2xl'
                                }`}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className={`text-xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>{tier.name}</h3>
                                <p className={`text-sm ${tier.highlighted ? 'text-gray-300' : 'text-gray-500'}`}>{tier.description}</p>
                            </div>

                            <div className="mb-8">
                                <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                                {tier.period && (
                                    <span className={`text-sm font-medium ${tier.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {tier.period}
                                    </span>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <Check
                                            className={`w-5 h-5 mt-0.5 shrink-0 ${tier.highlighted ? 'text-indigo-400' : 'text-indigo-600'
                                                }`}
                                        />
                                        <span className={`text-sm ${tier.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                asChild
                                className={`w-full h-12 rounded-xl text-base font-medium transition-all ${tier.highlighted
                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 shadow-lg'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
                                    }`}
                            >
                                <Link to={tier.ctaLink}>
                                    {tier.cta}
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white py-24 px-6 border-t border-gray-100">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-600">Everything you need to know about our plans and billing.</p>
                    </div>

                    <div className="space-y-8">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl p-6 md:p-8 hover:bg-gray-100 transition-colors">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start gap-3">
                                    <HelpCircle className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                                    {faq.q}
                                </h3>
                                <p className="text-gray-600 ml-8 leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-gray-600 mb-4">Still have questions?</p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
                        >
                            Contact our support team <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gray-900 py-16 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Start your journey today
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
                        Join thousands of students getting into their dream universities with AI guidance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white text-lg font-medium rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                        >
                            Get Started for Free
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
