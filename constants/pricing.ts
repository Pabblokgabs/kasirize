export interface RequesterPricingItem {
  id: string;
  service: string;
  priceDisplay: string;
  priceCents: number;
  billingType: "one_off" | "per_task" | "monthly";
  description: string;
  badge?: string;
  features: string[];
}

export interface EmployerPlanItem {
  id: string;
  plan: string;
  priceDisplay: string;
  priceCents: number | null; // null for custom
  billingPeriod: string;
  includesSummary: string;
  popular?: boolean;
  activeJobPostsLimit: number | "unlimited";
  features: string[];
  ctaLabel: string;
}

export interface MentorPricingItem {
  id: string;
  service: string;
  priceDisplay: string;
  priceCents: number | null; // null for percentage fee
  feePercentage?: number;
  billingType: "free" | "monthly" | "commission";
  description: string;
  badge?: string;
  features: string[];
}

export const MENTOR_PRICING_TABLE: MentorPricingItem[] = [
  {
    id: "basic_profile",
    service: "Basic mentor profile",
    priceDisplay: "Free",
    priceCents: 0,
    billingType: "free",
    badge: "Forever Free",
    description: "Create your verified artisan or professional profile and coach youth without subscription costs.",
    features: [
      "Standard mentor profile & credential verification",
      "Direct mentee connections & chat messaging",
      "Issue confirmed platform skills badges to youth",
      "List pro-bono or free coaching sessions",
    ],
  },
  {
    id: "featured_listing",
    service: "Featured mentor listing",
    priceDisplay: "R149",
    priceCents: 14900,
    billingType: "monthly",
    badge: "Top Visibility",
    description: "Get highlighted at the top of the mentor directory and youth discovery feed across your province.",
    features: [
      "Priority top placement in mentor directory searches",
      "Verified Mentor gold crest badge on profile & session cards",
      "Highlight up to 5 artisan, technical, or business specialties",
      "Promoted to high-potential youth completing relevant local tasks",
    ],
  },
  {
    id: "paid_sessions",
    service: "Paid mentorship sessions",
    priceDisplay: "12% platform fee",
    priceCents: null,
    feePercentage: 12,
    billingType: "commission",
    description: "Host 1-on-1 private coaching sessions with safe escrow payments and instant payouts upon completion.",
    features: [
      "Charge custom hourly or session rates in South African Rand (ZAR)",
      "Automated calendar booking and appointment management",
      "In-app video/voice session integration or in-person check-in",
      "Only pay a 12% fee when you successfully conduct and complete a session",
    ],
  },
  {
    id: "paid_workshops",
    service: "Paid training or workshop",
    priceDisplay: "12% platform fee",
    priceCents: null,
    feePercentage: 12,
    billingType: "commission",
    description: "Organise hands-on masterclasses, group apprentice workshops, or accredited short skill courses.",
    features: [
      "Group mentee ticketing and booking capacity management",
      "Workshop location venue integration and safety briefings",
      "Bulk skill endorsement certificates issued automatically to attendees",
      "Transparent 12% platform fee deducted only on ticket sales",
    ],
  },
];

export const REQUESTER_PRICING_TABLE: RequesterPricingItem[] = [
  {
    id: "basic_posting",
    service: "Basic task posting",
    priceDisplay: "Free",
    priceCents: 0,
    billingType: "per_task",
    badge: "First Task Free",
    description: "Post your first short task on Kasirize with zero platform fees.",
    features: [
      "1 free initial task listing",
      "Local walking-distance youth reach",
      "Escrow protection & secure payout release",
      "Standard candidate applications",
    ],
  },
  {
    id: "additional_posting",
    service: "Additional task posting",
    priceDisplay: "R30",
    priceCents: 3000,
    billingType: "per_task",
    description: "Cost per additional short task after your first free task posting.",
    features: [
      "Per-task listing fee",
      "Direct neighbourhood applicant matching",
      "Built-in rating & skills endorsement tools",
      "Safe in-app messaging with youth applicants",
    ],
  },
  {
    id: "featured_task",
    service: "Featured task",
    priceDisplay: "R50",
    priceCents: 5000,
    billingType: "per_task",
    badge: "Fast Fill",
    description: "Boost your task to the top of nearby youth dashboards for urgent needs.",
    features: [
      "Highlighted badge & top placement on Task Hub",
      "Instant push notification to nearby qualified youth",
      "3x faster applicant responses",
      "Priority safety inspection verification",
    ],
  },
  {
    id: "verified_badge",
    service: "Verified requester badge",
    priceDisplay: "R99",
    priceCents: 9900,
    billingType: "monthly",
    badge: "Trust Anchor",
    description: "Official community credibility badge establishing trust with local youth & parents.",
    features: [
      "Verified Business/Store badge next to your name",
      "Higher applicant confidence & lower cancellation rate",
      "Dedicated WhatsApp safety liaison support",
      "Unlimited business venue listings & photo showcase",
    ],
  },
  {
    id: "priority_matching",
    service: "Priority applicant matching",
    priceDisplay: "R149",
    priceCents: 14900,
    billingType: "monthly",
    badge: "High Demand",
    description: "AI automatically pairs your tasks with the top 5% rated youth in your ward.",
    features: [
      "Automated matching with 90%+ credibility youth",
      "Punctuality and attendance guaranteed candidates",
      "Early access to top-rated youth workers in your ward",
      "Monthly performance & task analytics summary",
    ],
  },
];

export const EMPLOYER_PLANS_TABLE: EmployerPlanItem[] = [
  {
    id: "starter",
    plan: "Starter",
    priceDisplay: "R499",
    priceCents: 49900,
    billingPeriod: "per month",
    includesSummary: "Up to 3 active job posts",
    popular: false,
    activeJobPostsLimit: 3,
    features: [
      "Up to 3 active job posts simultaneously",
      "Full access to evidence-backed youth profiles",
      "Direct candidate messaging in-app",
      "Basic candidate filtering & location matching",
      "SETA-compliant learnership and job posting templates",
    ],
    ctaLabel: "Select Starter",
  },
  {
    id: "growth",
    plan: "Growth",
    priceDisplay: "R1,499",
    priceCents: 149900,
    billingPeriod: "per month",
    includesSummary: "Up to 10 active job posts, shortlists, and interview tools",
    popular: true,
    activeJobPostsLimit: 10,
    features: [
      "Up to 10 active job posts simultaneously",
      "AI Candidate shortlists with demonstrated task badges",
      "Integrated interview scheduling & taxi transport voucher tools",
      "Priority candidate push notifications across target townships",
      "Workplace hiring site showcase with directions & photos",
      "Phone and email account support",
    ],
    ctaLabel: "Upgrade to Growth",
  },
  {
    id: "enterprise",
    plan: "Enterprise",
    priceDisplay: "Custom pricing",
    priceCents: null,
    billingPeriod: "contact sales",
    includesSummary: "Larger employers, training providers, and youth organisations",
    popular: false,
    activeJobPostsLimit: "unlimited",
    features: [
      "Unlimited active job, learnership & apprenticeship posts",
      "Custom interview transport voucher subsidy program",
      "Dedicated talent acquisition specialist & recruitment account manager",
      "Custom API integration with your internal ATS / HR systems",
      "Quarterly youth impact, retention & B-BBEE scorecard reporting",
      "Custom branded hiring portals across municipal clusters",
    ],
    ctaLabel: "Contact Enterprise Sales",
  },
];

