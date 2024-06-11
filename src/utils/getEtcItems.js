let etcItems = null;

const getEtcItems = async () => {
  if (etcItems) {
    return etcItems;
  }

  try {
    const response = await fetch('/.netlify/functions/get-data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    etcItems = result.find((item) => item.category === 'etc');
    return etcItems;
  } catch (error) {
    console.error('Error fetching items:', error);
    return null;
  }
};

export default getEtcItems;
