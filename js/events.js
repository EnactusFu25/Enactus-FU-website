document.addEventListener("DOMContentLoaded", function() {
    if(document.getElementById("post-list")) {
        fetch('events.json')
        .then(response => response.json())
        .then(events => {
            const postList = document.getElementById("post-list");
            postList.innerHTML = '';

            events.forEach(event => {
                const postCard = document.createElement("div");
                postCard.classList.add("post-card");
                postCard.innerHTML = `
                <div class="card-body">
                <img src="${event.image}" alt="${event.title}"/>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <button class="view-details" onclick="location.href='event.html'">View details</button>
                </div>
                `;
                postList.appendChild(postCard);
            });
        })
        .catch(error => console.error('Error:', error));
    }
});