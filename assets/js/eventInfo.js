document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const eventNumber = urlParams.get('eventNumber');
    const baseUrl = 'https://uyocreator-backend.vercel.app';
  
    // Fetch event data
    fetch(`${baseUrl}/api/events/reserve/${eventNumber}`)
      .then(response => response.json())
      .then(data => {
        const event = data.data;
        const eventId = event._id;
  
        // Update event title
        document.title = event.title;
        document.getElementById('event-title').innerText = event.title;
        document.getElementById('title').innerText = event.title;
  
        // Update event image
        document.getElementById('event-image').src = event.image;
  
        // Update event details
        document.getElementById('event-theme').innerText = event.theme;
        document.getElementById('event-description').innerText = event.description;
        document.getElementById('event-date').innerText = new Date(event.startDate).toDateString();
        document.getElementById('event-time').innerText = new Date(event.startDate).toLocaleTimeString();
        document.getElementById('event-entry').innerText = event.isFree ? 'Free' : `₦${event.price || 'N/A'}`;
        document.getElementById('event-status').innerText = event.status;
  
        // Update speakers
        const speakersGrid = document.getElementById('speakers-grid');
        event.speakers.forEach(speaker => {
          const speakerCard = document.createElement('div');
          speakerCard.className = 'people-card';
          speakerCard.innerHTML = `
            <img src="${speaker.photo}" alt="${speaker.name}" width="70" height="70" style="border-radius: 50%;">
            <h5>${speaker.name}</h5>
            <p>${speaker.topic}</p>
          `;
          speakersGrid.appendChild(speakerCard);
        });
  
        // Toggle speakers section
        if (event.displaySpeakers) {
          document.getElementById('speakers-section').classList.add('show');
        } else {
          document.getElementById('speakers-section').classList.add('hide');
        }
  
        // Update agenda
        const agendaDay = document.getElementById('agenda-day');
        event.agenda.forEach(agenda => {
          const agendaHtml = document.createElement('div');
          agendaHtml.className = 'agenda-day';
          agendaHtml.innerHTML = `
            <h5>Day ${agenda.day}</h5>
            <ul>
              ${agenda.activities.map(activity => `
                <li class="agenda-item">
                  <span class="time">${activity.time}</span>
                  <span class="activity">${activity.title}</span>
                  <span class="duration">${activity.duration}</span>
                </li>
              `).join('')}
            </ul>
          `;
          agendaDay.appendChild(agendaHtml);
        });
  
        // Toggle agenda section
        if (event.displayAgenda) {
          document.getElementById('agenda-section').classList.add('show');
        } else {
          document.getElementById('agenda-section').classList.add('hide');
        }
  
        // Update organizers
        const organizersGrid = document.getElementById('organizers-grid');
        event.organizers.forEach(organizer => {
          const organizerCard = document.createElement('div');
          organizerCard.className = 'people-card';
          organizerCard.innerHTML = `
            <img src="${organizer.userId.avatar}" alt="${organizer.userId.name}" width="70" height="70" style="border-radius: 50%;">
            <h5>${organizer.userId.name}</h5>
            <p>${organizer.role}</p>
          `;
          organizersGrid.appendChild(organizerCard);
        });
  
        // Toggle organizers section
        if (event.displayOrganizers) {
          document.getElementById('organizers-section').classList.add('show');
        } else {
          document.getElementById('organizers-section').classList.add('hide');
        }
  
        // Update volunteers
        const volunteersGrid = document.getElementById('volunteers-grid');
        event.volunteers.forEach(volunteer => {
          const volunteerCard = document.createElement('div');
          volunteerCard.className = 'people-card';
          volunteerCard.innerHTML = `
            <img src="${volunteer.userId.avatar}" alt="${volunteer.userId.name}" width="70" height="70" style="border-radius: 50%;">
            <h5>${volunteer.userId.name}</h5>
            <p>${volunteer.department}</p>
          `;
          volunteersGrid.appendChild(volunteerCard);
        });
  
        // Toggle volunteers section
        if (event.displayVolunteers) {
          document.getElementById('volunteers-section').classList.add('show');
        } else {
          document.getElementById('volunteers-section').classList.add('hide');
        }
  
            // Update attendees
            const attendeesGrid = document.getElementById('attendees');
            event.attendees.slice(0, 100).forEach(attendee => {
              const attendeeAvatar = document.createElement('div');
              attendeeAvatar.className = 'circle-avatar';
              const attendeeImg = attendee.userId.avatar || '/assets/images/default-avatar.jpg';
              attendeeAvatar.innerHTML = `<img src="${attendeeImg}" alt="${attendee.userId.name}">`;
              attendeesGrid.appendChild(attendeeAvatar);
            });
            document.getElementById('total-attendees').innerText = `Total Registered Attendees: ${event.attendees.length}`;
      
            // Update sponsors
            const sponsorsSlider = document.getElementById('sponsors-slider');
            event.sponsors.forEach(sponsor => {
              const sponsorLogo = document.createElement('div');
              sponsorLogo.className = 'sponsor';
              sponsorLogo.innerHTML = `
                <img src="${sponsor.logoUrl}" alt="${sponsor.company}" class="sponsor-logo">
                <p class="sponsor-name">${sponsor.company}</p>
              `;
              sponsorsSlider.appendChild(sponsorLogo);
            });
      
            // Booking button functionality
            const bookButton = document.getElementById('get-ticket-btn');
            bookButton.addEventListener('click', () => {
              // Redirect to booking page or display booking modal
              // Replace with your booking logic
              console.log('Book ticket button clicked!');
            });
          })
          .catch(error => {
            console.error('Error fetching event data:', error);
          });
      });




    /// EVENT BOOKING

    document.addEventListener('DOMContentLoaded', () => {
        // Get the booking button
        const bookButton = document.getElementById('get-ticket-btn');
      
        // Save eventId from the response
        let eventId;
        const baseurl = 'https://uyocreator-backend.vercel.app';
        const urlParams = new URLSearchParams(window.location.search);
        const eventNumber = urlParams.get('eventNumber');
      
        fetch(`${baseurl}/api/events/reserve/${eventNumber}`)
          .then(response => response.json())
          .then(data => {
            const event = data.data;
            eventId = event._id; // Save eventId here
      
            // Booking button functionality
            bookButton.addEventListener('click', () => {
              bookEvent(eventId);
            });
          });
      
        // Function to handle event booking
        async function bookEvent(eventId) {
          const baseUrl = 'https://uyocreator-backend.vercel.app/api'; 
          const userId = sessionStorage.getItem('userId');
          const token = sessionStorage.getItem('token');
      
          if (!userId || !token) {
            alert('You must be logged in to book an event');
            window.location.href = 'pages/auth.html'; 
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
      
            clearInterval(loaderInterval);
            bookButton.textContent = 'Booked';  
            bookButton.disabled = true;  
            alert('Event booked successfully!');
      
          } catch (error) {
            console.error('Error booking attendee:', error);
      
            clearInterval(loaderInterval);
            bookButton.textContent = 'Get Ticket';  
            bookButton.disabled = false;  
      
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
            throw new Error(errorData.message || 'Something went wrong');
          }
          return await response.json();
        }
      });