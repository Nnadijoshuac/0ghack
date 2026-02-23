import { NextResponse } from "next/server";
import { dashboardBalance, pools, recentActivity, viewer } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    viewer,
    balance: dashboardBalance,
    pools,
    recentActivity
  });
}
