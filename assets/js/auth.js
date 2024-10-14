document.addEventListener('DOMContentLoaded', () => {

    const baseUrl = 'http://127.0.0.1:5000'; // Base URL for API

    // Function to handle API errors
    async function handleApiError(response) {
        // Check if the response is not successful
        if (!response.ok) {
            // Try to extract and display the error message from the response
            const errorData = await response.json();
            
            // Throw an error with the actual message coming from the backend (if available)
            throw new Error(errorData.message || 'Something went wrong');
        }
    
        // If everything is okay, return the response data
        return await response.json();
    }
    


   // Handle Sign Up Form Submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    try {
        const response = await fetch(`${baseUrl}/api/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, gender, password })
        });

        const data = await handleApiError(response);

        // Store userId in sessionStorage (data.data._id holds the userId)
        sessionStorage.setItem('userId', data.data._id);

        // Show success message before redirection
        document.getElementById('signupMessage').innerHTML = `<p class="success">${data.message}</p>`;

        // Wait a moment (2 seconds) before showing OTP verification page
        setTimeout(() => {
            showPage('signupOtp');  // Show the OTP form for verification
        }, 2000);

    } catch (error) {
        document.getElementById('signupMessage').innerHTML = `<p class="error">${error.message}</p>`;
    }
});



   // Handle OTP Verification for Signup
document.getElementById('signupOtpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect the OTP code from the inputs (merge the OTP inputs into one string)
    const otpCode = Array.from(document.querySelectorAll('.signup-otp-inputs input')).map(input => input.value).join('');

    // Get the userId from sessionStorage
    const userId = sessionStorage.getItem('userId');



    // Check if userId is available
    if (!userId) {
        document.getElementById('otpMessage').innerHTML = `<p class="error">User ID is missing. Please try again.</p>`;
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/api/users/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, otpCode })
        });

        const data = await handleApiError(response);

        // OTP verified, store userId, token, and role in sessionStorage
        sessionStorage.setItem('userId', data.data._id);
        sessionStorage.setItem('token', data.data.token);
        sessionStorage.setItem('role', data.data.role);

        // Show success message before redirection
        document.getElementById('otpMessage').innerHTML = `<p class="success">OTP Verified. Redirecting...</p>`;

        // Wait a moment (2 seconds) before redirecting
        setTimeout(() => {
            // Redirect based on role (admin or user)
            if (data.data.role === 'Admin') {
                window.location.href = '../admin.html';  // Redirect to admin panel
            } else {
                window.location.href = '../dashboard.html';  // Redirect to user dashboard
            }
        }, 2000);

    } catch (error) {
        document.getElementById('otpMessage').innerHTML = `<p class="error">${error.message}</p>`;
    }
});


// Handle Login Form Submission
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

        // Access the token, userId, and role from the data object
        const { token, _id: userId, role } = data.data;

        // Store token, userId, and role in sessionStorage or localStorage
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('role', role);

        console.log(token, userId, role);

        // Show success message before redirection
        document.getElementById('signinMessage').innerHTML = `<p class="success">Login successful. Redirecting...</p>`;

        // Wait a moment (2 seconds) before redirecting
        setTimeout(() => {
            // Redirect to dashboard or admin based on user role
            window.location.href = role === 'Admin' ? '../admin.html' : '../dashboard.html';
        }, 2000);

    } catch (error) {
        document.getElementById('signinMessage').innerHTML = `<p class="error">${error.message}</p>`;
    }
});



    // Handle Forgot Password Form Submission
    document.getElementById('forgotForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('forgotEmail').value;

        try {
            const response = await fetch(`${baseUrl}/api/users/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await handleApiError(response);

            // Show success message and redirect to OTP verification
            document.getElementById('forgotMessage').innerHTML = `<p class="success">${data.message}</p>`;
            window.location.href = `resetPasswordOtp.html?email=${email}`;

        } catch (error) {
            document.getElementById('forgotMessage').innerHTML = `<p class="error">${error.message}</p>`;
        }
    });

    // Handle OTP Verification for Password Reset
    const resetPasswordOtpForm = document.getElementById('ResetPasswordOtpForm');
    resetPasswordOtpForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const otpCode = Array.from(document.querySelectorAll('.otp-inputs input')).map(input => input.value).join('');
        const email = new URLSearchParams(window.location.search).get('email');

        try {
            const response = await fetch(`${baseUrl}/api/users/verify-reset-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otpCode })
            });

            const data = await handleApiError(response);

            // OTP verified, redirect to set new password
            showPage('newPassword');

        } catch (error) {
            document.getElementById('otpMessage').innerHTML = `<p class="error">${error.message}</p>`;
        }
    });

    // Handle New Password Form Submission
    document.getElementById('newPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('newPasswordInput').value;
        const confirmNewPassword = document.getElementById('confirmNewPasswordInput').value;
        const email = new URLSearchParams(window.location.search).get('email');

        if (newPassword !== confirmNewPassword) {
            document.getElementById('newPasswordMessage').innerHTML = `<p class="error">Passwords do not match.</p>`;
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/users/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            });

            const data = await handleApiError(response);

            // Password reset successful, redirect to sign in
            document.getElementById('newPasswordMessage').innerHTML = `<p class="success">${data.message}</p>`;
            showPage('signin');

        } catch (error) {
            document.getElementById('newPasswordMessage').innerHTML = `<p class="error">${error.message}</p>`;
        }
    });

    // Function to show the appropriate page
    function showPage(pageId) {
        const pages = document.querySelectorAll('.auth-page');
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }

    // Function to handle OTP input auto-move
    function handleOtpInput(inputClass) {
        const otpInputs = document.querySelectorAll(`.${inputClass} input`);
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });
    }

    // Initialize OTP input behavior for forms
    handleOtpInput('otp-inputs');
    handleOtpInput('signup-otp-inputs');

});
