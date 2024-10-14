const baseUrl = 'http://127.0.0.1:5000';

// Define handleApiError to manage API response errors
function handleApiError(response) {
    if (!response.ok) {
        return response.json().then(err => {
            // Return error message or custom handling
            throw new Error(err.message || 'Something went wrong!');
        });
    }
    return response.json();
}



// REGISTER 
document.addEventListener('DOMContentLoaded', () => {
    // REGISTER 
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        // Ensure gender is selected
        const genderElement = document.querySelector('input[name="gender"]:checked');
        if (!genderElement) {
            document.getElementById('signupMessage').innerHTML = `<p class="error">Please select a gender.</p>`;
            return;
        }
        const gender = genderElement.value;

        try {
            const response = await fetch(`${baseUrl}/api/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, gender, password })
            });

            const data = await handleApiError(response);
            
            // Show success message
            document.getElementById('signupMessage').innerHTML = `<p class="success">${data.message}</p>`;

            // Store userId in session storage
            sessionStorage.setItem('signupUserId', data.data._id);

           // Redirect to OTP verification page
            showPage('otp');

            // Update OTP form with userId
            document.getElementById('userIdForOtp').value = data.data._id;
            
        } catch (error) {
            // Handle errors
            document.getElementById('signupMessage').innerHTML = `<p class="error">${error.message}</p>`;
        }
    });

    // OTP verification logic
    document.getElementById('Signup-otp-Form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = document.getElementById('userIdForOtp').value;
        const otpCode = Array.from(document.querySelectorAll('.otp-input')).map(input => input.value).join('');

        if (otpCode.length !== 6) {
            document.getElementById('otpMessage').innerHTML = `<p class="error">Please enter a valid 6-digit OTP.</p>`;
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/users/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, otpCode })
            });

            const data = await handleApiError(response);

            // Store token and role after successful OTP verification
            localStorage.setItem('userId', data.data._id);
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('role', data.data.role);

            document.getElementById('otpMessage').innerHTML = `<p class="success">${data.message}</p>`;

            // Redirect based on user role
            if (data.data.role === 'Admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }

        } catch (error) {
            document.getElementById('otpMessage').innerHTML = `<p class="error">${error.message}</p>`;
        }
    });

    // Function to get userId from URL parameters
    function getUserIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('userId');  // Returns the userId from the URL
    }

    // Function to toggle between authentication pages
    function showPage(pageId) {
        const pages = document.querySelectorAll('.auth-page');
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }

    // Function to toggle password visibility
    function togglePasswordVisibility(inputId) {
        const inputField = document.getElementById(inputId);
        if (inputField.type === 'password') {
            inputField.type = 'text';
        } else {
            inputField.type = 'password';
        }
    } 
});


// LOGIN
document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    try {
        const response = await fetch(`${baseUrl}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await handleApiError(response);

        // Store user info in session storage
        sessionStorage.setItem('userId', data._id);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.role);

        // Redirect based on user role
        if (data.role === 'Admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }

    } catch (error) {
        // Handle errors
        document.getElementById('signinMessage').innerHTML = `<p class="error">${error.message}</p>`;
    }
});







// Request Otp
document.getElementById('requestOtpBtn').addEventListener('click', async () => {
    const userId = sessionStorage.getItem('userId');
    const email = sessionStorage.getItem('email');

    try {
        const response = await fetch(`${baseUrl}/users/request-email-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, email })
        });
        const data = await handleApiError(response);

        document.getElementById('otpRequestMessage').innerHTML = `<p class="success">${data.message}</p>`;
        
    } catch (error) {
        document.getElementById('otpRequestMessage').innerHTML = `<p class="error">${error.message}</p>`;
    }
});


// FORGOT PASSWORD
document.getElementById('forgotForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('forgotEmail').value;

    try {
        const response = await fetch(`${baseUrl}/users/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await handleApiError(response);

        document.getElementById('forgotMessage').innerHTML = `<p class="success">${data.message}</p>`;

    } catch (error) {
        document.getElementById('forgotMessage').innerHTML = `<p class="error">${error.message}</p>`;
    }
});



// RESET PASSWORD
document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem('userId');
    const otpCode = document.getElementById('otpCode').value;
    const newPassword = document.getElementById('newPassword').value;

    try {
        const response = await fetch(`${baseUrl}/users/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, otpCode, newPassword })
        });
        const data = await handleApiError(response);

        document.getElementById('resetPasswordMessage').innerHTML = `<p class="success">${data.message}</p>`;
        // Redirect to login with pre-filled email and new password
        window.location.href = 'login.html';

    } catch (error) {
        document.getElementById('resetPasswordMessage').innerHTML = `<p class="error">${error.message}</p>`;
    }
});
