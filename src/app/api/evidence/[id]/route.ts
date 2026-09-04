import { NextRequest, NextResponse } from "next/server";
import { getEvidenceById } from "@/lib/evidence/registry";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const record = getEvidenceById(id);

  if (!record) {
    return NextResponse.json(
      { error: `Evidence ID "${id}" not found in curated registry` },
      { status: 404 }
    );
  }

  return NextResponse.json({ evidence: record }, { status: 200 });
}
