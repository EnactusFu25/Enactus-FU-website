document.addEventListener('DOMContentLoaded', function() {
    // Check for existing auth token
    const token = localStorage.getItem('access_token');
    if (token) {
        // User already logged in, redirect to home page
        window.location.href = 'index.html';
    }

    // Updated selectors to match HTML structure
    const loginForm = document.querySelector('.login form');
    const loginButton = document.querySelector('.input-submit');
    // Add error message element if it doesn't exist in HTML
    let errorMessage = document.getElementById('error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.id = 'error-message';
        errorMessage.style.display = 'none';
        errorMessage.style.color = 'red';
        errorMessage.style.marginTop = '10px';
        loginForm.appendChild(errorMessage);
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide previous error message
        errorMessage.style.display = 'none';
        
        // Show loading indicator
        const originalButtonText = loginButton.value;
        // Modified loading display for input element instead of button
        loginButton.value = 'Logging in...';
        loginButton.disabled = true;
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        fetch('https://enactus-fu-website.onrender.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store auth token
                localStorage.setItem('access_token', data.token);
                
                // Store user data (with safety checks)
                if (data.user) {
                    if (data.user._id) localStorage.setItem('user_id', data.user._id);
                    if (data.user.name) localStorage.setItem('user_name', data.user.name);
                }
                
                // Redirect user to home page
                window.location.href = 'createPost.html';
            } else {
                // Display error message
                errorMessage.textContent = data.message || 'Login failed. Please check your credentials.';
                errorMessage.style.display = 'block';
                
                // Reset login button to original state
                loginButton.value = originalButtonText;
                loginButton.disabled = false;
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            
            // Display error message
            errorMessage.textContent = 'Error connecting to server. Please try again.';
            errorMessage.style.display = 'block';
            
            // Reset login button to original state
            loginButton.value = originalButtonText;
            loginButton.disabled = false;
        });
    });
});
