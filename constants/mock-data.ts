import {
  ChatMessage,
  Evidence,
  Mentor,
  Opportunity,
  Skill,
  Task,
  YouthProfile,
} from "@/types";

// 8 Verified Skills
export const MOCK_SKILLS: Skill[] = [
  {
    id: "sk-1",
    name: "Stock Counting & Inventory Auditing",
    category: "retail_sales",
    description:
      "Reconciling shelves, verifying expiry dates, and counting stock for local retailers.",
    verifiedCount: 142,
  },
  {
    id: "sk-2",
    name: "Cash Handling & Till Reconciliation",
    category: "retail_sales",
    description:
      "Operating basic till points, managing float balances, and counting daily takings.",
    verifiedCount: 98,
  },
  {
    id: "sk-3",
    name: "Smartphone & Electronics Diagnostics",
    category: "trade",
    description:
      "Screen replacement, software flashing, and hardware troubleshooting for Android phones.",
    verifiedCount: 76,
  },
  {
    id: "sk-4",
    name: "Local Delivery & Route Optimization",
    category: "logistics",
    description:
      "Navigating neighborhood routes, parcel handling, and punctual hand-offs.",
    verifiedCount: 114,
  },
  {
    id: "sk-5",
    name: "Customer Service & Conflict Resolution",
    category: "hospitality",
    description:
      "Welcoming patrons, answering inquiries, and de-escalating customer friction.",
    verifiedCount: 180,
  },
  {
    id: "sk-6",
    name: "Community Event Setup & Sound Engineering",
    category: "care_community",
    description:
      "Setting up PA systems, microphone testing, cable management, and crowd marshaling.",
    verifiedCount: 65,
  },
  {
    id: "sk-7",
    name: "Elderly & Child Home Care",
    category: "care_community",
    description:
      "Meal preparation, medication reminders, and domestic safety supervision.",
    verifiedCount: 89,
  },
  {
    id: "sk-8",
    name: "Basic Bookkeeping & Receipt Capturing",
    category: "admin_tech",
    description:
      "Logging invoices, recording expenses in spreadsheets, and organizing receipts.",
    verifiedCount: 54,
  },
];

// 3 Realistic South African Youth Profiles
export const MOCK_YOUTH_PROFILES: YouthProfile[] = [
  {
    id: "yp-1",
    fullName: "Thabiso Ndlovu",
    email: "thabiso.demo@kasirize.org.za",
    location: "Soweto, Meadowlands",
    province: "Gauteng",
    experienceStory:
      "Helped my uncle at his spaza shop on weekends for 2 years. I managed inventory counting, received deliveries from wholesalers, and operated the till during busy month-end rushes.",
    skills: [
      {
        id: "ps-1",
        skillId: "sk-1",
        skillName: "Stock Counting & Inventory Auditing",
        status: "task_verified",
        endorsedBy: "Mama Dlamini (Meadowlands Spaza)",
        confidence: 90,
        userApproved: true,
      },
      {
        id: "ps-2",
        skillId: "sk-2",
        skillName: "Cash Handling & Till Reconciliation",
        status: "referee_confirmed",
        endorsedBy: "Sipho Ndlovu",
        confidence: 85,
        userApproved: true,
      },
      {
        id: "ps-3",
        skillId: "sk-5",
        skillName: "Customer Service & Conflict Resolution",
        status: "self_declared",
        confidence: 65,
        userApproved: true,
      },
    ],
    overallConfidenceScore: 82,
    mockWalletCents: 45000, // R450.00
    completedTasksCount: 4,
    savedOpportunities: ["opp-1", "opp-3"],
    transportStipendEligible: true,
    createdAt: "2026-09-12",
  },
  {
    id: "yp-2",
    fullName: "Ayanda Khumalo",
    email: "ayanda.demo@kasirize.org.za",
    location: "Khayelitsha, Site B",
    province: "Western Cape",
    experienceStory:
      "Fixed cracked phone screens and battery issues for friends and neighbors in my street. I also assist at our local church audio desk every Sunday setting up mixers and microphones.",
    skills: [
      {
        id: "ps-4",
        skillId: "sk-3",
        skillName: "Smartphone & Electronics Diagnostics",
        status: "evidence_uploaded",
        confidence: 80,
        userApproved: true,
      },
      {
        id: "ps-5",
        skillId: "sk-6",
        skillName: "Community Event Setup & Sound Engineering",
        status: "referee_confirmed",
        endorsedBy: "Pastor Mthembu",
        confidence: 88,
        userApproved: true,
      },
    ],
    overallConfidenceScore: 84,
    mockWalletCents: 32000, // R320.00
    completedTasksCount: 3,
    savedOpportunities: ["opp-2"],
    transportStipendEligible: true,
    createdAt: "2026-09-20",
  },
  {
    id: "yp-3",
    fullName: "Lerato Molefe",
    email: "lerato.demo@kasirize.org.za",
    location: "Umlazi, Section E",
    province: "KwaZulu-Natal",
    experienceStory:
      "Managed neighborhood food deliveries on bicycle during matric holidays, recorded orders in an exercise book, and helped homebound elders collect medicines at the clinic.",
    skills: [
      {
        id: "ps-6",
        skillId: "sk-4",
        skillName: "Local Delivery & Route Optimization",
        status: "task_verified",
        endorsedBy: "QuickBite Local Deliveries",
        confidence: 92,
        userApproved: true,
      },
      {
        id: "ps-7",
        skillId: "sk-7",
        skillName: "Elderly & Child Home Care",
        status: "referee_confirmed",
        endorsedBy: "Gogo Sithole",
        confidence: 86,
        userApproved: true,
      },
    ],
    overallConfidenceScore: 89,
    mockWalletCents: 60000, // R600.00
    completedTasksCount: 5,
    savedOpportunities: ["opp-1", "opp-4"],
    transportStipendEligible: true,
    createdAt: "2026-08-15",
  },
];

