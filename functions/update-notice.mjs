import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

async function updateDocument(collectionName, query, update) {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(collectionName);

    // 문서를 찾아서 업데이트
    const result = await collection.updateOne(query, update);

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function handler(event) {
  // 수정할 문서를 찾는 쿼리
  const query = { Notice: '공지사항' };

  // 적용할 업데이트
  const update = { $set: { Notice: 'This is the updated content.' } };

  const result = await updateDocument('Notice', query, update);

  if (result) {
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } else {
    return { statusCode: 500, body: 'Error updating document' };
  }
}
