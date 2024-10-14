// auth.js
function redirectIfNotLoggedIn() {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('userId');
  
    if (!token || !role || !userId) {
      window.location.href = 'pages/auth.html';
    }
  }
  
  // Call this function on each page load
  redirectIfNotLoggedIn();