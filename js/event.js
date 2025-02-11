document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("id");
    const eventDetailsContainer = document.getElementById("post-details");

    fetch("events.json")
        .then(response => response.json())
        .then(events => {
            const event = events.find(p => p.id == eventId);
            if (event) {
                eventDetailsContainer.innerHTML = `
                    <div class="post-card">
                        <img src="${event.image}" alt="${event.title}">
                        <h2>${event.title}</h2>
                        <p>${event.description}</p>
                        <button onclick="window.history.back()">Back</button>
                    </div>
                `;
            } else {
                eventDetailsContainer.innerHTML = "<p>Event not found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching events:", error);
            eventDetailsContainer.innerHTML = "<p>Error loading event.</p>";
        });
});