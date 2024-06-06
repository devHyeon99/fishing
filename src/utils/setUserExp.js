const setUserExp = async (userIdx, exp) => {
  try {
    const response = await fetch('/.netlify/functions/set-user-exp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIdx, exp }),
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

export default setUserExp;
