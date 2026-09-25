import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { rsvps } from "@/db/schema";
import type { RsvpStats } from "@/lib/wedding";

export const dynamic = "force-dynamic";

const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(120),
  mobile: z
    .string()
    .trim()
    .regex(/^[+]?[0-9][0-9\s-]{7,18}$/, "Please enter a valid mobile number"),
  attendance: z.enum(["yes", "no", "maybe"]),
  guests: z.coerce.number().int().min(1).max(5).default(1),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

const DEFAULT_STATS: RsvpStats = {
  total: 0,
  attending: 0,
  guests: 0,
  maybe: 0,
};

async function getStats(): Promise<RsvpStats> {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      attending: sql<number>`(count(*) filter (where attendance = 'yes'))::int`,
      guests: sql<number>`(coalesce(sum(guests) filter (where attendance = 'yes'), 0))::int`,
      maybe: sql<number>`(count(*) filter (where attendance = 'maybe'))::int`,
    })
    .from(rsvps);
  return row ?? DEFAULT_STATS;
}

export async function GET() {
  try {
    return NextResponse.json({ ok: true, stats: await getStats() });
  } catch (error) {
    console.error("GET /api/rsvp failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not load RSVP stats" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = rsvpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Invalid RSVP details",
        },
        { status: 400 }
      );
    }
    const { name, mobile, attendance, guests, message } = parsed.data;
    await db.insert(rsvps).values({
      name,
      mobile,
      attendance,
      guests,
      message: message ? message : null,
    });

    // Send notification to FormSubmit API
    const recipient =
      process.env.RSVP_EMAIL ||
      process.env.BLESSINGS_EMAIL ||
      process.env.WEDDING_EMAIL ||
      "deepuku.0212@gmail.com";

    const attendanceLabel =
      attendance === "yes"
        ? "Joyfully Attending ✅"
        : attendance === "no"
        ? "Regretfully Declining ❌"
        : "Will Confirm Later ⏳";

    try {
      const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Guest_Name: name,
          Phone_Number: mobile,
          Attendance_Status: attendanceLabel,
          Total_Guests: guests,
          Note_From_Guest: message || "No message provided",
          Occasion: "Deepak & Ayusha Wedding (09 Dec 2026)",
          _subject: `💌 New RSVP from ${name} (${attendance.toUpperCase()}) — Deepak & Ayusha Wedding`,
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!formSubmitRes.ok) {
        const errorText = await formSubmitRes.text();
        console.warn(
          "[FormSubmit RSVP] API responded with:",
          formSubmitRes.status,
          errorText
        );
      }
    } catch (apiErr) {
      console.error("[FormSubmit RSVP] Error calling FormSubmit API:", apiErr);
    }

    return NextResponse.json(
      { ok: true, stats: await getStats() },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/rsvp failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not save your RSVP right now" },
      { status: 500 }
    );
  }
}
