const API_URL = "localhost:3000/article"; 

function createPost() {
    const content = document.getElementById('postContent').value;
    const imageInput = document.getElementById('postImage');
    const postsContainer = document.getElementById('postsContainer');

    if (content.trim() === '' && imageInput.files.length === 0) {
        alert('Please enter some content or select an image.');
        return;
    }

    const formData = new FormData();
    if (content.trim() !== '') {
        formData.append('content', content);
    }
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
            'accesstoken': localStorage.getItem('access_token'),
        }
    })
    .then(response => response.json())
    .then(postData => {
        const postDiv = createPostElement(postData.article);
        postsContainer.appendChild(postDiv);

        document.getElementById('postContent').value = '';
        document.getElementById('postImage').value = '';
    })
    .catch(error => console.error('Error creating post:', error));
}

function editPost(postDiv, postData) {
    const contentP = postDiv.querySelector('p');
    const image = postDiv.querySelector('img');

    if (contentP) {
        const textarea = document.createElement('textarea');
        textarea.value = contentP.textContent;
        postDiv.replaceChild(textarea, contentP);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = function() {
            const updatedContent = textarea.value;
            contentP.textContent = updatedContent;
            postDiv.replaceChild(contentP, textarea);
            postData.content = updatedContent;

            fetch(`${API_URL}/${postData._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {content: postData.content},
            })
            .then(response => response.json())
            .then(updatedPost => {
                console.log('Post updated:', updatedPost.article);
            })
            .catch(error => console.error('Error updating post:', error));

            postDiv.removeChild(saveButton);
        };
        postDiv.appendChild(saveButton);
    }
}

function deletePost(postDiv, postData) {
    fetch(`${API_URL}/${postData._id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            const postsContainer = document.getElementById('postsContainer');
            postsContainer.removeChild(postDiv);
        }
    })
    .catch(error => console.error('Error deleting post:', error));
}

function loadPosts() {
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
}

function createPostElement(postData) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    if (postData.content) {
        const contentP = document.createElement('p');
        contentP.textContent = postData.content;
        postDiv.appendChild(contentP);
    }

    if (postData.image) {
        const image = document.createElement('img');
        image.src = postData.image.secure_url;
        postDiv.appendChild(image);
    }

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    postDiv.appendChild(buttons);

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Edit';
    editButton.onclick = function() {
        editPost(postDiv, postData);
    };
    buttons.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = function() {
        deletePost(postDiv, postData);
    };
    buttons.appendChild(deleteButton);

    return postDiv;
}

window.onload = loadPosts;