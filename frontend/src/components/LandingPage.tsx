import { motion } from "framer-motion";
import {
  Github,
  Slack,
  Mail,
  Zap,
  GitBranch,
  Bell,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";
import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const features = [
    {
      icon: <Slack className="w-8 h-8" />,
      title: "Multi-Channel Delivery",
      description:
        "Send notifications to Slack, Email, Discord, and Teams — all from one platform.",
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "Instant Build Alerts",
      description:
        "Get real-time updates on deployments, CI/CD pipelines, and repository activity.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Custom Triggers",
      description:
        "Set intelligent rules for when and how you want to be notified.",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Filtering",
      description:
        "Reduce noise with AI-powered filtering that only shows what matters.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign in with GitHub",
      description: "Connect your GitHub account in seconds",
    },
    {
      number: "02",
      title: "Connect Your Channels",
      description: "Link Slack, Email, or other communication tools",
    },
    {
      number: "03",
      title: "Get Real-Time Updates",
      description: "Receive instant notifications for builds and deployments",
    },
  ];

  const handleGitHubSignIn = async () => {
    try {
      const {
        data: { url: getRedirectUrl },
      } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/authorize?provider=github`
      );
      if (!getRedirectUrl) {
        console.error("No redirect URL received from the backend");
        return;
      }
      window.location.href = getRedirectUrl;
    } catch (error) {
      console.error("Error fetching redirect URI:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />

      {/* Navigation */}
      <motion.nav
        className="relative z-50 px-6 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-button-gradient rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">NotifyPro</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </a>
            <a
              href="#preview"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Preview
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="relative z-10 px-6 py-20 hero-bg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div variants={itemVariants} className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-hero-gradient bg-clip-text text-transparent animate-gradient">
                    Never Miss a Build,
                  </span>
                  <br />
                  <span className="text-foreground">
                    Deployment, or Alert Again
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-lg">
                  Instant notifications to your Slack, Email, and beyond — stay
                  in sync without the noise.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={handleGitHubSignIn}
                  className="btn-hero group relative z-10"
                >
                  <Github className="w-5 h-5 mr-2" />
                  Sign in with GitHub
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="btn-secondary">Learn More</button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-electric-blue" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-electric-blue" />
                  <span>5-second setup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-electric-blue" />
                  <span>No credit card</span>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="relative">
              <div className="glass-card p-8 animate-float">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Slack className="w-6 h-6 text-electric-blue" />
                      <span className="font-semibold">#general</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      just now
                    </span>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-electric-blue">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-500">
                        Build Successful
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>my-awesome-app</strong> deployed to production
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Commit: feat: add new notification system
                    </p>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-neon-purple">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className="w-4 h-4 text-neon-purple" />
                      <span className="font-semibold">Email Sent</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Notification sent to 3 team members
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="relative z-10 px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-hero-gradient bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay informed about your development
              workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="glass-card p-6 glow hover:scale-105 transition-all duration-300 group"
              >
                <div className="text-electric-blue mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        className="relative z-10 px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              How It{" "}
              <span className="bg-hero-gradient bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in less than 5 minutes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="text-center relative"
              >
                <div className="glass-card p-8 glow">
                  <div className="w-16 h-16 bg-button-gradient rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 animate-pulse-glow">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-electric-blue to-neon-purple" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Preview Section */}
      <motion.section
        id="preview"
        className="relative z-10 px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              See It In{" "}
              <span className="bg-hero-gradient bg-clip-text text-transparent">
                Action
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect your GitHub repositories to Slack channels with our
              intuitive dashboard
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card p-8 max-w-4xl mx-auto"
          >
            <div className="bg-secondary/30 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Project Configuration</h3>
                <div className="flex items-center space-x-2 text-sm text-green-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>Connected</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Github className="w-5 h-5 text-foreground" />
                    <span className="text-sm">
                      github.com/user/awesome-project
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last build: 2 minutes ago • ✅ Success
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Slack className="w-5 h-5 text-electric-blue" />
                    <span className="text-sm">#deployment-alerts</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    3 team members • Notifications enabled
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleGitHubSignIn}
              className="btn-hero w-full md:w-auto"
            >
              <Github className="w-5 h-5 mr-2" />
              Start Building Now
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="relative z-10 px-6 py-12 border-t border-white/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-button-gradient rounded-md flex items-center justify-center">
                <Bell className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold">NotifyPro</span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 NotifyPro. Built for the Vercel Hackathon.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
