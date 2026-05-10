import { NextRequest, NextResponse } from "next/server";

const GATEWAY_URL =
  process.env.OPENCLAW_GATEWAY_URL || "http://localhost:18828";
const API_TOKEN = process.env.OPENCLAW_API_TOKEN || "";

function gatewayHeaders(): HeadersInit {
  const h: HeadersInit = { "Content-Type": "application/json" };
  if (API_TOKEN) h["Authorization"] = `Bearer ${API_TOKEN}`;
  return h;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = params.path.join("/");
  const url = `${GATEWAY_URL}/api/workspace/mission-state/${filePath}`;

  try {
    const res = await fetch(url, { headers: gatewayHeaders() });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Gateway returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: `Gateway unreachable: ${String(err)}` },
      { status: 502 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = params.path.join("/");
  const url = `${GATEWAY_URL}/api/workspace/mission-state/${filePath}`;

  try {
    const body = await request.json();
    const res = await fetch(url, {
      method: "PUT",
      headers: gatewayHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Gateway returned ${res.status}` },
        { status: res.status }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: `Gateway unreachable: ${String(err)}` },
      { status: 502 }
    );
  }
}
