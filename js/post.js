document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
    const postDetailsContainer = document.getElementById("post-details");
    
    // Check if postId exists
    if (!postId) {
        postDetailsContainer.innerHTML = "<p>Error: No article ID provided.</p>";
        return;
    }

    fetch(`https://enactus-fu-website.onrender.com/article/${postId}`, {
        method: 'GET'
    }) 
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Get the article from the response
            const article = data.article || data;
            
            if (article && article.title) {
                // Handle different image property structures
                const imageUrl = article.image?.secure_url || article.Image?.secure_url || '';
                
                postDetailsContainer.innerHTML = `
                    <div class="post-card">
                        <img src="${imageUrl}" alt="${article.title}">
                        <h2>${article.title}</h2>
                        <p>${article.content}</p>
                        <button onclick="window.history.back()">Back</button>
                    </div>
                `;
            } else {
                postDetailsContainer.innerHTML = "<p>Article not found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching article:", error);
            postDetailsContainer.innerHTML = "<p>Error loading article. Please make sure you're using a valid article ID.</p>";
        });
});