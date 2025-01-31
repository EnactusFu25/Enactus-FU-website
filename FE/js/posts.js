document.addEventListener("DOMContentLoaded", function() {
    if(document.getElementById("post-list")) {
        fetch('posts.json')
        .then(response => response.json())
        .then(posts => {
            const postList = document.getElementById("post-list");
            postList.innerHTML = '';

            posts.forEach(post => {
                const postCard = document.createElement("div");
                postCard.classList.add("post-card");
                postCard.innerHTML = `
                <div class="card-body">
                <img src="${post.image}" alt="${post.title}"/>
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <button class="view-details" onclick="location.href='post.html?id=${post.id}'">View details</button>
                </div>
                `;
                postList.appendChild(postCard);
            });
        })
    }
});
