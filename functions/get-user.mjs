import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

export async function handler(event) {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection('user-data');

    // 이벤트 쿼리 문자열에서 userIdx를 가져옵니다.
    const userIdx = event.queryStringParameters && event.queryStringParameters.userIdx;
    let results;

    // idx 주어지면 해당 idx가 포함된 객체 데이터를 가져오고 아니면 전체 데이터를 가져옴.
    if (userIdx) {
      results = await collection
        .aggregate([{ $unwind: '$user' }, { $match: { 'user.idx': parseInt(userIdx) } }])
        .toArray();
    } else {
      results = await collection.find({}).limit(10).toArray();
    }

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
}
