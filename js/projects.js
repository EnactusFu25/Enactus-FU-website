document.addEventListener("DOMContentLoaded", function() {
    if(document.getElementById("post-list")) {
        fetch('projects.json')
        .then(response => response.json())
        .then(projects => {
            const postList = document.getElementById("post-list");
            postList.innerHTML = '';

            projects.forEach(project => {
                const postCard = document.createElement("div");
                postCard.classList.add("post-card");
                postCard.innerHTML = `
                <div class="card-body">
                <img src="${project.image}" alt="${project.title}"/>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <button class="view-details" onclick="location.href='project.html'">View details</button>
                </div>
                `;
                postList.appendChild(postCard);
            });
        })
        .catch(error => console.error('Error:', error));
    }
});