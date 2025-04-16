document.addEventListener("DOMContentLoaded", function() {
    if(document.getElementById("post-list")) {
        fetch('https://enactus-fu-website.onrender.com/article', {
            method: 'GET'
        }) 
        .then(response => response.json())
        .then(data => {
            const postList = document.getElementById("post-list");
            postList.innerHTML = '';
            
            // Check if data contains an error message
            if(data.message && data.message === "no articles found") {
                // Display a message to the user when there are no articles
                postList.innerHTML = `
                <div class="no-articles">
                    <h3>No Articles Available</h3>
                    <p>No articles were found. Please check back later.</p>
                </div>`;
            } else if(Array.isArray(data)) {
                // If data is directly an array, use it
                displayArticles(data, postList);
            } else if(data.articles && Array.isArray(data.articles)) {
                // If data contains articles array property
                displayArticles(data.articles, postList);
            } else if(data.article) {
                // If data contains a single article object
                displayArticles([data.article], postList);
            } else {
                // In case of an unexpected response
                postList.innerHTML = `
                <div class="error">
                    <h3>Error Loading Data</h3>
                    <p>An error occurred while trying to load articles. Please try again later.</p>
                </div>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Display an error message to the user
            const postList = document.getElementById("post-list");
            postList.innerHTML = `
            <div class="error">
                <h3>Connection Error</h3>
                <p>We couldn't connect to the server. Please check your internet connection and try again.</p>
            </div>`;
        });
    }
    
    // Helper function to display articles
    function displayArticles(articles, container) {
        articles.forEach(post => {
            const postCard = document.createElement("div");
            postCard.classList.add("post-card");
            
            // Handle different image property structures
            const imageUrl = post.image?.secure_url || post.Image?.secure_url || '';
            
            postCard.innerHTML = `
            <div class="card-body">
                <img src="${imageUrl}" alt="${post.title}"/>
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button class="view-details" onclick="location.href='post.html?id=${post._id}'">View details</button>
            </div>
            `;
            container.appendChild(postCard);
        });
    }
});