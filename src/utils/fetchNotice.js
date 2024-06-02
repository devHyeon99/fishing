let currentNotice = null;

const fetchNotice = async () => {
  if (currentNotice) {
    return currentNotice;
  }

  try {
    const response = await fetch('/.netlify/functions/get-notice');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result[0].Notice;
  } catch (error) {
    console.error('Error fetching items:', error);
    return null;
  }
};

export default fetchNotice;
