// Declare Form 
const form = document.querySelector('form');

// Function to handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('button.submit'); // Select the submit button

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Collect form data
        const formData = new FormData(form);

        // Convert FormData to JSON
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        try {
            // Send data to the backend
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful!');
                // Redirect or update UI
                window.location.href = 'home.html'; // Redirect to home page
            } else {
                alert('Registration failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});

// Showing Part2 of Form
function showPart2(option) {
    document.getElementById('second-PM').classList.add('hidden');
    document.getElementById('second-PR').classList.add('hidden');
    document.getElementById('second-HR').classList.add('hidden');
    document.getElementById('second-LOGISTICS').classList.add('hidden');
    document.getElementById('second-MARKETING').classList.add('hidden');
    document.getElementById('second-MEDIA').classList.add('hidden');
    document.getElementById('second-PRESENTATION').classList.add('hidden');
    document.getElementById('second-BACKEND').classList.add('hidden');
    document.getElementById('second-FRONTEND').classList.add('hidden');
    document.getElementById('second-DATA').classList.add('hidden');
    document.getElementById('second-' + option).classList.remove('hidden');

    form.style.minHeight = 'auto';
}

// Next button
function next() {
    document.getElementById('First').classList.add('hidden');
    const selectedOption = document.querySelector('input[name="dep"]:checked').value;
    showPart2(selectedOption);
}

// Back button
function back() {
    document.getElementById('First').classList.remove('hidden');
    document.getElementById('second-PM').classList.add('hidden');
    document.getElementById('second-PR').classList.add('hidden');
    document.getElementById('second-HR').classList.add('hidden');
    document.getElementById('second-LOGISTICS').classList.add('hidden');
    document.getElementById('second-MARKETING').classList.add('hidden');
    document.getElementById('second-MEDIA').classList.add('hidden');
    document.getElementById('second-PRESENTATION').classList.add('hidden');
    document.getElementById('second-BACKEND').classList.add('hidden');
    document.getElementById('second-FRONTEND').classList.add('hidden');
    document.getElementById('second-DATA').classList.add('hidden');

    form.style.minHeight = '1400px';
}


// document.querySelector("form").addEventListener("submit", function (event) {
//     event.preventDefault();
    
//     let formData = new FormData(this);
    
//     fetch("save.php", {
//         method: "POST",
//         body: formData
//     })
//     .then(response => response.text())
//     .then(data => alert(data))
//     .catch(error => console.error("Error:", error));
// });