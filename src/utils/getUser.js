let currentUser = null;

const getUser = async (userIdx) => {
  if (userIdx && currentUser && currentUser.idx === userIdx) {
    return currentUser;
  }

  try {
    const response = await fetch(
      userIdx ? `/.netlify/functions/get-user?userIdx=${userIdx}` : '/.netlify/functions/get-user'
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (userIdx) {
      return result[0].user;
    } else {
      return result[0].user;
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    return null;
  }
};

export default getUser;
