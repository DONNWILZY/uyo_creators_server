const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('eventId');
const eventNumber = urlParams.get('eventNumber');
const baseurl = 'http://127.0.0.1:5000'

fetch(`${baseurl}/api/events/reserve/${eventNumber}`)
    .then(response => response.json())
    .then(data => {
        const event = data.data;
        const eventId = event._id;
        document.title = event.title;
        document.getElementById('event-title').innerText = event.title;
        document.getElementById('title').innerText = event.title;
        document.getElementById('event-theme').innerText = event.theme;
        document.getElementById('event-description').innerText = event.description;
        document.getElementById('event-date').innerText = new Date(event.startDate).toDateString();
        document.getElementById('event-time').innerText = new Date(event.startDate).toLocaleTimeString();
        document.getElementById('event-entry').innerText = event.isFree ? 'Free' : `₦${event.price || 'N/A'}`;
        document.getElementById('event-status').innerText = event.status;
        document.getElementById('event-image').src = event.image;

        // Speakers
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

        // Agenda
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

        // Organizers
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

        // Volunteers
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

        // Attendees
        // Attendees
        const attendees = document.getElementById('attendees');
        const totalAttendees = document.getElementById('total-attendees');
        attendees.innerHTML = ''; // Clear existing attendees
        event.attendees.slice(0, 100).forEach(attendee => {
            const attendeeAvatar = document.createElement('div');
            attendeeAvatar.className = 'circle-avatar';
            const attendeeImg = attendee.userId.avatar || '/assets/images/default-avatar.jpg';
            attendeeAvatar.innerHTML = `<img src="${attendeeImg}" alt="${attendee.userId.name}">`;
            attendees.appendChild(attendeeAvatar);
        });
        totalAttendees.innerText = `Total Registered Attendees: ${event.attendees.length}`;



        // Sponsors
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
        const bookButton = document.getElementById('book-event-btn');
        bookButton.addEventListener('click', () => {
            bookEvent(eventId); // Pass eventId to bookEvent function
        });
    });





    /// EVENT BOOKING

    document.addEventListener('DOMContentLoaded', () => {
        // Get the booking button
        const bookButton = document.getElementById('get-ticket-btn');
      
        // Save eventId from the response
        let eventId;
        const baseurl = 'http://127.0.0.1:5000';
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
          const baseUrl = 'http://127.0.0.1:5000/api'; 
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