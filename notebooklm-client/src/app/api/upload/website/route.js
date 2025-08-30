// API route for website uploads
export async function POST(request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return Response.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Call your backend
    const backendResponse = await fetch(`http://localhost:3000/upload/website?url=${encodeURIComponent(url)}`, {
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
    console.error('Website upload error:', error);
    return Response.json({ error: 'Website indexing failed' }, { status: 500 });
  }
}
