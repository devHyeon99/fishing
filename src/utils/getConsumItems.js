let consumItems = null;

const getConsumItems = async () => {
  if (consumItems) {
    return consumItems;
  }

  try {
    const response = await fetch('/.netlify/functions/get-data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    consumItems = result.find((item) => item.category === 'consume');

    return consumItems;
  } catch (error) {
    console.error('Error fetching items:', error);
    return null;
  }
};

export default getConsumItems;
