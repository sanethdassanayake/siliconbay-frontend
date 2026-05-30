import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/verify`;
        
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        // Get text first to avoid crashing if it's not JSON
        const text = await response.text();
        
        try {
            const data = JSON.parse(text);
            return NextResponse.json(data, { status: response.status });
        } catch {
            // If it's not JSON, return the raw text or the status
            return NextResponse.json({ message: text }, { status: response.status });
        }
    } catch (error) {
        console.error("PROXY ERROR:", error); // This will show in your TERMINAL, not browser
        return NextResponse.json({ message: "Proxy could not reach Java" }, { status: 500 });
    }
}