export async function POST(req: Request) {
  try {
    await req.json()
    return new Response(JSON.stringify({ message: 'Message sent successfully' }), {
      status: 200,
    })
  } catch {
    return new Response(JSON.stringify({ message: 'Failed to send email' }), {
      status: 500,
    })
  }
} 
