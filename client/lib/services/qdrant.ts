import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY,
});

export async function getCollections() {
  try {
    const result = await client.getCollections();
    console.log('List of collections:', result.collections);
    return result.collections;
  } catch (err) {
    console.error('Could not get collections:', err);
    throw err;
  }
}

export { client as qdrantClient };
