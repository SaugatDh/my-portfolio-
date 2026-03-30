import { Pinecone } from '@pinecone-database/pinecone';

let pinecone: Pinecone | null = null;

interface EmbeddingResult {
  values: number[];
}

export const initializeRAG = () => {
  const pineconeApiKey = process.env.PINECONE_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME || 'portfolio-rag';

  if (!pineconeApiKey) {
    console.error('Missing PINECONE_API_KEY');
    return null;
  }

  if (!geminiApiKey) {
    console.error('Missing GEMINI_API_KEY');
    return null;
  }

  // Initialize Pinecone
  pinecone = new Pinecone({
    apiKey: pineconeApiKey,
  });

  console.log('RAG initialized with Pinecone index:', indexName);
  return { pinecone, indexName, geminiApiKey };
};

export const getEmbedding = async (text: string): Promise<number[]> => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiApiKey) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  try {
    // Try gemini-embedding model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: {
          parts: [{ text: text }],
        },
      }),
    });

    const data = await response.json();
    // console.log('Embedding response:', JSON.stringify(data));
    
    if (!response.ok) {
      throw new Error(`Embedding API error: ${response.statusText} - ${JSON.stringify(data)}`);
    }

    const embeddingValues = data.embedding?.values;
    if (!embeddingValues) {
      console.log('No embedding values in response. Full response:', JSON.stringify(data));
      throw new Error('No embedding values in response');
    }
    
    // Truncate to 768 dimensions (Gemini produces 3072, we need 768 for Pinecone)
    const truncatedEmbedding = embeddingValues.slice(0, 768);
    console.log('Embedding length:', truncatedEmbedding.length);
    return truncatedEmbedding;
  } catch (error) {
    console.error('Error getting embedding:', error);
    throw error;
  }
};

export const upsertToPinecone = async (id: string, text: string, metadata: Record<string, any> = {}) => {
  if (!pinecone) {
    initializeRAG();
  }

  const indexName = process.env.PINECONE_INDEX_NAME || 'portfolio-rag';
  
  if (!pinecone) {
    throw new Error('Failed to initialize Pinecone');
  }

  try {
    const embedding = await getEmbedding(text);
    console.log('Embedding type:', typeof embedding, 'Length:', embedding.length);
    
    const records = [
      {
        id,
        values: embedding,
        metadata: {
          text,
          ...metadata,
        },
      },
    ];
    
    console.log('Upserting records, count:', records.length);
    
    const index = pinecone!.index(indexName);
    await index.upsert({ records });

    console.log('Upserted to Pinecone:', id);
    return true;
  } catch (error) {
    console.error('Error upserting to Pinecone:', error);
    throw error;
  }
};

export const queryPinecone = async (query: string, topK: number = 3) => {
  if (!pinecone) {
    initializeRAG();
  }

  const indexName = process.env.PINECONE_INDEX_NAME || 'portfolio-rag';
  
  if (!pinecone) {
    throw new Error('Failed to initialize Pinecone');
  }

  try {
    const queryEmbedding = await getEmbedding(query);
    
    const index = pinecone.index(indexName);
    
    const results = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    } as any);

    return results.matches || [];
  } catch (error) {
    console.error('Error querying Pinecone:', error);
    throw error;
  }
};

export const deleteFromPinecone = async (id: string) => {
  if (!pinecone) {
    initializeRAG();
  }

  const indexName = process.env.PINECONE_INDEX_NAME || 'portfolio-rag';
  
  if (!pinecone) {
    throw new Error('Failed to initialize Pinecone');
  }

  if (!id || typeof id !== 'string' || id.trim() === '') {
    console.log('Skipping delete - empty ID');
    return true;
  }

  try {
    const index = pinecone.index(indexName);
    const ns = index.namespace('');
    await ns.deleteOne(id as any);
    console.log('Deleted from Pinecone:', id);
    return true;
  } catch (error) {
    console.error('Error deleting from Pinecone:', error);
    return false;
  }
};

export const hasRAGConfig = (): boolean => {
  return !!(process.env.PINECONE_API_KEY && process.env.GEMINI_API_KEY);
};

export const deleteAllFromPinecone = async () => {
  const pineconeApiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME || 'portfolio-rag';
  
  if (!pineconeApiKey) {
    throw new Error('Missing PINECONE_API_KEY');
  }

  try {
    console.log('Attempting to delete all vectors from Pinecone');

    if (!pinecone) {
      pinecone = new Pinecone({ apiKey: pineconeApiKey });
    }

    const index = pinecone.index(indexName);
    const ns = index.namespace('');
    
    try {
      await ns.deleteAll({ deleteAll: true } as any);
    } catch (e1) {
      console.log('namespace deleteAll failed, trying REST API...');
      const desc = await pinecone.describeIndex(indexName);
      const host = desc.host;
      
      const response = await fetch(`https://${host}/vectors/delete`, {
        method: 'POST',
        headers: {
          'Api-Key': pineconeApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteAll: true }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pinecone API error: ${response.status} - ${errorText}`);
      }
    }

    console.log('Deleted all vectors from Pinecone');
    return true;
  } catch (error: any) {
    console.error('Error deleting all from Pinecone:', error?.message || error);
    return false;
  }
};