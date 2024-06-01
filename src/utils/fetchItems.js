let cachedItems = null;

const fetchItems = async () => {
  if (cachedItems) {
    return cachedItems;
  }

  try {
    const response = await fetch('/.netlify/functions/get-data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    cachedItems = result[0]; // 첫 번째 항목만 사용
    return cachedItems;
  } catch (error) {
    console.error('Error fetching items:', error);
    return null;
  }
};

export default fetchItems;
