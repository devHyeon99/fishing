async function updateNotice() {
  const query = { title: 'Important Notice' };
  const update = { $set: { content: 'This is the updated content.' } };

  const response = await fetch('/.netlify/functions/update-notice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, update }),
  });

  if (response.ok) {
    console.log('Notice updated successfully');
  } else {
    console.error('Error updating notice');
  }
}

export default updateNotice;
