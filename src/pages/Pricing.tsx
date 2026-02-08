import { Link } from 'react-router-dom'
import { Check, Sparkles, HelpCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'

export default function Pricing() {
    const tiers = [
        {
            name: 'Explorer',
            price: '$0',
            period: '/forever',
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
            period: '/one-time',
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
        <div className="min-h-screen bg-gray-50">
            <Navbar variant="light" />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-50 via-white to-purple-50" />
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[100px] opacity-50" />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-6">
                        <Sparkles size={14} /> Invest in your future
                    </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                        Simple pricing for
                        <br />
                        <span className="text-gray-400">limitless potential</span>
                    </h1>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Choose the plan that fits your journey. From exploring options to submitting that final application, we've got you covered.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                            Pricing
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                            Choose Your Plan
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`relative rounded-2xl p-8 transition-all duration-300 ${tier.highlighted
                                        ? 'bg-gray-900 shadow-xl transform md:-translate-y-4'
                                        : 'bg-white shadow-sm border border-gray-200 hover:shadow-lg'
                                    }`}
                            >
                                {tier.highlighted && (
                                    <div className="absolute top-0 center-0 transform -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Most Popular
                                    </div>
                                )}

                                <h3 className={`text-xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                                    {tier.name}
                                </h3>

                                <div className="mb-6">
                                    <span className={`text-4xl font-bold ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                                        {tier.price}
                                    </span>
                                    <span className={`text-sm ${tier.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {tier.period}
                                    </span>
                                </div>

                                <p className={`text-sm mb-8 ${tier.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {tier.description}
                                </p>

                                <ul className="space-y-4 mb-8">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <Check
                                                className={`w-5 h-5 shrink-0 ${tier.highlighted ? 'text-indigo-400' : 'text-indigo-600'}`}
                                            />
                                            <span className={`text-sm ${tier.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to={tier.ctaLink}
                                    className={`block w-full py-3 text-center font-medium rounded-xl transition-colors ${tier.highlighted
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    {tier.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6 bg-white border-t border-gray-200">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                            FAQs
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600">
                            Everything you need to know about our plans and billing.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start gap-3">
                                    <HelpCircle className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                                    {faq.q}
                                </h3>
                                <p className="text-sm text-gray-600 ml-8 leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-gray-600 mb-4">Still have questions?</p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800"
                        >
                            Contact our support team <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-20 px-6 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 to-purple-600/20 blur-[100px]" />

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
        </div>
    )
}
