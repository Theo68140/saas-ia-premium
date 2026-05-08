import { NextResponse } from "next/server";

type LeadPayload = {
  fullName: string;
  email: string;
  company: string;
  employees?: string;
  goals: string;
  heroVariant?: string;
  source?: string;
};

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as LeadPayload;

    if (!data.fullName || !data.email || !data.company || !data.goals) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const webhookUrl = process.env.LEADS_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          createdAt: new Date().toISOString(),
        }),
      });
    } else {
      console.info("Lead captured (no webhook configured):", {
        email: data.email,
        company: data.company,
        source: data.source,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
