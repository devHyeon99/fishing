const setUserLevel = async (userIdx, level) => {
  try {
    const response = await fetch('/.netlify/functions/set-user-level', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIdx, level }),
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

export default setUserLevel;
