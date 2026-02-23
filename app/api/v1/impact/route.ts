import { NextResponse } from "next/server";

const impactStats = {
  totalRaisedLabel: "N48.2M",
  contributorsLabel: "1,240",
  completedLabel: "12"
};

const impactFeatured = {
  title: "Clean Water Borehole for Oguta Community, Imo State",
  description:
    "3,000+ residents walk 2km daily for water. This pool funds a functional borehole and distribution network.",
  raised: 670000,
  target: 1000000,
  contributors: 346
};

const impactCards = Array.from({ length: 6 }, (_, idx) => ({
  id: `impact-${idx + 1}`,
  title: "Scholarship Fund for Indigent UNIBEN Students",
  desc: "Supporting 20 students who cannot afford fees this semester.",
  raised: 270000,
  target: 500000,
  contributors: 128
}));

export async function GET() {
  return NextResponse.json({
    featured: impactFeatured,
    cards: impactCards,
    stats: impactStats
  });
}
