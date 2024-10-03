// Original functions
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
  }
  
  function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => {
      section.style.display = 'none';
    });
  
    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
  
    // Hide the sidebar
    document.getElementById("sidebar").classList.remove("active");
  }

 // Simulate a "not found" route by handling invalid routes
function handleRoute(route) {
    const validRoutes = ['home', 'about', 'contact', 'blog', 'concerts', 'conferences', 'workshops', 'awards'];

    if (validRoutes.includes(route)) {
        showSection(route);
    } else {
        // Redirect to 404.html
        window.location.href = '/pages/404.html';
    }
}

// Use window.location.hash for basic routing
window.onload = function () {
    const hashRoute = window.location.hash.replace('#', '');
    handleRoute(hashRoute || 'home'); // Default to home section if no hash
};
