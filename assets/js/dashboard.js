// Get user data
function getUserData() {
    const userId = sessionStorage.getItem('userId');
    const baseUrl = 'http://127.0.0.1:5000'; // Replace with your base URL
    const apiUrl = `${baseUrl}/api/users/single/${userId}`;
  
    if (!isLoggedIn()) return;
  
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the profile section with user data
        document.querySelector('.card-title').textContent = data.name;
        document.querySelector('h6.card-title').textContent = data.description;
        document.querySelector('.badge-verification').style.display = data.isVerified ? 'block' : 'none';
        document.querySelector('.badge-membership').style.display = data.isMember ? 'block' : 'none';
        document.querySelector('p').textContent = data.brandName;
        document.querySelector('p + p').textContent = data.about;
        document.querySelector('p + p + p').textContent = data.socialMedia;
        document.querySelector('.image-container img').src = data.avatar;
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }
  
  // Call the function to get user data
  getUserData();