// 5 Nearby Tasks
export const MOCK_TASKS: Task[] = [
  {
    id: "tsk-1",
    title: "Stock Audit & Shelf Restocking",
    requesterName: "Diepkloof Express Superette",
    requesterType: "spaza_shop",
    location: "Diepkloof Zone 4, Soweto",
    estimatedTaxiFareCents: 1800, // R18.00 taxi fare
    payoutCents: 25000, // R250.00
    durationHours: 4,
    deadline: "Tomorrow, 14:00",
    skillsRequired: [
      "Stock Counting & Inventory Auditing",
      "Cash Handling & Till Reconciliation",
    ],
    description:
      "Audit dry goods and verify barcode labels before our weekly supplier drop.",
    safetyNotes:
      "Daylight hours, high foot-traffic street corner, owner present on site.",
    status: "open",
  },
  {
    id: "tsk-2",
    title: "Smartphone Diagnostics & Screen Replacement",
    requesterName: "Musa Electronics Repairs",
    requesterType: "small_business",
    location: "Site C Plaza, Khayelitsha",
    estimatedTaxiFareCents: 1500, // R15.00
    payoutCents: 30000, // R300.00
    durationHours: 3,
    deadline: "Friday, 16:00",
    skillsRequired: ["Smartphone & Electronics Diagnostics"],
    description:
      "Assist with 5 customer phone screen replacements and basic diagnostic checks.",
    safetyNotes:
      "Indoor repair shop inside security-controlled commercial mall.",
    status: "open",
  },
  {
    id: "tsk-3",
    title: "Community Hall Sound Check & Cable Run",
    requesterName: "Umlazi Youth Arts Collective",
    requesterType: "community_org",
    location: "Umlazi Civic Hall, Section C",
    estimatedTaxiFareCents: 2200, // R22.00
    payoutCents: 35000, // R350.00
    durationHours: 5,
    deadline: "Saturday, 09:00",
    skillsRequired: ["Community Event Setup & Sound Engineering"],
    description:
      "Setup 4 microphones, route speakers cables safely, and conduct sound checks.",
    safetyNotes: "Official municipal venue, certified stage manager on duty.",
    status: "open",
  },
  {
    id: "tsk-4",
    title: "Wholesale Grocery Delivery & Unloading",
    requesterName: "Tembisa Fresh Wholesalers",
    requesterType: "small_business",
    location: "Oakmoor, Tembisa",
    estimatedTaxiFareCents: 2000, // R20.00
    payoutCents: 22000, // R220.00
    durationHours: 3,
    deadline: "Tomorrow, 10:00",
    skillsRequired: [
      "Local Delivery & Route Optimization",
      "Stock Counting & Inventory Auditing",
    ],
    description:
      "Assist unloading 40 crates of fresh produce into local retail stalls.",
    safetyNotes: "Safety gloves and closed shoes provided.",
    status: "open",
  },
  {
    id: "tsk-5",
    title: "Receipt Digitization & Expense Filing",
    requesterName: "Lindiwe's Catering Services",
    requesterType: "small_business",
    location: "Braamfontein, Johannesburg",
    estimatedTaxiFareCents: 2500, // R25.00
    payoutCents: 28000, // R280.00
    durationHours: 4,
    deadline: "Next Monday, 12:00",
    skillsRequired: ["Basic Bookkeeping & Receipt Capturing"],
    description:
      "Scan physical supplier slips, capture amounts in Google Sheets, and staple receipts.",
    safetyNotes: "Shared co-working office space with reception desk.",
    status: "open",
  },
];

