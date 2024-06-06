const setUserCoin = async (userIdx, coin) => {
  try {
    const response = await fetch('/.netlify/functions/set-user-coin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIdx, coin }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error setting user:', error);
    return null;
  }
};

export default setUserCoin;
