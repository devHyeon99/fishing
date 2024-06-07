import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

export async function handler(event, context) {
  try {
    // event.body에서 userIdx를 가져옵니다.
    const body = JSON.parse(event.body);
    const userIdx = body.userIdx;

    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection('user-collection-data');

    // userIdx를 사용하여 해당 유저의 컬렉션 데이터를 찾습니다.
    const userCollection = await collection.findOne({ userIdx: userIdx });

    return {
      statusCode: 200,
      body: JSON.stringify(userCollection),
    };
  } catch (error) {
    console.error(`Error name: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    console.error(`Stack trace: ${error.stack}`);
    return { statusCode: 500, body: error.toString() };
  }
}
