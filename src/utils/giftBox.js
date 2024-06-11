const rewards = {
  con01: ['선물 상자 리워드1', '선물 상자 리워드2', '선물 상자 리워드3'],
  con02: ['의문의 보따리 리워드1', '의문의 보따리 리워드2', '의문의 보따리 리워드3'],
};

const giftBox = (code) => {
  const rewardList = rewards[code];
  if (rewardList) {
    const reward = rewardList[Math.floor(Math.random() * rewardList.length)];
    return `${reward}을(를) 획득하셨습니다.`;
  } else {
    return '오류가 발생하였습니다.';
  }
};

export default giftBox;
