document.addEventListener('DOMContentLoaded', async () => {
    const userId = sessionStorage.getItem('userId');  // Get the stored userId from sessionStorage
    const baseUrl = 'http://127.0.0.1:5000/api';  // Replace this with the actual base URL of your API

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

// Error handling function for API
async function handleApiError(response) {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }
    return await response.json();
}
