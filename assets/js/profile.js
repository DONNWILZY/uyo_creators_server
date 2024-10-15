window.addEventListener('load', function() {
    // Create a router object
    const routes = {
        '/dashboard.html': checkLogin,
        // Add more routes as needed
    };

    // Check login function
    function checkLogin() {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');

        if (!token || !userId) {
            // Store current URL in session storage
            sessionStorage.setItem('redirectUrl', window.location.pathname);
            
            // Redirect to login page
            window.location.href = 'pages/auth.html';
        }
    }

    // Call checkLogin function immediately
    checkLogin();
});

// Function for anchor tag logout button
function logout() {
    sessionStorage.clear();
    window.location.href = 'pages/auth.html';
}

// Function for icon logout button
function logoutIcon() {
    sessionStorage.clear();
    window.location.href = 'pages/auth.html';
}


document.addEventListener('DOMContentLoaded', async () => {
    const userId = sessionStorage.getItem('userId');  // Get the stored userId from sessionStorage
    const baseUrl = 'https://uyocreator-backend.vercel.app/api';  // Replace this with the actual base URL of your API

    try {
        // Fetch user data from the API
        const response = await fetch(`${baseUrl}/users/single/${userId}`);
        const data = await handleApiError(response);

        // Destructure data for easy access
        const { avatar, name, description, isUserVerified, isMember } = data;

        // Update avatar image
        const avatarElement = document.querySelector('.image-container img');
        avatarElement.src = avatar;  // Update the avatar image source

        // Update the user's name
        const nameElement = document.querySelector('.card-title');
        nameElement.textContent = `Hi, ${name}`;

        const nameElement2 = document.querySelector('.myName');
        nameElement.textContent = name;

        // Update the user's description
        const descriptionElement = document.querySelector('.card-body h6');
        descriptionElement.textContent = description || 'Digital Creator';  // Default to 'Digital Creator' if not available

        // Update the user's badges (verification and membership)
        const verificationBadge = document.querySelector('.badge-verification');
        const membershipBadge = document.querySelector('.badge-membership');

        if (isUserVerified) {
            verificationBadge.style.display = 'inline';  // Show verified badge
        } else {
            verificationBadge.style.display = 'none';  // Hide verified badge
        }

        if (isMember) {
            membershipBadge.style.display = 'inline';  // Show membership badge
        } else {
            membershipBadge.style.display = 'none';  // Hide membership badge
        }

        // Update brand and social media (keeping default values for now)
        document.querySelector('.card-body p:nth-child(5)').textContent = 'Brand Name: N/A';  // Not available yet
        document.querySelector('.card-body p:nth-child(6)').textContent = 'An Entrepreneur';  // Not available yet
        document.querySelector('.card-body p:nth-child(7)').textContent = 'Social Media: N/A';  // Not available yet

    } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle errors (you could show a message in the UI here)
    }
});



// view booked event for a User
document.addEventListener('DOMContentLoaded', async () => {
    const userId = sessionStorage.getItem('userId');
    const baseUrl = 'https://uyocreator-backend.vercel.app/api';  // Replace with your actual API base URL

    try {
        const response = await fetch(`${baseUrl}/events/user/${userId}`);
        const data = await handleApiError(response);

        const eventListContainer = document.querySelector('.event-list');
        eventListContainer.innerHTML = '';  // Clear previous events if any

        data.data.forEach(event => {
            const { eventNumber, title, startDate, isFree, status } = event;

            // Format date and time
            const eventDate = new Date(startDate);
            const formattedDate = eventDate.toLocaleDateString();
            const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Determine the event price
            const eventPrice = isFree ? 'Free' : `₦${event.amount || 'N/A'}`;

            // Create HTML for the event card
            const eventItem = `
                <div class="event-item">
                    <h3>${title || 'N/A'}</h3>
                    <p>${formattedDate} | ${formattedTime}</p>
                    <span class="event-details">
                        <span class="event-price">${eventPrice}</span>
                        <span class="event-status"> | ${status || 'N/A'}</span>
                    </span>
                    <button class="btn view-details" 
                        data-toggle="modal" 
                        data-target="#eventModal"
                        data-title="${title}" 
                        data-date="${formattedDate}" 
                        data-time="${formattedTime}" 
                        data-status="${status}">
                        View Details
                    </button>
                </div>
            `;

            // Append event card to the event list container
            eventListContainer.insertAdjacentHTML('beforeend', eventItem);
        });

        // Add event listener to handle modal content population
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.currentTarget;

                // Get event details from the button's data attributes
                const title = target.getAttribute('data-title');
                const date = target.getAttribute('data-date');
                const time = target.getAttribute('data-time');
                const status = target.getAttribute('data-status');

                // Set the modal content
                document.getElementById('eventModalLabel').textContent = `Event: ${title || 'N/A'}`;
                document.getElementById('ticket-name').textContent = title || 'N/A';
                document.getElementById('event-date').textContent = date || 'N/A';
                document.getElementById('event-time').textContent = time || 'N/A';
                document.getElementById('ticket-status').textContent = status || 'N/A';
            });
        });

    } catch (error) {
        console.error('Error fetching user events:', error);
        // Handle errors (you can show an error message on the page)
    }
});

// Error handling function for API
async function handleApiError(response) {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }
    return await response.json();
}

