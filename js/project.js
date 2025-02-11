document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("id");
    const projectDetailsContainer = document.getElementById("post-details");

    fetch("projects.json")
        .then(response => response.json())
        .then(projects => {
            const project = projects.find(p => p.id == projectId);
            if (project) {
                projectDetailsContainer.innerHTML = `
                    <div class="post-card">
                        <img src="${project.image}" alt="${project.title}">
                        <h2>${project.title}</h2>
                        <p>${project.description}</p>
                        <button onclick="window.history.back()">Back</button>
                    </div>
                `;
            } else {
                projectDetailsContainer.innerHTML = "<p>Project not found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching Projects:", error);
            projectDetailsContainer.innerHTML = "<p>Error loading Project.</p>";
        });
});