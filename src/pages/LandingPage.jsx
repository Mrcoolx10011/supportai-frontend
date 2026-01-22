import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    MessageSquare,
    Bot,
    BarChart3,
    Zap,
    Globe,
    CheckCircle,
    ArrowRight,
    Menu,
    X,
    Sparkles,
    Mail,
    MessageCircle,
    Search
} from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 text-slate-600">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-3">
                            <img src="/image/TrustDesk-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-bold text-slate-900 tracking-tight">
                                TrustDesk
                            </span>
                        </div>

                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                <a href="#features" className="hover:text-blue-600 text-slate-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">Features</a>
                                <a href="#how-it-works" className="hover:text-blue-600 text-slate-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">How it Works</a>
                                <a href="#pricing" className="hover:text-blue-600 text-slate-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                                <Link to="/login">
                                    <Button variant="ghost" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 mr-2 font-medium">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-blue-600 p-2">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-4 shadow-lg">
                        <a href="#features" className="block text-slate-600 hover:text-blue-600 py-2 font-medium">Features</a>
                        <a href="#how-it-works" className="block text-slate-600 hover:text-blue-600 py-2 font-medium">How it Works</a>
                        <Link to="/login" className="block w-full text-center py-3 bg-slate-50 rounded-lg text-slate-900 mb-2 font-medium">Sign In</Link>
                        <Link to="/register" className="block w-full text-center py-3 bg-blue-600 rounded-lg text-white font-medium">Get Started</Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="relative pt-24 pb-16 lg:pt-40 lg:pb-32 overflow-hidden bg-white">
                {/* Subtle Background Mesh */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-50/50 via-purple-50/30 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 border border-blue-100">
                            <Sparkles size={14} className="text-blue-600" />
                            <span>New: AI Voice Integration is here</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]">
                            Customer Support, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Reimagined.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto font-normal">
                            TrustDesk leverages advanced AI to automate 70% of your support tickets while keeping the human touch. Dependable, fast, and enterprise-ready.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/register">
                                <Button className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-200 transition-all rounded-full font-semibold">
                                    Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/demo">
                                <Button variant="outline" className="h-14 px-8 text-lg border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-full bg-white font-medium">
                                    View Live Demo
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Hero Dashboard Preview */}
                    <motion.div
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-20 relative mx-auto max-w-6xl"
                    >
                        {/* The Floating Browser Window */}
                        <div className="rounded-xl bg-white p-1 shadow-2xl ring-1 ring-slate-900/5 backdrop-blur-3xl transform transition-transform hover:scale-[1.01] duration-500">
                            <div className="rounded-lg overflow-hidden bg-slate-50 border border-slate-200/50">
                                <img src="/image/trustdesk_light_dashboard.png" alt="TrustDesk Dashboard Interface" className="w-full h-auto" />
                            </div>
                        </div>

                        {/* Floating Context Cards */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute -right-12 top-24 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 hidden lg:block max-w-[280px]"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Ticket Resolved</div>
                                    <p className="text-xs text-slate-500 mt-1">"The AI response was perfectly accurate. Thanks!"</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            className="absolute -left-12 bottom-32 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 hidden lg:block text-left"
                        >
                            <div className="flex gap-4 items-center">
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-slate-900 tracking-tight">2.4m</div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg Response Time</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Features Grid (Bento Style) */}
            <section id="features" className="py-20 md:py-32 bg-slate-50/50 relative border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Powerful Features for Modern Teams</h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-normal">Everything you need to manage customer relationships without the chaos.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Bot className="w-6 h-6 text-blue-600" />,
                                title: "AI Autopilot",
                                desc: "Let AI handle repetitive queries while your team focuses on high-value conversations.",
                                visual: (
                                    <div className="mt-6 bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600"><Sparkles size={16} /></div>
                                        <div className="h-2 w-24 bg-white rounded-full"></div>
                                    </div>
                                )
                            },
                            {
                                icon: <MessageSquare className="w-6 h-6 text-violet-600" />,
                                title: "Unified Inbox",
                                desc: "Email, chat, social media - all in one dependable dashboard.",
                                visual: (
                                    <div className="mt-6 flex justify-around items-center px-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><MessageCircle size={20} /></div>
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><MessageSquare size={20} /></div>
                                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600"><Mail size={20} /></div>
                                    </div>
                                )
                            },
                            {
                                icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
                                title: "Deep Analytics",
                                desc: "Gain actionable insights into your team's performance and customer satisfaction.",
                                visual: (
                                    <div className="mt-6 flex items-end justify-center gap-2 h-12">
                                        <div className="w-3 bg-indigo-200 rounded-t-sm h-[60%]"></div>
                                        <div className="w-3 bg-indigo-300 rounded-t-sm h-[40%]"></div>
                                        <div className="w-3 bg-indigo-500 rounded-t-sm h-[80%]"></div>
                                        <div className="w-3 bg-indigo-400 rounded-t-sm h-[50%]"></div>
                                    </div>
                                )
                            },
                            {
                                icon: <ShieldCheck className="w-6 h-6 text-slate-700" />,
                                title: "Enterprise Security",
                                desc: "SOC2 Type II certified. Your customer data is safe with TrustDesk.",
                                visual: null
                            },
                            {
                                icon: <Globe className="w-6 h-6 text-blue-500" />,
                                title: "Multilingual",
                                desc: "Automatically translate tickets and responses in over 40 languages.",
                                visual: null
                            },
                            {
                                icon: <Zap className="w-6 h-6 text-amber-500" />,
                                title: "Instant Setup",
                                desc: "Get up and running in minutes. No complex configuration required.",
                                visual: null
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -8 }}
                                className={`bg-white border text-center md:text-left ${feature.visual ? 'row-span-2' : ''} border-slate-200 p-8 rounded-2xl hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all duration-300 group`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="mb-6 w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-base">{feature.desc}</p>
                                {feature.visual && feature.visual}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Track Ticket Section */}
            <section className="py-16 md:py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
                                <Search className="w-4 h-4" />
                                <span>Self-Service Portal</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Track Your Support Ticket Instantly</h2>
                            <p className="text-xl text-slate-500 mb-8 leading-relaxed">
                                Enter your ticket ID and email to check the status of your support request.
                                Our transparent tracking system provides detailed updates on your issue's progress,
                                so you're never left wondering.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Link to="/track-ticket">
                                    <Button className="h-12 px-8 bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-lg flex items-center gap-2">
                                        Check Ticket Status <ArrowRight size={16} />
                                    </Button>
                                </Link>
                                <span className="text-slate-600 font-medium">
                                    Knowledge Base
                                </span>
                            </div>

                            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">AI</div>
                                    <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-green-600">JD</div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs">+</div>
                                </div>
                                <p>Join 10,000+ users tracking requests daily</p>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-[2rem] opacity-50 blur-2xl group-hover:opacity-75 transition-opacity duration-500"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
                                <img
                                    src="/image/track you support ticket.png"
                                    alt="Track Support Ticket Interface"
                                    className="w-full h-auto transform transition-transform duration-500 hover:scale-[1.02]"
                                />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Status: Resolved</div>
                                    <div className="text-xs text-slate-500">Updated 2m ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-10">Trusted by over 1,000 forward-thinking companies</p>
                    <div className="flex flex-wrap justify-center gap-16 opacity-60 grayscale hover:grayscale-0 transition-grayscale duration-500">
                        <h3 className="text-2xl font-bold text-slate-400">ACME Corp</h3>
                        <h3 className="text-2xl font-bold text-slate-400">GlobalTech</h3>
                        <h3 className="text-2xl font-bold text-slate-400">Nebula</h3>
                        <h3 className="text-2xl font-bold text-slate-400">Vertex</h3>
                        <h3 className="text-2xl font-bold text-slate-400">Horizon</h3>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div>
                            <div className="text-5xl font-bold text-white mb-2">99.9%</div>
                            <div className="text-slate-400 font-medium">Uptime SLA</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-white mb-2">24/7</div>
                            <div className="text-slate-400 font-medium">Expert Support</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-white mb-2">2x</div>
                            <div className="text-slate-400 font-medium">Faster Resolution</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-white mb-2">10k+</div>
                            <div className="text-slate-400 font-medium">Active Agents</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"></div>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to build trust?</h2>
                        <p className="text-indigo-100 text-xl max-w-2xl mx-auto mb-10 relative z-10 font-normal">
                            Join thousands of support teams delivering exceptional experiences with TrustDesk.
                        </p>
                        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button className="h-14 px-10 text-lg bg-white text-blue-600 hover:bg-slate-50 border-0 rounded-full font-bold shadow-lg">
                                    Start Your Free Trial
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" className="h-14 px-10 text-lg border-white/30 text-white hover:bg-white/10 rounded-full bg-transparent font-medium">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <img src="/image/TrustDesk-logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                                <span className="text-lg font-bold text-slate-900">TrustDesk</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Dependable customer care solutions for the modern enterprise. Built with privacy and performance in mind.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-slate-900 font-bold mb-6">Product</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Enterprise</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-slate-900 font-bold mb-6">Resources</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">API Reference</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-slate-900 font-bold mb-6">Company</h4>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Legal</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
                        <p>&copy; 2026 TrustDesk Inc. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-slate-900">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-900">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
