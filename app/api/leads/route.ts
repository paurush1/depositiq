import { NextResponse } from "next/server";

type LeadPayload = {
  productId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  consentTextVersion?: string;
  destinationBank?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LeadPayload;

  if (
    !body.productId ||
    !body.fullName ||
    !body.email ||
    !body.phone ||
    !body.consentTextVersion ||
    !body.destinationBank
  ) {
    return NextResponse.json(
      {
        error: "Missing required lead fields."
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status: "accepted",
    lead: {
      productId: body.productId,
      destinationBank: body.destinationBank,
      consentTextVersion: body.consentTextVersion,
      receivedAt: new Date().toISOString()
    },
    nextStep:
      "Persist the outreach draft and target details, then queue the next follow-up action."
  });
}
