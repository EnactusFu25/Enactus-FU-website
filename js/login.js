document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Send a POST request to the backend
        fetch('localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to createPost.html if login is successful
                window.location.href = 'createPost.html';
                localStorage.setItem('access_token', data.token);
            } else {
                // Display an error message if login fails
                alert('Invalid username or password');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});