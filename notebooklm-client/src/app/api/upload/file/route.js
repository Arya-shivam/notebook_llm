// API route for file uploads
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('document', file);

    // Call your backend
    const backendResponse = await fetch('http://localhost:3000/upload/file', {
      method: 'POST',
      body: backendFormData,
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend error: ${errorText}`);
    }

    const result = await backendResponse.json();
    return Response.json(result);

  } catch (error) {
    console.error('File upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}
