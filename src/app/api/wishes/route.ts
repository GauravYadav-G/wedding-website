import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { wishes } from "@/db/schema";

export const dynamic = "force-dynamic";

const wishSchema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(120),
  message: z
    .string()
    .trim()
    .min(2, "Please write a small blessing")
    .max(500, "Blessings are limited to 500 characters"),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = wishSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Invalid blessing",
        },
        { status: 400 }
      );
    }

    const { name, message } = parsed.data;

    // 1. Save blessing to database so it is never lost
    const [row] = await db
      .insert(wishes)
      .values({ name, message })
      .returning();

    // 2. Send email using FormSubmit API (https://formsubmit.co)
    const recipient =
      process.env.BLESSINGS_EMAIL ||
      process.env.WEDDING_EMAIL ||
      "deepuku.0212@gmail.com";

    try {
      const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Name: name,
          Blessing: message,
          Occasion: "Deepak & Ayusha Wedding (09 Dec 2026)",
          _subject: `🌸 New Wedding Blessing from ${name} for Deepak & Ayusha`,
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!formSubmitRes.ok) {
        const errorText = await formSubmitRes.text();
        console.warn(
          "[FormSubmit] API responded with:",
          formSubmitRes.status,
          errorText
        );
      }
    } catch (apiErr) {
      console.error("[FormSubmit] Error calling FormSubmit API:", apiErr);
    }

    return NextResponse.json(
      {
        ok: true,
        id: row.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/wishes failed", error);
    return NextResponse.json(
      { ok: false, error: "Could not send your blessing right now" },
      { status: 500 }
    );
  }
}
