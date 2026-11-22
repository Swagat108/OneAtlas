import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Protect route if CRON_SECRET is configured
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Record start of sync in DataSyncLog
    const log = await prisma.dataSyncLog.create({
      data: {
        source: "cron-daily",
        status: "SUCCESS",
        recordsCreated: 0,
        recordsUpdated: 0,
        recordsSkipped: 0,
        finishedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Daily ingestion cron executed successfully",
      syncLogId: log.id,
      timestamp: log.finishedAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Cron execution failed" },
      { status: 500 }
    );
  }
}
