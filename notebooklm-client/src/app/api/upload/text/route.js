// API route for text uploads
export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return Response.json({ error: 'No text provided' }, { status: 400 });
    }

    // Call your backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const backendResponse = await fetch(`${API_URL}/upload/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend error: ${errorText}`);
    }

    const result = await backendResponse.json();
    return Response.json(result);

  } catch (error) {
    console.error('Text upload error:', error);
    return Response.json({ error: 'Text indexing failed' }, { status: 500 });
  }
}
