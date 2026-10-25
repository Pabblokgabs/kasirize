import { AuthUser, getStoredAuthUser } from "@/lib/auth";
import { Opportunity, Task, YouthProfile } from "@/types";

export interface LoggedInUserData {
  user: AuthUser;
  youthProfile?: YouthProfile;
  stats: {
    label1: string;
    value1: string | number;
    label2: string;
    value2: string | number;
    label3: string;
    value3: string | number;
    label4: string;
    value4: string | number;
  };
  relatedTasks: Task[];
  relatedOpportunities: Opportunity[];
}

/**
 * Returns baseline data tailored to the authenticated user.
 * Full data loads dynamically from live /api/user/live-data directly from Neon PostgreSQL.
 */
export function getCurrentUserData(): LoggedInUserData {
  const authUser = getStoredAuthUser();

  const fallbackUser: AuthUser = {
    id: "usr_youth_01",
    name: "Kagiso Sithole",
    email: "kagiso@kasirize.org.za",
    role: "role-user",
    location: "Soweto, Gauteng",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    isGuest: false,
  };

  const user = authUser || fallbackUser;

  // 1. Youth
  if (user.role === "role-user") {
    const defaultProfile: YouthProfile = {
      id: user.id || "usr_youth_01",
      fullName: user.name,
      email: user.email,
      location: user.location?.split(",")[0] || "Soweto",
      province: user.location?.split(",")[1]?.trim() || "Gauteng",
      experienceStory:
        "High reliability logistics and store assistant with 14 verified completed township tasks.",
      overallConfidenceScore: 91,
      mockWalletCents: 45000,
      completedTasksCount: 14,
      savedOpportunities: ["opp_01", "opp_03"],
      transportStipendEligible: true,
      createdAt: "2026-08-15T08:00:00Z",
      skills: [
        {
          id: "s-1",
          skillId: "sk_delivery",
          skillName: "Delivery Management",
          status: "task_verified",
          confidence: 93,
          userApproved: true,
          endorsedBy: "Sipho Nkosi",
        },
        {
          id: "s-2",
          skillId: "sk_stocktake",
          skillName: "Stocktaking",
          status: "task_verified",
          confidence: 88,
          userApproved: true,
          endorsedBy: "Sipho Nkosi",
        },
      ],
    };

    return {
      user,
      youthProfile: defaultProfile,
      stats: {
        label1: "Tasks Completed",
        value1: defaultProfile.completedTasksCount,
        label2: "Confidence Score",
        value2: `${defaultProfile.overallConfidenceScore}%`,
        label3: "Wallet Balance",
        value3: `R ${(defaultProfile.mockWalletCents / 100).toFixed(2)}`,
        label4: "Transport Eligible",
        value4: defaultProfile.transportStipendEligible
          ? "Yes (Covered)"
          : "Self-Funded",
      },
      relatedTasks: [],
      relatedOpportunities: [],
    };
  }

  // 2. Employer
  if (user.role === "role-employer") {
    const isInnovate =
      user.email.includes("innovate") || user.email.includes("themba");
    const isFreshmart =
      user.email.includes("freshmart") || user.email.includes("priya");
    const workplacesCount = isInnovate ? 2 : isFreshmart ? 1 : 0;

    return {
      user,
      stats: {
        label1: "Active Openings",
        value1: isInnovate ? 4 : isFreshmart ? 4 : 0,
        label2: "Operating Sites",
        value2: workplacesCount,
        label3: "Candidates Reviewed",
        value3: isInnovate ? 38 : isFreshmart ? 19 : 0,
        label4: "Transport Vouchers Funded",
        value4: isInnovate ? "R 8,500" : isFreshmart ? "R 5,000" : "R 0",
      },
      relatedTasks: [],
      relatedOpportunities: [],
    };
  }

  // 3. Requester
  if (user.role === "role-requester") {
    const isSipho =
      user.email.includes("sipho") || user.name.includes("Sipho");
    const isGrace =
      user.email.includes("grace") || user.name.includes("Grace");
    const placesCount = isSipho ? 2 : isGrace ? 1 : 0;

    return {
      user,
      stats: {
        label1: "Tasks Posted",
        value1: isSipho ? 11 : isGrace ? 6 : 0,
        label2: "Operating Places",
        value2: placesCount,
        label3: "Youth Hired & Rated",
        value3: isSipho ? 24 : isGrace ? 12 : 0,
        label4: "Total Stipend Disbursed",
        value4: isSipho ? "R 6,400" : isGrace ? "R 3,250" : "R 0",
      },
      relatedTasks: [],
      relatedOpportunities: [],
    };
  }

  // 4. Mentor
  if (user.role === "role-mentor") {
    return {
      user,
      stats: {
        label1: "Active Mentees",
        value1: user.email.includes("lindiwe")
          ? 8
          : user.email.includes("bongani")
            ? 6
            : 0,
        label2: "Verified Endorsements",
        value2: user.email.includes("lindiwe")
          ? 88
          : user.email.includes("bongani")
            ? 64
            : 0,
        label3: "Coaching Sessions",
        value3: user.email.includes("lindiwe")
          ? 140
          : user.email.includes("bongani")
            ? 95
            : 0,
        label4: "Average Mentor Rating",
        value4: user.email.includes("lindiwe")
          ? "4.9 ★"
          : user.email.includes("bongani")
            ? "4.8 ★"
            : "New",
      },
      relatedTasks: [],
      relatedOpportunities: [],
    };
  }

  // 5. Admin default
  return {
    user,
    stats: {
      label1: "Total Platform Users",
      value1: "20 Active",
      label2: "Open Tasks This Week",
      value2: "20",
      label3: "Job & Learnership Vacancies",
      value3: "10",
      label4: "System Status",
      value4: "100% Operational",
    },
    relatedTasks: [],
    relatedOpportunities: [],
  };
}
