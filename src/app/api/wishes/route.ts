import { NextResponse } from "next/server";
import { z } from "zod";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { wishes } from "@/db/schema";

export const dynamic = "force-dynamic";

const wishSchema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(120),
  message: z
    .string()
    .trim()
    .min(2, "Please write a small wish")
    .max(280, "Wishes are limited to 280 characters"),
});

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(wishes)
      .orderBy(desc(wishes.createdAt))
      .limit(30);
    return NextResponse.json({
      ok: true,
      wishes: rows.map((row) => ({
        id: row.id,
        name: row.name,
        message: row.message,
        createdAt: row.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET /api/wishes failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not load wishes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = wishSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Invalid wish",
        },
        { status: 400 }
      );
    }
    const [row] = await db
      .insert(wishes)
      .values({ name: parsed.data.name, message: parsed.data.message })
      .returning();
    return NextResponse.json(
      {
        ok: true,
        wish: {
          id: row.id,
          name: row.name,
          message: row.message,
          createdAt: row.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/wishes failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not post your wish right now" },
      { status: 500 }
    );
  }
}
