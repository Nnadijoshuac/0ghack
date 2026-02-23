import { NextResponse } from "next/server";
import { impactCards, impactFeatured, impactStats } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    featured: impactFeatured,
    cards: impactCards,
    stats: impactStats
  });
}
