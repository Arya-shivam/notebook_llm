// API route to bridge frontend chat to your backend
export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    // Get the last user message
    const userMessage = messages[messages.length - 1];
    
    if (!userMessage || userMessage.role !== 'user') {
      return new Response('Invalid message format', { status: 400 });
    }

    // Call your backend
    const backendResponse = await fetch('http://localhost:3000/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_query: userMessage.content
      }),
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with status: ${backendResponse.status}`);
    }

    const responseText = await backendResponse.text();

    // Return in the format expected by Vercel AI SDK
    return new Response(responseText, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
