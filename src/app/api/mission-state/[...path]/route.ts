import { NextRequest, NextResponse } from "next/server";

const MISSION_STATE_API_URL =
  process.env.MISSION_STATE_API_URL || "http://localhost:18829";
const API_TOKEN = process.env.MISSION_STATE_API_TOKEN || process.env.OPENCLAW_API_TOKEN || "";

function apiHeaders(): HeadersInit {
  const h: HeadersInit = { "Content-Type": "application/json" };
  if (API_TOKEN) h["Authorization"] = `Bearer ${API_TOKEN}`;
  return h;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = params.path.join("/");
  const url = `${MISSION_STATE_API_URL}/api/state/${filePath}`;

  try {
    const res = await fetch(url, { headers: apiHeaders() });
    if (!res.ok) {
      return NextResponse.json(
        { error: `API returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(`[mission-state] GET ${filePath} failed:`, err);
    return NextResponse.json(
      { error: `API unreachable: ${String(err)}` },
      { status: 502 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = params.path.join("/");
  const url = `${MISSION_STATE_API_URL}/api/state/${filePath}`;

  try {
    const body = await request.json();
    const res = await fetch(url, {
      method: "PUT",
      headers: apiHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `API returned ${res.status}` },
        { status: res.status }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[mission-state] PUT ${filePath} failed:`, err);
    return NextResponse.json(
      { error: `API unreachable: ${String(err)}` },
      { status: 502 }
    );
  }
}
