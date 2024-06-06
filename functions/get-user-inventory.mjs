import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

export async function handler(event, context) {
  try {
    // event.body에서 userIdx를 가져옵니다.
    const body = JSON.parse(event.body);
    const userIdx = body.userIdx;

    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection('user-inventory-data');

    // userIdx를 사용하여 해당 유저의 인벤토리 데이터를 찾습니다.
    const userInventory = await collection.findOne({ userIdx: userIdx });

    // 클라이언트 측에서 items 배열을 code 기준으로 정렬합니다.
    if (userInventory && userInventory.items) {
      userInventory.items = userInventory.items.filter((item) => item && item.code);
      userInventory.items.sort((a, b) => a.code.localeCompare(b.code));
    }

    return {
      statusCode: 200,
      body: JSON.stringify(userInventory),
    };
  } catch (error) {
    console.error(`Error name: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    console.error(`Stack trace: ${error.stack}`);
    return { statusCode: 500, body: error.toString() };
  }
}
