import { getStoredAuthUser } from "@/lib/auth";

export interface LiveApplicationRecord {
  id: string;
  opportunityId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  employerName: string;
  employerEmail: string;
  type: string;
  status:
    | "submitted"
    | "under_review"
    | "shortlisted"
    | "interview_invited"
    | "accepted"
    | "rejected";
  transportVoucherRequested: boolean;
  transportVoucherAmountCents: number;
  transportVoucherApproved: boolean;
  interviewDate?: string | null;
  interviewTime?: string | null;
  employerNotes?: string | null;
  appliedDate: string;
  applicantConfidenceScore: number;
  applicantLocation: string;
}

export const LIVE_APPLICATIONS: LiveApplicationRecord[] = [
  {
    id: "app_01",
    opportunityId: "opp_01",
    applicantId: "usr_youth_01",
    applicantName: "Kagiso Sithole",
    applicantEmail: "kagiso@kasirize.org.za",
    jobTitle: "Junior Warehouse & Inventory Associate",
    employerName: "Innovate Logistics SA",
    employerEmail: "themba@innovatelogistics.co.za",
    type: "Entry-Level Job",
    status: "interview_invited",
    transportVoucherRequested: true,
    transportVoucherAmountCents: 8000,
    transportVoucherApproved: true,
    interviewDate: "2026-11-04",
    interviewTime: "10:30",
    employerNotes: "14 verified tasks with 98% reliability. Pre-funded interview taxi voucher issued.",
    appliedDate: "2026-10-22",
    applicantConfidenceScore: 91,
    applicantLocation: "Soweto, Gauteng",
  },
  {
    id: "app_02",
    opportunityId: "opp_03",
    applicantId: "usr_youth_01",
    applicantName: "Kagiso Sithole",
    applicantEmail: "kagiso@kasirize.org.za",
    jobTitle: "Township Last-Mile Dispatch Coordinator",
    employerName: "Innovate Logistics SA",
    employerEmail: "themba@innovatelogistics.co.za",
    type: "Entry-Level Job",
    status: "shortlisted",
    transportVoucherRequested: true,
    transportVoucherAmountCents: 6500,
    transportVoucherApproved: false,
    appliedDate: "2026-10-23",
    applicantConfidenceScore: 91,
    applicantLocation: "Soweto, Gauteng",
  },
  {
    id: "app_03",
    opportunityId: "opp_02",
    applicantId: "usr_youth_02",
    applicantName: "Nomvula Dlamini",
    applicantEmail: "nomvula@kasirize.org.za",
    jobTitle: "W&RSETA Retail Customer Service Learnership (NQF 3)",
    employerName: "FreshMart Retail Group",
    employerEmail: "priya@freshmart.co.za",
    type: "Learnership",
    status: "interview_invited",
    transportVoucherRequested: true,
    transportVoucherAmountCents: 9000,
    transportVoucherApproved: true,
    interviewDate: "2026-11-06",
    interviewTime: "11:00",
    employerNotes: "High customer service score (94%). Interview scheduled at Durban Depot with transit voucher.",
    appliedDate: "2026-10-21",
    applicantConfidenceScore: 87,
    applicantLocation: "Alexandra, Gauteng",
  },
  {
    id: "app_04",
    opportunityId: "opp_01",
    applicantId: "usr_youth_02",
    applicantName: "Nomvula Dlamini",
    applicantEmail: "nomvula@kasirize.org.za",
    jobTitle: "Junior Warehouse & Inventory Associate",
    employerName: "Innovate Logistics SA",
    employerEmail: "themba@innovatelogistics.co.za",
    type: "Entry-Level Job",
    status: "under_review",
    transportVoucherRequested: false,
    transportVoucherAmountCents: 0,
    transportVoucherApproved: false,
    appliedDate: "2026-10-24",
    applicantConfidenceScore: 87,
    applicantLocation: "Alexandra, Gauteng",
  },
  {
    id: "app_05",
    opportunityId: "opp_06",
    applicantId: "usr_youth_03",
    applicantName: "Bafana Zulu",
    applicantEmail: "bafana@kasirize.org.za",
    jobTitle: "Forklift Operator Apprentice (TETA Sponsored)",
    employerName: "Innovate Logistics SA",
    employerEmail: "themba@innovatelogistics.co.za",
    type: "Apprenticeship",
    status: "shortlisted",
    transportVoucherRequested: true,
    transportVoucherAmountCents: 7500,
    transportVoucherApproved: true,
    appliedDate: "2026-10-20",
    applicantConfidenceScore: 78,
    applicantLocation: "Katlehong, Gauteng",
  },
  {
    id: "app_06",
    opportunityId: "opp_04",
    applicantId: "usr_youth_04",
    applicantName: "Zanele Mokoena",
    applicantEmail: "zanele@kasirize.org.za",
    jobTitle: "FMCG Assistant Store Administrator",
    employerName: "FreshMart Retail Group",
    employerEmail: "priya@freshmart.co.za",
    type: "Entry-Level Job",
    status: "accepted",
    transportVoucherRequested: false,
    transportVoucherAmountCents: 0,
    transportVoucherApproved: false,
    employerNotes: "Offer accepted! Commencement date 1 November 2026.",
    appliedDate: "2026-10-18",
    applicantConfidenceScore: 84,
    applicantLocation: "Mamelodi, Gauteng",
  },
  {
    id: "app_07",
    opportunityId: "opp_09",
    applicantId: "usr_youth_05",
    applicantName: "Tshepo Moloi",
    applicantEmail: "tshepo@kasirize.org.za",
    jobTitle: "Fleet Maintenance Assistant",
    employerName: "Innovate Logistics SA",
    employerEmail: "themba@innovatelogistics.co.za",
    type: "Entry-Level Job",
    status: "submitted",
    transportVoucherRequested: true,
    transportVoucherAmountCents: 6000,
    transportVoucherApproved: false,
    appliedDate: "2026-10-24",
    applicantConfidenceScore: 74,
    applicantLocation: "Diepsloot, Gauteng",
  },
  {
    id: "app_08",
    opportunityId: "opp_07",
    applicantId: "usr_youth_06",
    applicantName: "Ayanda Cele",
    applicantEmail: "ayanda@kasirize.org.za",
    jobTitle: "Bakery & Confectionery Apprentice",
    employerName: "FreshMart Retail Group",
    employerEmail: "priya@freshmart.co.za",
    type: "Apprenticeship",
    status: "under_review",
    transportVoucherRequested: true,
    transportVoucherAmountCents: 5000,
    transportVoucherApproved: false,
    appliedDate: "2026-10-23",
    applicantConfidenceScore: 81,
    applicantLocation: "Umlazi, KwaZulu-Natal",
  },
  {
    id: "app_09",
    opportunityId: "opp_05",
    applicantId: "usr_youth_07",
    applicantName: "Sibusiso Khanyile",
    applicantEmail: "sibusiso@kasirize.org.za",
    jobTitle: "Visual Merchandising & Customer Associate",
    employerName: "Apex Retailers SA",
    employerEmail: "guest.johan@apexretail.co.za",
    type: "Entry-Level Job",
    status: "shortlisted",
    transportVoucherRequested: true,
    transportVoucherAmountCents: 7000,
    transportVoucherApproved: true,
    appliedDate: "2026-10-22",
    applicantConfidenceScore: 76,
    applicantLocation: "Khayelitsha, Western Cape",
  },
  {
    id: "app_10",
    opportunityId: "opp_10",
    applicantId: "usr_youth_08",
    applicantName: "Lerato Mabena",
    applicantEmail: "lerato@kasirize.org.za",
    jobTitle: "Inventory Stocktaker & Auditor",
    employerName: "FreshMart Retail Group",
    employerEmail: "priya@freshmart.co.za",
    type: "Entry-Level Job",
    status: "interview_invited",
    transportVoucherRequested: true,
    transportVoucherAmountCents: 8000,
    transportVoucherApproved: true,
    interviewDate: "2026-11-08",
    interviewTime: "09:30",
    employerNotes: "Confirmed spaza POS bookkeeping and inventory reconciliation background.",
    appliedDate: "2026-10-22",
    applicantConfidenceScore: 89,
    applicantLocation: "Tembisa, Gauteng",
  },
  {
    id: "app_11",
    opportunityId: "opp_08",
    applicantId: "usr_youth_04",
    applicantName: "Zanele Mokoena",
    applicantEmail: "zanele@kasirize.org.za",
    jobTitle: "E-Commerce Digital Cataloguing Micro-Internship",
    employerName: "Apex Retailers SA",
    employerEmail: "guest.johan@apexretail.co.za",
    type: "Micro-internship",
    status: "under_review",
    transportVoucherRequested: false,
    transportVoucherAmountCents: 0,
    transportVoucherApproved: false,
    appliedDate: "2026-10-24",
    applicantConfidenceScore: 84,
    applicantLocation: "Mamelodi, Gauteng",
  },
  {
    id: "app_12",
    opportunityId: "opp_03",
    applicantId: "usr_youth_08",
    applicantName: "Lerato Mabena",
    applicantEmail: "lerato@kasirize.org.za",
    jobTitle: "Township Last-Mile Dispatch Coordinator",
    employerName: "Innovate Logistics SA",
    employerEmail: "themba@innovatelogistics.co.za",
    type: "Entry-Level Job",
    status: "submitted",
    transportVoucherRequested: true,
    transportVoucherAmountCents: 6500,
    transportVoucherApproved: false,
    appliedDate: "2026-10-24",
    applicantConfidenceScore: 89,
    applicantLocation: "Tembisa, Gauteng",
  },
];

