let currentUser = null;

const getUserInventory = async (userIdx) => {
  if (currentUser) {
    return currentUser;
  }
  try {
    const response = await fetch('/.netlify/functions/get-user-inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIdx }), // userIdx를 객체로 전달
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    // quantity가 1 이상인 아이템만 필터링하여 반환
    return result.items.filter((item) => item.quantity > 0);
  } catch (error) {
    console.error('Error fetching items:', error);
    return null;
  }
};

export default getUserInventory;

/* JavaScript의 단축 속성 이름 (Shortened Property Names) 문법 입니다. 이 문법은 ES6 (ECMAScript 2015)에서 도입되었습니다.

만약 객체의 속성 이름과 그 값을 담고 있는 변수의 이름이 같다면, 단축 속성 이름 문법을 사용하여 { userIdx }와 같이 간단하게 작성할 수 있습니다. 이것은 { userIdx: userIdx }와 동일한 의미입니다.
 */
