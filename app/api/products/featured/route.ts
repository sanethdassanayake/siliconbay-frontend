export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/featured`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    return Response.json(data);

  } catch (error) {
    return new Response("Failed to fetch featured products", { status: 500 });
  }
}
