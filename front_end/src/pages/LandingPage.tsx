
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { PricingPlan } from "@/types";

const LandingPage = () => {
  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: 0,
      description: "For individuals just getting started",
      features: [
        "3 clients maximum",
        "5 reports per client",
        "Basic dashboard access",
        "Email support"
      ],
      clientLimit: 3,
      reportLimit: 5
    },
    {
      name: "Professional",
      price: 29,
      description: "For growing businesses",
      features: [
        "10 clients maximum",
        "15 reports per client",
        "Advanced analytics",
        "Premium dashboard templates",
        "Priority email support",
        "Team collaboration tools"
      ],
      clientLimit: 10,
      reportLimit: 15,
      highlighted: true
    },
    {
      name: "Enterprise",
      price: 99,
      description: "For large organizations",
      features: [
        "Unlimited clients",
        "Unlimited reports",
        "Custom dashboard development",
        "Dedicated account manager",
        "24/7 phone support",
        "Advanced security features",
        "Custom API access"
      ],
      clientLimit: 30,
      reportLimit: 100
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-powerbi-blue rounded-md p-1">
              <span className="text-white font-bold text-lg">PBI</span>
            </div>
            <span className="font-bold text-xl text-powerbi-blue">Nexus Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Simplify Power BI Deployment for Your Clients
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Power BI Nexus Hub helps you manage, distribute, and monitor Power BI dashboards
              for your clients all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="px-8">Get Started</Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Power BI Nexus Hub?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 5v14"/>
                    <path d="M18 13l-6 6"/>
                    <path d="M6 13l6 6"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Distribution</h3>
                <p className="text-gray-600">Share Power BI dashboards with clients in just a few clicks</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                    <path d="M13 5v2"/>
                    <path d="M13 17v2"/>
                    <path d="M13 11v2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Centralized Management</h3>
                <p className="text-gray-600">Manage all your clients and reports from a single dashboard</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
                <p className="text-gray-600">Control who can access your Power BI dashboards with role-based permissions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Pricing Plans</h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include our core features.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan) => (
                <Card key={plan.name} className={`flex flex-col ${plan.highlighted ? 'border-primary shadow-lg' : ''}`}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-gray-500 ml-2">/month</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/register" className="w-full">
                      <Button 
                        className="w-full" 
                        variant={plan.highlighted ? "default" : "outline"}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white rounded-md p-1">
                  <span className="text-powerbi-blue font-bold text-lg">PBI</span>
                </div>
                <span className="font-bold text-xl">Nexus Hub</span>
              </div>
              <p className="text-gray-400">
                Simplifying Power BI management and distribution for businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Testimonials</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Power BI Nexus Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