// 8 Opportunities (Jobs, Learnerships, Micro-Internships)
export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Junior Inventory & Retail Assistant",
    employerName: "Spar Distribution Gauteng",
    organisationType: "retailer",
    location: "City Deep, Johannesburg (Hybrid Shuttle)",
    type: "entry_level_job",
    monthlyStipendCents: 650000, // R6,500.00 / mo
    transportCreditFunded: true,
    requiredSkills: [
      "Stock Counting & Inventory Auditing",
      "Cash Handling & Till Reconciliation",
    ],
    description:
      "Full-time junior position supporting our fresh produce intake and stock logging.",
    applicationDeadline: "End of month",
  },
  {
    id: "opp-2",
    title: "Electronics Diagnostic Apprenticeship",
    employerName: "FixIt Cape Tech Hub",
    organisationType: "tech_academy",
    location: "Woodstock, Cape Town",
    type: "apprenticeship",
    monthlyStipendCents: 520000, // R5,200.00 / mo
    transportCreditFunded: true,
    requiredSkills: ["Smartphone & Electronics Diagnostics"],
    description:
      "6-month hands-on apprenticeship repair program with tool set provided.",
    applicationDeadline: "In 2 weeks",
  },
  {
    id: "opp-3",
    title: "Customer Service & Reception Micro-Internship",
    employerName: "Kasi Hub Co-Working",
    organisationType: "hospitality",
    location: "Orlando West, Soweto",
    type: "micro_internship",
    monthlyStipendCents: 380000, // R3,800.00 / mo
    transportCreditFunded: true,
    requiredSkills: [
      "Customer Service & Conflict Resolution",
      "Basic Bookkeeping & Receipt Capturing",
    ],
    description:
      "4-week micro-internship greeting guests, handling meeting room schedules and front desk.",
    applicationDeadline: "In 5 days",
  },
  {
    id: "opp-4",
    title: "Logistics & Dispatch Learnership",
    employerName: "FastLane Couriers KZN",
    organisationType: "logistics_hub",
    location: "Prospecton, Durban",
    type: "learnership",
    monthlyStipendCents: 480000, // R4,800.00 / mo
    transportCreditFunded: true,
    requiredSkills: [
      "Local Delivery & Route Optimization",
      "Stock Counting & Inventory Auditing",
    ],
    description:
      "SETA-accredited 12-month transport learnership with practical hub rotations.",
    applicationDeadline: "Next month",
  },
  {
    id: "opp-5",
    title: "Junior Store Clerk",
    employerName: "Metro Hypermarket",
    organisationType: "retailer",
    location: "Germiston, Ekurhuleni",
    type: "entry_level_job",
    monthlyStipendCents: 620000, // R6,200.00 / mo
    transportCreditFunded: true,
    requiredSkills: [
      "Stock Counting & Inventory Auditing",
      "Customer Service & Conflict Resolution",
    ],
    description:
      "Assist customers on shop floor, maintain merchandising display standards.",
    applicationDeadline: "In 10 days",
  },
  {
    id: "opp-6",
    title: "Sound & Events Production Intern",
    employerName: "LiveVibe Productions",
    organisationType: "hospitality",
    location: "Newtown, Johannesburg",
    type: "micro_internship",
    monthlyStipendCents: 420000, // R4,200.00 / mo
    transportCreditFunded: true,
    requiredSkills: ["Community Event Setup & Sound Engineering"],
    description:
      "Shadow experienced sound engineers across weekend live festival stages.",
    applicationDeadline: "In 3 weeks",
  },
  {
    id: "opp-7",
    title: "Warehouse Picking & Dispatch Assistant",
    employerName: "EaziLogistics Western Cape",
    organisationType: "logistics_hub",
    location: "Montague Gardens, Cape Town",
    type: "entry_level_job",
    monthlyStipendCents: 680000, // R6,800.00 / mo
    transportCreditFunded: true,
    requiredSkills: [
      "Local Delivery & Route Optimization",
      "Stock Counting & Inventory Auditing",
    ],
    description:
      "Scan items, pack orders into shipping containers, and double check shipping addresses.",
    applicationDeadline: "In 12 days",
  },
  {
    id: "opp-8",
    title: "Youth Community Facilitator",
    employerName: "ReachForward Foundation",
    organisationType: "tech_academy",
    location: "Umlazi, Durban",
    type: "learnership",
    monthlyStipendCents: 450000, // R4,500.00 / mo
    transportCreditFunded: true,
    requiredSkills: [
      "Customer Service & Conflict Resolution",
      "Community Event Setup & Sound Engineering",
    ],
    description:
      "Run digital literacy workshops for high schoolers using tablet computers.",
    applicationDeadline: "In 2 weeks",
  },
];

