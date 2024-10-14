
// if user is logged, else redirect to
document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
});



// Check if user is logged in, the display Dashboard
// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    function checkLogin() {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');

        if (token && userId) {
            // User is logged in
            document.getElementById('dashboard-link').style.display = 'block';
            document.getElementById('login-btn').href = '../dashboard.html';
            document.getElementById('login-btn').children[0].innerText = 'Dashboard';
        } else {
            // User is not logged in
            document.getElementById('dashboard-link').style.display = 'none';
            document.getElementById('login-btn').href = 'pages/auth.html';
            document.getElementById('login-btn').children[0].innerText = 'Login';
        }
    }

    // Call the function on page load
    checkLogin();
});


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





// event display
document.addEventListener('DOMContentLoaded', async () => {
  const baseUrl = 'http://127.0.0.1:5000/api';  // Replace with actual API URL
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');
  
  try {
      // Fetch all events from the API
      const response = await fetch(`${baseUrl}/events`);
      const data = await handleApiError(response);
      
      const eventListContainer = document.getElementById('event-list');
      eventListContainer.innerHTML = '';  // Clear any existing events

      // Loop through each event and create event cards
      data.data.forEach(event => {
          const { title, startDate, isFree, price, description, attendees, _id } = event;
          const eventDate = new Date(startDate).toLocaleDateString();
          const eventTime = new Date(startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const eventPrice = isFree ? 'Free' : `₦${price || 'N/A'}`;

          // Create the event card HTML
          const eventCard = `
              <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div class="event-card h-100" data-bs-toggle="modal" data-bs-target="#eventModal" data-id="${_id}">
                      <img src="${event.image || '/assets/images/default-avatar.jpg'}" alt="Event Image">
                      <div class="card-body">
                          <h5 class="card-title">${title || 'N/A'}</h5>
                          <p class="card-text"><strong>${eventDate} | ${eventTime}</strong></p>
                          <p class="card-text">${description || 'N/A'}</p>
                          <div class="price-section mt-auto">
                              <p class="price">${eventPrice}</p>
                              <button class="btn btn-primary">Get Tickets</button>
                          </div>
                      </div>
                  </div>
              </div>
          `;
          
          // Append event card to the event list container
          eventListContainer.insertAdjacentHTML('beforeend', eventCard);
      });

      // Add event listeners to each "View Details" button
      document.querySelectorAll('.event-card').forEach(card => {
          card.addEventListener('click', (e) => {
              const eventId = card.getAttribute('data-id');
              openEventModal(eventId);  // Function to open modal and populate data
          });
      });

  } catch (error) {
      console.error('Error fetching events:', error);
  }
});

// Function to handle API errors
async function handleApiError(response) {
  if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
  }
  return await response.json();
}


// Populate attendees (Check if attendees exist and are an array)
const attendeeList = document.getElementById('attendee-list');
attendeeList.innerHTML = '';  // Clear existing attendees

if (attendees && Array.isArray(attendees) && attendees.length > 0) {
    // Show only 10 avatars
    const displayedAttendees = attendees.slice(0, 10);
    displayedAttendees.forEach(attendee => {
        const attendeeImg = attendee.userId ? (attendee.userId.avatar || '/assets/images/default-avatar.jpg') : '/assets/images/default-avatar.jpg';
        const attendeeItem = `<div class="circle-avatar"><img src="${attendeeImg}" alt="Attendee"></div>`;
        attendeeList.insertAdjacentHTML('beforeend', attendeeItem);
    });

    // Add a badge for remaining attendees
    const remainingAttendees = attendees.length - 10;
    if (remainingAttendees > 0) {
        const remainingAttendeeBadge = `<div class="circle-avatar badge">${remainingAttendees + '+'}</div>`;
        attendeeList.insertAdjacentHTML('beforeend', remainingAttendeeBadge);
    }
} else {
    attendeeList.innerHTML = '<p>No attendees yet.</p>';
}


// Function to book event// Function to handle event booking
async function bookEvent(eventId) {
    const baseUrl = 'http://127.0.0.1:5000/api';  // Update to your base URL
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    if (!userId || !token) {
        alert('You must be logged in to book an event');
        window.location.href = './auth.html'; // Redirect to login page if not logged in
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/events/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ eventId, userId })
        });

        const data = await handleApiError(response);

        // Success: Update the button and show success message
        document.getElementById(`book-btn-${eventId}`).textContent = 'Booked';  // Change the button text to "Booked"
        document.getElementById(`book-btn-${eventId}`).disabled = true;  // Disable the button to prevent further booking
        alert('Event booked successfully!');

    } catch (error) {
        console.error('Error booking attendee:', error);

        // Catch known error types returned by the backend
        if (error.message === 'You have already booked for this event') {
            // Update the button to show "Booked" and prevent further bookings
            alert('You have already booked for this event.');
            const bookButton = document.getElementById(`book-btn-${eventId}`);
            if (bookButton) {
                bookButton.textContent = 'Booked';  // Update button text to "Booked"
                bookButton.disabled = true;  // Disable the button
            }
        } else if (error.message === 'Event is fully booked') {
            alert('This event is fully booked.');
        } else {
            alert('Error booking the event. Please try again later.');
        }
    }
}

// Function to handle API errors and return actual error messages
async function handleApiError(response) {
    if (!response.ok) {
        const errorData = await response.json();
        // Here we throw the actual error message returned by the backend
        throw new Error(errorData.message || 'Something went wrong');
    }
    return await response.json();
}

// // Function to handle API errors
// async function handleApiError(response) {
//     if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Something went wrong');
//     }
//     return await response.json();
// }

// Event listener for modal opening
document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', function () {
        const eventId = this.dataset.eventId;  // Retrieve the event ID from data attribute
        openEventModal(eventId);
    });
});



