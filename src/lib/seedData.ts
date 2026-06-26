export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  subServices: string[];
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Development' | 'Design' | 'Marketing';
  photoUrl: string;
  bio: string;
  socials: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  order: number;
  isLeader?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: 'E-commerce' | 'Marketing' | 'Design';
  imageUrl: string;
  description: string;
  client: string;
  results: string;
  liveLink: string;
  order: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  photoUrl: string;
  message: string;
  rating: number;
  order: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
}

export interface SiteSettings {
  title: string;
  logoUrl: string;
  logoStyle: 'text' | 'circuit' | 'sphere' | 'triangle';
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
  };
  seoDescription: string;
  seoKeywords: string[];
  themeAccent: string;
}

export const defaultServices: Service[] = [
  {
    id: "serv-1",
    title: "E-commerce Development",
    description: "High-converting, lightning-fast digital storefronts built with modern technologies. We create custom solutions that turn visitors into loyal customers.",
    icon: "ShoppingBag",
    subServices: ["Shopify & WooCommerce Customization", "Headless Commerce Architectures", "Secure Payment Integrations", "Speed & Performance Optimization", "Inventory & ERP Integrations"],
    order: 1
  },
  {
    id: "serv-2",
    title: "Digital Marketing",
    description: "Data-driven strategies that scale your visibility, traffic, and revenue. We target the right audience with measurable marketing campaigns.",
    icon: "TrendingUp",
    subServices: ["Search Engine Optimization (SEO)", "Pay-Per-Click Advertising (PPC)", "Social Media Strategy & Content", "Conversion Rate Optimization (CRO)", "Email Marketing Automation"],
    order: 2
  },
  {
    id: "serv-3",
    title: "Graphic Design & Branding",
    description: "Stunning visual identities and user interfaces that communicate your brand values. We shape memorable experiences that make you stand out.",
    icon: "Palette",
    subServices: ["Brand Identity & Logo Design", "UI/UX App & Web Design", "Marketing Collateral & Pitch Decks", "Custom Illustrations & Icons", "Design Systems Creation"],
    order: 3
  }
];

export const defaultTeam: TeamMember[] = [
  {
    id: "team-1",
    name: "Alex Rivera",
    role: "Founder & Tech Lead",
    department: "Development",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    bio: "Alex has over 10 years of experience building scalable architectures. He leads our dev team and ensures all e-commerce applications are optimized for speed.",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" },
    order: 1,
    isLeader: true
  },
  {
    id: "team-2",
    name: "Sarah Chen",
    role: "Creative Director",
    department: "Design",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    bio: "Sarah is passionate about visual storytelling and clean typography. She establishes the artistic direction for all design outputs at the agency.",
    socials: { linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
    order: 2
  },
  {
    id: "team-3",
    name: "Marcus Vance",
    role: "Head of Marketing",
    department: "Marketing",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    bio: "Marcus utilizes data-driven growth strategies to help B2B and DTC brands reach their scaling potential. Specialist in SEO and paid media optimization.",
    socials: { linkedin: "https://linkedin.com" },
    order: 3
  },
  {
    id: "team-4",
    name: "Emily Watson",
    role: "Senior UI/UX Designer",
    department: "Design",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    bio: "Emily designs intuitive experiences centered on user behavior. She translates complex project specifications into beautiful, functional interfaces.",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com", instagram: "https://instagram.com" },
    order: 4
  }
];

export const defaultPortfolio: Project[] = [
  {
    id: "proj-1",
    title: "SwiftCart E-commerce Redesign",
    category: "E-commerce",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    description: "A complete overhaul of a luxury fashion retail shop, migrating to a headless Shopify storefront with custom design, instant search, and speed optimizations.",
    client: "SwiftCart Apparel",
    results: "+140% Sales, 1.2s Load Time",
    liveLink: "https://example.com/swiftcart",
    order: 1
  },
  {
    id: "proj-2",
    title: "SaaS SEO & PPC Acceleration",
    category: "Marketing",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600",
    description: "Implemented a content cluster SEO strategy alongside hyper-targeted Google & LinkedIn ads to scale recurring signups for a project management tool.",
    client: "CollabSync Co.",
    results: "+310% Traffic, -45% Customer Acquisition Cost",
    liveLink: "https://example.com/collabsync",
    order: 2
  },
  {
    id: "proj-3",
    title: "Apex Identity & Design System",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&q=80&w=600",
    description: "Crafted a comprehensive, modern brand identity package, including logo system, typography scales, style guidelines, and a unified React UI library.",
    client: "Apex Enterprises",
    results: "Brand Consistency across 4 platforms",
    liveLink: "https://example.com/apex-design",
    order: 3
  },
  {
    id: "proj-4",
    title: "Velo Fitness Tracker App UI",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&q=80&w=600",
    description: "Designed a clean, dark-mode focused interface for a smart watch companion application. Emphasized accessibility and smooth swipe navigations.",
    client: "Velo Technologies",
    results: "4.9 App Store Rating",
    liveLink: "https://example.com/velo",
    order: 4
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: "test-1",
    clientName: "Sophia Martinez",
    company: "CEO, SwiftCart Apparel",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    message: "The team completely turned our online sales around. The headless shop load times are instant, and our mobile conversion rate doubled in 2 months.",
    rating: 5,
    order: 1
  },
  {
    id: "test-2",
    clientName: "David Kim",
    company: "Marketing VP, Apex Enterprises",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    message: "Stunning brand identity that immediately elevated our presence. They didn't just deliver mockups; they gave us a complete system our team uses daily.",
    rating: 5,
    order: 2
  },
  {
    id: "test-3",
    clientName: "Liam O'Connor",
    company: "Growth Lead, Velo Technologies",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    message: "Their development speed and code quality are unmatched. They translated complex wearable datasets into an incredibly clean visual application.",
    rating: 5,
    order: 3
  }
];

export const defaultSettings: SiteSettings = {
  title: "Nexoloom Digital",
  logoUrl: "",
  logoStyle: "circuit",
  contactEmail: "hello@nexoloom.com",
  contactPhone: "+1 (555) 321-7654",
  address: "404 Creative Blvd, Suite 101, San Francisco, CA 94107",
  socialLinks: {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    twitter: "https://twitter.com"
  },
  seoDescription: "Nexoloom Digital is a premier digital agency delivering custom e-commerce solutions, performance-driven digital marketing campaigns, and high-end graphic design services.",
  seoKeywords: ["digital agency", "e-commerce development", "seo marketing", "brand identity design", "next.js web development", "nexoloom"],
  themeAccent: "violet"
};
