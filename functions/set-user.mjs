// setUser.js
import { MongoClient, ObjectId } from 'mongodb';

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

export async function handler(event, context) {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection('user-data');

    // 삽입할 데이터
    const userData = JSON.parse(event.body);

    // 특정 문서를 찾음
    const document = await collection.findOne({ _id: new ObjectId('66604a549c880b0adf1f3d7c') });

    if (!document) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Document not found' }),
      };
    }

    // 배열에서 가장 높은 idx 값을 찾음
    const maxIdx = document.user.reduce((max, user) => (user.idx > max ? user.idx : max), 0);
    userData.idx = maxIdx + 1;

    // 데이터 업데이트 기존 데이터에 계속 추가하려면 $push 연산자 사용
    const result = await collection.updateOne(
      { _id: new ObjectId('66604a549c880b0adf1f3d7c') },
      { $push: { user: userData } }
    );

    // user-inventory-data에 새로 회원가입한 유저의 기본 인벤토리 데이터 생성
    const inventoryCollection = database.collection('user-inventory-data');
    const inventoryData = {
      userIdx: userData.idx,
      items: [],
    };
    await inventoryCollection.insertOne(inventoryData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data inserted successfully', result }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.toString() }),
    };
  }
}
