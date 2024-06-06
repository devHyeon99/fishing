import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

export async function handler(event, context) {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection('user-inventory-data');

    // 삽입할 데이터
    const data = JSON.parse(event.body);

    // 아이템이 이미 존재하는지 확인 및 업데이트
    const updateResult = await collection.updateOne(
      { userIdx: data.userIdx, 'items.code': data.item.code },
      { $inc: { 'items.$.quantity': data.item.quantity } }
    );

    // 아이템이 존재하지 않으면 새 아이템을 추가
    if (updateResult.matchedCount === 0) {
      const newItem = { ...data.item, quantity: 1 };
      await collection.updateOne({ userIdx: data.userIdx }, { $push: { items: newItem } });
    }

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
