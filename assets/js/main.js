


// Wait for the DOM to load // Check if user is logged in, the display Dashboard
document.addEventListener('DOMContentLoaded', function () {
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


// Function to open event modal and populate it with event data
async function openEventModal(eventId) {
    const baseUrl = 'http://127.0.0.1:5000/api';  // Update to actual base URL

    try {
        const response = await fetch(`${baseUrl}/events/${eventId}`);
        const { data: event } = await handleApiError(response);  // Destructure the event data

        // Check if the event has the necessary fields and data
        const { title, image, startDate, endDate, description, isFree, price, attendees } = event;

        // Populate modal fields with event data
        document.getElementById('eventModalLabel').textContent = event.title || 'N/A';
        document.getElementById('event-image').src = image || 'https://picsum.photos/200';
        document.getElementById('date').textContent = `${new Date(startDate).toDateString()}`; //- ${new Date(endDate).toDateString()}
        document.getElementById('event-time').textContent = startDate ? new Date(startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
        document.getElementById('description').textContent = description || 'N/A';
        document.getElementById('venue').textContent = event.venue || 'N/A';
        document.getElementById('event-price').textContent = isFree ? 'Free' : `₦${price || 'N/A'}`;

        // Populate attendees (Check if attendees exist and are an array)
        const attendeeList = document.getElementById('attendee-list');
        attendeeList.innerHTML = '';  // Clear existing attendees
        if (attendees && Array.isArray(attendees) && attendees.length > 0) {
            // Display only 10 avatars
            attendees.slice(0, 10).forEach(attendee => {
                const attendeeImg = attendee.userId ? (attendee.userId.avatar || '/assets/images/default-avatar.jpg') : '/assets/images/default-avatar.jpg';
                const attendeeItem = `<div class="circle-avatar"><img src="${attendeeImg}" alt="image"></div>`;
                attendeeList.insertAdjacentHTML('beforeend', attendeeItem);
            });

            // Display total attendee count
            const totalAttendees = `<div class="attendee-count">${attendees.length} attendees</div>`;
            attendeeList.insertAdjacentHTML('beforeend', totalAttendees);
        } else {
            attendeeList.innerHTML = '<p>No attendees yet.</p>';
        }

        // Handle booking button functionality
        document.getElementById('book-event-btn').onclick = () => bookEvent(eventId);

    } catch (error) {
        console.error('Error fetching event details:', error);
        alert('Failed to load event details. Please try again later.');
    }
}


// Function to handle event booking
async function bookEvent(eventId) {
    const baseUrl = 'http://127.0.0.1:5000/api';  // Update to your base URL
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    const bookButton = document.getElementById('book-event-btn');

    if (!userId || !token) {
        alert('You must be logged in to book an event');
        window.location.href = 'pages/auth.html'; // Redirect to login page if not logged in
        return;
    }

    // Show loader
    bookButton.disabled = true;
    bookButton.textContent = '';

    // Animated loader
    const loaderText = 'Processing';
    let loaderIndex = 0;
    const loaderInterval = setInterval(() => {
        bookButton.textContent = loaderText.slice(0, loaderIndex + 1) + '_';
        loaderIndex = (loaderIndex + 1) % (loaderText.length + 1);
    }, 100);

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
        clearInterval(loaderInterval);
        bookButton.textContent = 'Booked';  
        bookButton.disabled = true;  
        alert('Event booked successfully!');

    } catch (error) {
        console.error('Error booking attendee:', error);

        // Catch known error types returned by the backend
        clearInterval(loaderInterval);
        bookButton.textContent = 'Get Tickets';  // Reset button text
        bookButton.disabled = false;  // Enable the button

        if (error.message === 'You have already booked for this event') {
            alert('You have already booked for this event.');
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



// Event listener for modal opening
document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', function () {
        const eventId = this.dataset.eventId;  // Retrieve the event ID from data attribute
        openEventModal(eventId);
    });
});


//// event for home page
document.addEventListener('DOMContentLoaded', () => {
    // Base URL for API
    const baseUrl = 'http://127.0.0.1:5000/api';
  
    // Event ID
    const eventId = '670ea6e4d629d5e38c1775fc';
  
    // Function to fetch event data
    async function fetchEventData(eventId) {
      try {
        const response = await fetch(`${baseUrl}/events/${eventId}`);
        const data = await handleApiError(response);
        return data.data;
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    }
  
    // Function to handle API errors
    async function handleApiError(response) {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      return await response.json();
    }
  
    // Function to update event details
    function updateEventDetails(event) {
      document.getElementById('event-title').textContent = event.title;
      document.getElementById('event-theme').textContent = event.theme;
      document.getElementById('event-date').textContent = new Date(event.startDate).toLocaleDateString();
      document.getElementById('event-description').textContent = event.description;
      document.getElementById('event-venue').textContent = event.venue || 'N/A';
  
      // Store event number in a variable
      const eventNumber = event.eventNumber;
      console.log('Event Number:', eventNumber);
  
      // Update sponsors
      const sponsorsList = document.getElementById('sponsors-list');
      sponsorsList.innerHTML = '';  // Clear existing sponsors
      event.sponsors.forEach(sponsor => {
        const sponsorDiv = document.createElement('div');
        sponsorDiv.className = 'sponsor';
        sponsorDiv.innerHTML = `
          <img src="${sponsor.logoUrl}" class="img-fluid sponsor-logo" alt="${sponsor.company}">
          <p class="sponsor-name">${sponsor.company}</p>
        `;
        sponsorsList.appendChild(sponsorDiv);
      });
  
      // Attach click event to Get Tickets button
      document.getElementById('book-ticket-btn').addEventListener('click', () => {
        // Redirect to eventinfo.html with event number as query parameter
        const urlParams = new URLSearchParams({
          eventNumber: eventNumber
        });
        window.location.href = `eventinfo.html?${urlParams.toString()}`;
      });
    }
  
    // Fetch event data and update UI
    fetchEventData(eventId).then(event => {
      updateEventDetails(event);
    });
  });