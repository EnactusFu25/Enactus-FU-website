document.addEventListener("DOMContentLoaded", function() {
    if(document.getElementById("post-list")) {
        fetch('localhost:3000/article', {
            method: 'GET'
        }) 
        .then(response => response.json())
        .then(articles => {
            const postList = document.getElementById("post-list");
            postList.innerHTML = '';

            articles.forEach(post => {
                const postCard = document.createElement("div");
                postCard.classList.add("post-card");
                postCard.innerHTML = `
                <div class="card-body">
                <img src="${post.Image.secure_url}" alt="${post.title}"/>
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button class="view-details" onclick="location.href='post.html?id=${post._id}'">View details</button>
                </div>
                `;
                postList.appendChild(postCard);
            });
        })
        .catch(error => console.error('Error:', error));
    }
});