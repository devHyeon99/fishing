const setUserCollection = async (userIdx, code, name) => {
  try {
    const response = await fetch('/.netlify/functions/set-user-collection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIdx, code, name }),
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

export default setUserCollection;
