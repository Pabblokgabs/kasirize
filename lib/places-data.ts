import { getStoredAuthUser } from "@/lib/auth";

export interface EmployerPlace {
  id: string;
  name: string;
  industry: string;
  siteType:
    | "Headquarters"
    | "Distribution Center"
    | "Regional Hub"
    | "Retail Store"
    | "Training Academy";
  tagline: string;
  address: string;
  city: string;
  province: string;
  interviewHubAddress: string;
  transitAccess: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  description: string;
  photos: string[];
  workplacePerks: string[];
  stats: {
    opportunitiesPosted: number;
    hiresCompleted: number;
    fundedVouchersIssued: number;
    stipendPaidOutRands: number;
    retentionRatePercent: number;
    mentorshipHours: number;
  };
}

export interface RequesterPlace {
  id: string;
  name: string;
  category:
    | "Spaza Shop"
    | "Bakery"
    | "Workshop"
    | "Car Wash"
    | "Community Hub"
    | "Home Enterprise";
  tagline: string;
  address: string;
  ward: string;
  township: string;
  operatingHours: string;
  contactNumber: string;
  safetyCheckPassed: boolean;
  walkingDistanceWard: string;
  photos: string[];
  description: string;
  facilities: string[];
  stats: {
    tasksOffered: number;
    tasksCompleted: number;
    youthHelped: number;
    totalPaidOutRands: number;
    averageRating: number;
    repeatYouthWorkers: number;
  };
}

// ─── 3 EMPLOYERS (2 places, 1 place, 0 places) ───
// Employer 1: Themba Ndaba (Innovate Logistics SA) -> 2 Workplaces
export const EMPLOYER_1_PLACES: EmployerPlace[] = [
  {
    id: "wp_01",
    name: "City Deep Distribution Hub & Staging Terminal",
    industry: "Logistics & Supply Chain",
    siteType: "Distribution Center",
    tagline: "High-volume automated sorting, inventory audit, and fleet staging hub",
    address: "14 Heidelberg Road, City Deep",
    city: "Johannesburg",
    province: "Gauteng",
    interviewHubAddress: "Innovate Logistics Terminal 2, Gate 4, City Deep",
    transitAccess: "Direct taxi rank & MetroRail commuter interchange adjacent to entrance",
    contactEmail: "themba@innovatelogistics.co.za",
    contactPhone: "071 234 5020",
    website: "https://innovatelogistics.co.za",
    description: "Our premier 15,000 sqm distribution terminal serving Gauteng. We actively host youth warehouse pathways, inventory apprenticeships, and 100% pre-funded taxi transport for interviews.",
    photos: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=80",
    ],
    workplacePerks: [
      "100% Pre-funded Interview Taxi Vouchers",
      "Full PPE & Safety Boots Provided",
      "Subsidized Staff Canteen",
      "TETA-Accredited Apprenticeship Track",
    ],
    stats: {
      opportunitiesPosted: 5,
      hiresCompleted: 14,
      fundedVouchersIssued: 32,
      stipendPaidOutRands: 185000,
      retentionRatePercent: 94,
      mentorshipHours: 210,
    },
  },
  {
    id: "wp_02",
    name: "Soweto Last-Mile Dispatch & Parcel Depot",
    industry: "Logistics & Supply Chain",
    siteType: "Regional Hub",
    tagline: "Local parcel distribution hub connecting township shoppers and e-commerce couriers",
    address: "12 Vilakazi Street, Orlando West",
    city: "Soweto",
    province: "Gauteng",
    interviewHubAddress: "Soweto Dispatch Point Office, Orlando West",
    transitAccess: "5 minutes from Orlando Station and taxi ranks along Klipspruit Valley Road",
    contactEmail: "soweto@innovatelogistics.co.za",
    contactPhone: "071 234 5020",
    website: "https://innovatelogistics.co.za",
    description: "Our neighborhood last-mile dispatch depot where local couriers pick up parcels for fast Soweto home deliveries.",
    photos: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
    ],
    workplacePerks: [
      "Bicycle and Walking Route Dispatch Bonuses",
      "Safe Smartphone Charging Lockers",
      "Direct Cashless Stipend Escrow",
    ],
    stats: {
      opportunitiesPosted: 3,
      hiresCompleted: 8,
      fundedVouchersIssued: 18,
      stipendPaidOutRands: 76000,
      retentionRatePercent: 90,
      mentorshipHours: 120,
    },
  },
];

// Employer 2: Priya Govender (FreshMart Retail Group) -> 1 Workplace
export const EMPLOYER_2_PLACES: EmployerPlace[] = [
  {
    id: "wp_03",
    name: "FreshMart Regional Warehouse & Training Supermarket",
    industry: "Retail & FMCG",
    siteType: "Retail Store",
    tagline: "W&RSETA accredited learning center and high-volume grocery supermarket",
    address: "88 Umgeni Road, Stamford Hill",
    city: "Durban",
    province: "KwaZulu-Natal",
    interviewHubAddress: "FreshMart Human Capital Centre, 2nd Floor, Umgeni Road",
    transitAccess: "Adjacent to Berea station and central Durban taxi routes",
    contactEmail: "priya@freshmart.co.za",
    contactPhone: "071 234 5021",
    website: "https://freshmart.co.za",
    description: "Regional distribution and supermarket flagship store training 50+ retail apprentices annually in stock management, till cashiering, and quality control.",
    photos: [
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
    ],
    workplacePerks: [
      "W&RSETA NQF Level 3 Certification",
      "Interview Transport Reimbursement",
      "Free Daily Staff Meal",
      "Employee In-Store Discount",
    ],
    stats: {
      opportunitiesPosted: 4,
      hiresCompleted: 12,
      fundedVouchersIssued: 24,
      stipendPaidOutRands: 120000,
      retentionRatePercent: 91,
      mentorshipHours: 180,
    },
  },
];

