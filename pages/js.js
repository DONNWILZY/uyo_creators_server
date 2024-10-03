// Sidebar Toggle Script
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

// Function to show a section based on the route
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');
    
    // Show the selected section or 404 page if not found
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    } else {
        document.getElementById('404').style.display = 'block';
    }
}

// Function to handle routing based on hash in the URL
function handleRouting() {
    const hash = window.location.hash.substring(1); // Get hash without '#'
    if (hash) {
        showSection(hash);
    } else {
        showSection('home'); // Default to home section
    }
}

// Listen for hash change and page load events
window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);

// Close sidebar on mobile when a link is clicked
function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
        document.getElementById("sidebar").classList.remove("active");
    }
}
