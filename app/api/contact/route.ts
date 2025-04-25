export async function POST(req: Request) {
  try {
    await req.json()
    return new Response(JSON.stringify({ message: 'Message sent successfully' }), {
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to send message' }), {
      status: 500,
    })
  }
} 