// Employer 3: Johan van der Merwe (Apex Retailers SA - Guest / New) -> 0 Workplaces
export const EMPLOYER_3_PLACES: EmployerPlace[] = [];

export function getEmployerPlacesForUser(): EmployerPlace[] {
  const user = getStoredAuthUser();
  if (!user) return EMPLOYER_1_PLACES;

  const email = user.email.toLowerCase();
  if (email.includes("innovate") || email.includes("themba")) {
    return EMPLOYER_1_PLACES; // 2 places
  }
  if (email.includes("freshmart") || email.includes("priya")) {
    return EMPLOYER_2_PLACES; // 1 place
  }
  if (email.includes("apex") || email.includes("johan") || user.isGuest) {
    return EMPLOYER_3_PLACES; // 0 places
  }
  return EMPLOYER_1_PLACES;
}

// ─── 3 REQUESTERS (2 places, 1 place, 0 places) ───
// Requester 1: Sipho Nkosi -> 2 Places
export const REQUESTER_1_PLACES: RequesterPlace[] = [
  {
    id: "place-1",
    name: "Sipho's Bree Street Wholesale & Spaza Depot",
    category: "Spaza Shop",
    tagline: "High footfall wholesale distribution stall and convenience spaza shop",
    address: "74 Bree & Wanderers Street",
    ward: "Ward 60",
    township: "Johannesburg CBD",
    operatingHours: "06:30 AM - 19:00 PM (Monday - Saturday)",
    contactNumber: "071 234 5030",
    safetyCheckPassed: true,
    walkingDistanceWard: "Ward 60 & Ward 61",
    photos: [
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1556742049-0a67e557224d?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Cornerstone grocery and wholesale distributor supplying neighborhood street traders. Youth micro-tasks focus on stock counting, parcel dispatch, and till assistance.",
    facilities: ["Escrow Lock Payout", "Till Scanner Point", "Indoor Rest Area", "Cold Drink Frigidaire"],
    stats: {
      tasksOffered: 18,
      tasksCompleted: 16,
      youthHelped: 14,
      totalPaidOutRands: 6400,
      averageRating: 4.9,
      repeatYouthWorkers: 6,
    },
  },
  {
    id: "place-2",
    name: "Sipho's Jeppestown Corner Outlet",
    category: "Spaza Shop",
    tagline: "Neighborhood retail kiosk and airtime distribution hub",
    address: "212 Main Reef Road, Jeppestown",
    ward: "Ward 62",
    township: "Jeppestown, Johannesburg",
    operatingHours: "07:00 AM - 18:30 PM (Daily)",
    contactNumber: "071 234 5030",
    safetyCheckPassed: true,
    walkingDistanceWard: "Ward 62 & Maboneng",
    photos: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Secondary neighborhood branch handling dry grocery distribution, bread crates, and weekly stock reconciliation.",
    facilities: ["Security Grille Protection", "Digital Barcode Reader", "First Aid Kit"],
    stats: {
      tasksOffered: 8,
      tasksCompleted: 7,
      youthHelped: 5,
      totalPaidOutRands: 2400,
      averageRating: 4.8,
      repeatYouthWorkers: 3,
    },
  },
];

// Requester 2: Mama Grace Khoza -> 1 Place
export const REQUESTER_2_PLACES: RequesterPlace[] = [
  {
    id: "place-3",
    name: "Mama Grace Community Kitchen & Bakery",
    category: "Community Hub",
    tagline: "Catering preparation hub, bakery, and elderly nutrition center",
    address: "48 Kumalo Street, Orlando East",
    ward: "Ward 39",
    township: "Orlando East, Soweto",
    operatingHours: "06:00 AM - 17:00 PM (Daily)",
    contactNumber: "071 234 5031",
    safetyCheckPassed: true,
    walkingDistanceWard: "Ward 39 & Ward 40",
    photos: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
    ],
    description: "Community kitchen preparing hot meals, baking fresh bread, and packaging food parcels. Micro-tasks involve dough preparation, packaging, and weekend wedding event setups.",
    facilities: ["Food Hygiene Certified", "Industrial Kitchen Sink", "Resting Area", "Escrow Secured Payouts"],
    stats: {
      tasksOffered: 12,
      tasksCompleted: 12,
      youthHelped: 9,
      totalPaidOutRands: 3850,
      averageRating: 5.0,
      repeatYouthWorkers: 5,
    },
  },
];

// Requester 3: Trevor Naidoo (Guest Requester) -> 0 Places
export const REQUESTER_3_PLACES: RequesterPlace[] = [];

export function getRequesterPlacesForUser(): RequesterPlace[] {
  const user = getStoredAuthUser();
  if (!user) return REQUESTER_1_PLACES;

  const email = user.email.toLowerCase();
  if (email.includes("sipho")) {
    return REQUESTER_1_PLACES; // 2 places
  }
  if (email.includes("grace")) {
    return REQUESTER_2_PLACES; // 1 place
  }
  if (email.includes("trevor") || user.isGuest) {
    return REQUESTER_3_PLACES; // 0 places
  }
  return REQUESTER_1_PLACES;
}

