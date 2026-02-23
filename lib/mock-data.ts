export type Pool = {
  id: string;
  name: string;
  category: string;
  target: number;
  raised: number;
  contributionPerPerson: number;
  contributorsPaid: number;
  contributorsTotal: number;
  deadlineText: string;
  statusText: string;
  admin: string;
};

export type Member = {
  initials: string;
  name: string;
  matric: string;
  paidDateText: string;
  timeText: string;
  avatarClass: "blue" | "green" | "orange" | "purple" | "pink" | "teal" | "gray" | "red";
  you?: boolean;
};

export const viewer = {
  name: "Princess Saven",
  handle: "Saven",
  initials: "PS"
};

export const uiMeta = {
  appName: "PoolFi",
  todayLabel: "Wednesday, Feb 28 , 2026"
};

export const dashboardBalance = {
  total: 47500,
  available: 32500,
  locked: 15000
};

export const pools: Pool[] = [
  {
    id: "class-dues-300l",
    name: "300L Class Dues - 2nd Semester 2025/26",
    category: "Education",
    target: 400000,
    raised: 313000,
    contributionPerPerson: 1000,
    contributorsPaid: 313,
    contributorsTotal: 400,
    deadlineText: "5 days left",
    statusText: "Active",
    admin: "Chidi Nwosu"
  },
  {
    id: "wedding-collection",
    name: "Amaka's Wedding Collection",
    category: "Welfare",
    target: 500000,
    raised: 240000,
    contributionPerPerson: 5000,
    contributorsPaid: 48,
    contributorsTotal: 120,
    deadlineText: "Closes in 12 days",
    statusText: "Active",
    admin: "Princess Saven"
  },
  {
    id: "mosque-renovation",
    name: "Mosque Renovation Fund",
    category: "Infrastructure",
    target: 2000000,
    raised: 850000,
    contributionPerPerson: 10000,
    contributorsPaid: 85,
    contributorsTotal: 200,
    deadlineText: "30 days left",
    statusText: "Active",
    admin: "Tunde Adeyemi"
  }
];

export const poolMembers: Member[] = [
  {
    initials: "EO",
    name: "Emeka Obi",
    matric: "CSC/2022/031",
    paidDateText: "Paid Feb 18",
    timeText: "Just now",
    avatarClass: "blue",
    you: true
  },
  {
    initials: "CN",
    name: "Chidi Nwosu",
    matric: "CSC/2022/014",
    paidDateText: "Paid Feb 18",
    timeText: "2 hrs ago",
    avatarClass: "green"
  },
  {
    initials: "AE",
    name: "Amaka Eze",
    matric: "ENG/2022/089",
    paidDateText: "Paid Feb 17",
    timeText: "3 hrs ago",
    avatarClass: "orange"
  },
  {
    initials: "FO",
    name: "Femi Okonkwo",
    matric: "CHE/2022/068",
    paidDateText: "Paid Feb 17",
    timeText: "Yesterday",
    avatarClass: "gray"
  },
  {
    initials: "BA",
    name: "Bisi Adeleke",
    matric: "MTH/2022/029",
    paidDateText: "Paid Feb 16",
    timeText: "Yesterday",
    avatarClass: "gray"
  },
  {
    initials: "UI",
    name: "Uche Ibe",
    matric: "MTH/2022/029",
    paidDateText: "Paid Feb 16",
    timeText: "2 days ago",
    avatarClass: "gray"
  },
  {
    initials: "NO",
    name: "Ngozi Okafor",
    matric: "MED/2022/112",
    paidDateText: "Paid Feb 15",
    timeText: "2 days ago",
    avatarClass: "red"
  },
  {
    initials: "TA",
    name: "Tunde Adeyemi",
    matric: "PHY/2022/055",
    paidDateText: "Paid Feb 16",
    timeText: "2 days ago",
    avatarClass: "teal"
  }
];

export const impactFeatured = {
  title: "Clean Water Borehole for Oguta Community, Imo State",
  description:
    "3,000+ residents walk 2km daily for water. This pool funds a functional borehole and distribution network.",
  raised: 670000,
  target: 1000000,
  contributors: 346
};

export const impactStats = {
  totalRaisedLabel: "N48.2M",
  contributorsLabel: "1,240",
  completedLabel: "12"
};

export const impactCards = Array.from({ length: 6 }, (_, idx) => ({
  id: `impact-${idx + 1}`,
  title: "Scholarship Fund for Indigent UNIBEN Students",
  desc: "Supporting 20 students who cannot afford fees this semester.",
  raised: 270000,
  target: 500000,
  contributors: 128
}));

export const recentActivity = [
  { icon: "CARD", title: "Wallet funded", time: "Today - 9:14am", amount: "+N20,000", positive: true },
  {
    icon: "DUES",
    title: "Class Dues contribution",
    time: "Today - 9:16am",
    amount: "-N1,000",
    positive: false
  },
  {
    icon: "BELL",
    title: "Amaka paid her dues",
    time: "Yesterday - 3:42pm",
    amount: "Pool update",
    positive: null
  },
  {
    icon: "POOL",
    title: "Wedding pool joined",
    time: "Feb 16 - 11:00am",
    amount: "-N5,000",
    positive: false
  }
] as const;

export function toMoney(value: number) {
  return `N${value.toLocaleString("en-US")}`;
}

export function toPercent(raised: number, target: number) {
  return Math.round((raised / target) * 100);
}