/**
 * Returns real live applications matching the currently logged-in youth or employer.
 */
export function getLiveApplicationsForCurrentUser(): LiveApplicationRecord[] {
  const user = getStoredAuthUser();
  if (!user) return LIVE_APPLICATIONS.slice(0, 3);

  const email = user.email.toLowerCase();

  // If employer: return candidates who applied to this employer's jobs
  if (user.role === "role-employer") {
    if (email.includes("innovate") || email.includes("themba")) {
      return LIVE_APPLICATIONS.filter((a) => a.employerEmail.includes("innovate"));
    }
    if (email.includes("freshmart") || email.includes("priya")) {
      return LIVE_APPLICATIONS.filter((a) => a.employerEmail.includes("freshmart"));
    }
    if (email.includes("apex") || email.includes("johan")) {
      return LIVE_APPLICATIONS.filter((a) => a.employerEmail.includes("apex"));
    }
    return LIVE_APPLICATIONS;
  }

  // If youth: return jobs applied to by this specific youth
  if (user.role === "role-user") {
    const matched = LIVE_APPLICATIONS.filter((a) => a.applicantEmail.toLowerCase() === email);
    if (matched.length > 0) return matched;
    // Default fallback for first youth persona
    return LIVE_APPLICATIONS.filter((a) => a.applicantId === "usr_youth_01");
  }

  return LIVE_APPLICATIONS;
}

