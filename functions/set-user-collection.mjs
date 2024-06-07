import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

export async function handler(event, context) {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection('user-collection-data');

    // 삽입할 데이터
    const data = JSON.parse(event.body);

    await collection.updateOne(
      { userIdx: data.userIdx },
      { $push: { collections: { code: data.code, name: data.name } } }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data updated successfully' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.toString() }),
    };
  }
}
