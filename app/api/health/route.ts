import { NextResponse } from "next/server";
export async function GET(){return NextResponse.json({ok:true,service:"white-label-os",demoMode:process.env.NEXT_PUBLIC_DEMO_MODE!=="false"})}
