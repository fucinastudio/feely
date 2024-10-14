import { getPrices } from "@/app/api/apiServerActions/priceApiServerAction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = await getPrices();

  if (res.isSuccess) {
    return NextResponse.json(
      { message: "Prices retrieved", prices: res.data },
      { status: 200 }
    );
  }
  return NextResponse.json({ message: res.error }, { status: 400 });
}
