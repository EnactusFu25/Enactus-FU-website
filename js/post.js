document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    const postDetailsContainer = document.getElementById("post-details");

    fetch(`localhost:3000/article/${postId}`, {
        method: 'GET'
    }) 
        .then(response => response.json())
        .then(article => {
            // const post = article.find(p => p.id == postId);
            if (article) {
                postDetailsContainer.innerHTML = `
                    <div class="post-card">
                        <img src="${article.Image.secure_url}" alt="${article.title}">
                        <h2>${article.title}</h2>
                        <p>${article.content}</p>
                        <button onclick="window.history.back()">Back</button>
                    </div>
                `;
            } else {
                postDetailsContainer.innerHTML = "<p>Post not found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching posts:", error);
            postDetailsContainer.innerHTML = "<p>Error loading post.</p>";
        });
});
