// setUser.js
import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

export async function handler(event, context) {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const userCollection = database.collection('user-data');

    // 삽입할 데이터
    const data = JSON.parse(event.body);
    await userCollection.updateOne(
      { 'user.idx': data.userIdx },
      { $set: { 'user.$.coin': data.coin } }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data inserted successfully' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.toString() }),
    };
  }
}
