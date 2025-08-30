// API route for YouTube uploads
export async function POST(request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return Response.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Call your backend
    const backendResponse = await fetch(`http://localhost:3000/upload/ytube?url=${encodeURIComponent(url)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend error: ${errorText}`);
    }

    const result = await backendResponse.json();
    return Response.json(result);

  } catch (error) {
    console.error('YouTube upload error:', error);
    return Response.json({ error: 'YouTube indexing failed' }, { status: 500 });
  }
}