// 5 Evidence Records
export const MOCK_EVIDENCE: Evidence[] = [
  {
    id: "ev-1",
    youthId: "yp-1",
    title: "Spaza Stock Audit Sheet",
    description:
      "Photo of handwritten tally sheet confirming 320 wholesale items checked with 0 errors.",
    fileType: "image",
    refereeName: "Mama Dlamini",
    refereeRole: "Owner, Meadowlands Spaza",
    verified: true,
    createdAt: "2026-09-18",
  },
  {
    id: "ev-2",
    youthId: "yp-2",
    title: "Before & After Phone Screen Replacement",
    description:
      "Side-by-side photos demonstrating screen replacement on a Samsung A12.",
    fileType: "image",
    refereeName: "Bongani Sithole",
    refereeRole: "Customer",
    verified: true,
    createdAt: "2026-09-25",
  },
  {
    id: "ev-3",
    youthId: "yp-2",
    title: "Audio Mixer Setup Confirmation",
    description:
      "WhatsApp voice note from Pastor Mthembu confirming punctual Sunday stage setup.",
    fileType: "audio_note",
    refereeName: "Pastor Mthembu",
    refereeRole: "Senior Minister",
    verified: true,
    createdAt: "2026-10-02",
  },
  {
    id: "ev-4",
    youthId: "yp-3",
    title: "Delivery Waybill Receipt",
    description:
      "Signed customer acknowledgment receipt for 18 local deliveries completed in 3 hours.",
    fileType: "receipt",
    refereeName: "Mrs. Nene",
    refereeRole: "Local resident",
    verified: true,
    createdAt: "2026-10-10",
  },
  {
    id: "ev-5",
    youthId: "yp-1",
    title: "Cash Float Balancing Register",
    description:
      "Daily reconciliation sheet showing perfect match between slip counter and drawer.",
    fileType: "receipt",
    refereeName: "Sipho Ndlovu",
    refereeRole: "Shop Supervisor",
    verified: true,
    createdAt: "2026-10-12",
  },
];

// 2 Skill Mentors
export const MOCK_MENTORS: Mentor[] = [
  {
    id: "men-1",
    fullName: "Nandi Cele",
    roleTitle: "Senior Logistics & Supply Chain Coach",
    organization: "Kasi Growth Hub",
    location: "Johannesburg Central",
    specialties: [
      "Stock Counting & Inventory Auditing",
      "Basic Bookkeeping & Receipt Capturing",
    ],
    bio: "12 years in wholesale retail and township distribution. Passionate about turning daily hustle into formal careers.",
    activeMenteesCount: 18,
  },
  {
    id: "men-2",
    fullName: "Kagiso Mokoena",
    roleTitle: "Hardware Repair & Electronics Trainer",
    organization: "Tech4All Initiative",
    location: "Cape Town",
    specialties: [
      "Smartphone & Electronics Diagnostics",
      "Customer Service & Conflict Resolution",
    ],
    bio: "Self-taught technician who now runs accredited vocational hardware workshops across 4 townships.",
    activeMenteesCount: 24,
  },
];

// 3 Safe Demo Chat Threads
export const MOCK_CHATS: ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "tsk-1",
    senderName: "Diepkloof Express Superette",
    senderRole: "role-requester",
    recipientId: "yp-1",
    message:
      "Saw your stock counting badge! Can you make it by 14:00 tomorrow? We have 4 aisles ready.",
    timestamp: "10:14",
  },
  {
    id: "msg-2",
    senderId: "yp-1",
    senderName: "Thabiso Ndlovu",
    senderRole: "role-user",
    recipientId: "tsk-1",
    message:
      "Yes Mama! I can arrive at 13:45. Is the inventory clipboard ready on the counter?",
    timestamp: "10:18",
  },
  {
    id: "msg-3",
    senderId: "opp-1",
    senderName: "Spar Distribution Gauteng",
    senderRole: "role-employer",
    recipientId: "yp-1",
    message:
      "Hi Thabiso, your verified ratings match our junior inventory role. We've unlocked R50 interview transport support for you.",
    timestamp: "Yesterday",
  },
];
