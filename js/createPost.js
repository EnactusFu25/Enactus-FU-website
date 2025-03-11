const API_URL = "https://enactus-fu-website.onrender.com/article"; 

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert('Please log in first');
        // Redirect user to login page
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Create new post
function createPost() {
    if (!checkAuth()) return;

    const content = document.getElementById('postContent').value;
    const imageInput = document.getElementById('postImage');
    const postsContainer = document.getElementById('postsContainer');

    if (content.trim() === '' && imageInput.files.length === 0) {
        alert('Please enter content or select an image.');
        return;
    }

    const formData = new FormData();
    if (content.trim() !== '') {
        formData.append('content', content);
    }
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Posting...';
    postsContainer.prepend(loadingIndicator);

    fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
            'accesstoken': localStorage.getItem('access_token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Response code: ${response.status}`);
        }
        return response.json();
    })
    .then(postData => {
        postsContainer.removeChild(loadingIndicator);
        
        if (postData.success === false) {
            alert(postData.message || 'Error creating post');
            if (postData.error_msg === "please login first") {
                localStorage.removeItem('access_token');
                window.location.href = 'login.html';
            }
            return;
        }
        
        const postDiv = createPostElement(postData.article);
        postsContainer.prepend(postDiv);

        document.getElementById('postContent').value = '';
        document.getElementById('postImage').value = '';
    })
    .catch(error => {
        postsContainer.removeChild(loadingIndicator);
        console.error('Error creating post:', error);
        alert('Error creating post: ' + error.message);
    });
}

// Edit post
function editPost(postDiv, postData) {
    if (!checkAuth()) return;

    const contentP = postDiv.querySelector('p');

    if (contentP) {
        const textarea = document.createElement('textarea');
        textarea.value = contentP.textContent;
        textarea.className = 'edit-textarea';
        postDiv.replaceChild(textarea, contentP);

        const buttonsDiv = postDiv.querySelector('.buttons');
        const originalButtons = buttonsDiv.innerHTML;

        // Create save and cancel buttons
        buttonsDiv.innerHTML = '';
        
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'save-button';
        buttonsDiv.appendChild(saveButton);
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'cancel-button';
        buttonsDiv.appendChild(cancelButton);

        saveButton.onclick = function() {
            const updatedContent = textarea.value;
            
            if (updatedContent.trim() === '') {
                alert('Content cannot be empty');
                return;
            }

            // Create loading indicator
            const loadingIndicator = document.createElement('span');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.textContent = 'Saving...';
            buttonsDiv.appendChild(loadingIndicator);

            fetch(`${API_URL}/${postData._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'accesstoken': localStorage.getItem('access_token')
                },
                body: JSON.stringify({content: updatedContent})
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Response code: ${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                buttonsDiv.removeChild(loadingIndicator);
                
                if (response.success === false) {
                    alert(response.message || 'Error updating post');
                    if (response.error_msg === "please login first") {
                        localStorage.removeItem('access_token');
                        window.location.href = 'login.html';
                    }
                    return;
                }
                
                contentP.textContent = updatedContent;
                postDiv.replaceChild(contentP, textarea);
                buttonsDiv.innerHTML = originalButtons;
                console.log('Post updated:', response.article);
            })
            .catch(error => {
                buttonsDiv.removeChild(loadingIndicator);
                console.error('Error updating post:', error);
                alert('Error updating post: ' + error.message);
            });
        };

        cancelButton.onclick = function() {
            postDiv.replaceChild(contentP, textarea);
            buttonsDiv.innerHTML = originalButtons;
        };
    }
}

// Delete post
function deletePost(postDiv, postData) {
    if (!checkAuth()) return;
    
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }

    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Deleting...';
    postDiv.appendChild(loadingIndicator);

    fetch(`${API_URL}/${postData._id}`, {
        method: 'DELETE',
        headers: {
            'accesstoken': localStorage.getItem('access_token')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Response code: ${response.status}`);
        }
        return response.json();
    })
    .then(response => {
        postDiv.removeChild(loadingIndicator);
        
        if (response.success === false) {
            alert(response.message || 'Error deleting post');
            if (response.error_msg === "please login first") {
                localStorage.removeItem('access_token');
                window.location.href = 'login.html';
            }
            return;
        }
        
        const postsContainer = document.getElementById('postsContainer');
        postsContainer.removeChild(postDiv);
    })
    .catch(error => {
        postDiv.removeChild(loadingIndicator);
        console.error('Error deleting post:', error);
        alert('Error deleting post: ' + error.message);
    });
}

// Load posts
function loadPosts() {
    const postList = document.getElementById("post-list");
    const postsContainer = document.getElementById("postsContainer");
    
    if (!postList && !postsContainer) return;
    
    const targetElement = postList || postsContainer;
    
    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Loading posts...';
    targetElement.appendChild(loadingIndicator);
    
    // Determine URL based on target element
    // Use different endpoint for public news vs personal posts
    const url = postList ? `${API_URL}/all` : API_URL;
    
    fetch(url, {
        method: 'GET',
        headers: {
            // If postsContainer (personal posts), include auth token
            ...(postsContainer && {'accesstoken': localStorage.getItem('access_token')})
        }
    }) 
    .then(response => {
        if (!response.ok) {
            throw new Error(`Response code: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        targetElement.removeChild(loadingIndicator);
        
        if (data.success === false) {
            if (data.error_msg === "please login first" && postsContainer) {
                localStorage.removeItem('access_token');
                window.location.href = 'login.html';
                return;
            }
            throw new Error(data.message || 'Error retrieving posts');
        }
        
        const articles = data.articles || [];
        targetElement.innerHTML = '';
        
        if (articles.length === 0) {
            const noPostsMsg = document.createElement('p');
            noPostsMsg.className = 'no-posts-message';
            noPostsMsg.textContent = 'No posts to display.';
            targetElement.appendChild(noPostsMsg);
            return;
        }
        
        articles.forEach(post => {
            if (postList) {
                // Display in public list page
                const postCard = document.createElement("div");
                postCard.classList.add("post-card");
                postCard.innerHTML = `
                    <div class="card-body">
                        ${post.image ? `<img src="${post.image.secure_url}" alt="${post.title || 'Post image'}"/>` : ''}
                        ${post.title ? `<h3>${post.title}</h3>` : ''}
                        <p>${post.content || ''}</p>
                        <button class="view-details" onclick="location.href='post.html?id=${post._id}'">View Details</button>
                    </div>
                `;
                postList.appendChild(postCard);
            } else if (postsContainer) {
                // Display in personal posts page
                const postDiv = createPostElement(post);
                postsContainer.appendChild(postDiv);
            }
        });
    })
    .catch(error => {
        targetElement.removeChild(loadingIndicator);
        console.error('Error loading posts:', error);
        
        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Error loading posts: ' + error.message;
        targetElement.appendChild(errorMsg);
    });
}

// Create post element
function createPostElement(postData) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.setAttribute('data-post-id', postData._id);

    // Add date if available
    if (postData.createdAt) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'post-date';
        const postDate = new Date(postData.createdAt);
        dateDiv.textContent = postDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        postDiv.appendChild(dateDiv);
    }

    // Add text content
    if (postData.content) {
        const contentP = document.createElement('p');
        contentP.textContent = postData.content;
        contentP.className = 'post-content';
        postDiv.appendChild(contentP);
    }

    // Add image if available
    if (postData.image && postData.image.secure_url) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'post-image-container';
        
        const image = document.createElement('img');
        image.src = postData.image.secure_url;
        image.alt = 'Post image';
        image.className = 'post-image';
        
        // Add zoom capability on click
        image.onclick = function() {
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            
            const modalImg = document.createElement('img');
            modalImg.src = postData.image.secure_url;
            modal.appendChild(modalImg);
            
            const closeBtn = document.createElement('span');
            closeBtn.className = 'close-modal';
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = function() {
                document.body.removeChild(modal);
            };
            modal.appendChild(closeBtn);
            
            document.body.appendChild(modal);
        };
        
        imageContainer.appendChild(image);
        postDiv.appendChild(imageContainer);
    }

    // Add edit and delete buttons
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

// Login function
function login(email, password) {
    return fetch('https://enactus-fu-website.onrender.com/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('access_token', data.token);
            localStorage.setItem('user_id', data.user._id);
            localStorage.setItem('user_name', data.user.name);
            return true;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    });
}

// Logout function
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    window.location.href = 'login.html';
}

// Function to display specific post details
function loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        window.location.href = 'index.html';
        return;
    }
    
    const postContainer = document.getElementById('post-details');
    if (!postContainer) return;
    
    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Loading post...';
    postContainer.appendChild(loadingIndicator);
    
    fetch(`${API_URL}/${postId}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Response code: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        postContainer.removeChild(loadingIndicator);
        
        if (data.success === false) {
            throw new Error(data.message || 'Error retrieving post');
        }
        
        const post = data.article;
        
        if (!post) {
            throw new Error('Post not found');
        }
        
        postContainer.innerHTML = `
            <div class="post-card single-post">
                <div class="post-header">
                    ${post.title ? `<h2>${post.title}</h2>` : ''}
                    <div class="post-metadata">
                        ${post.createdAt ? `<span class="post-date">Posted on: ${new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}</span>` : ''}
                        ${post.author ? `<span class="post-author">By: ${post.author.name || 'Unknown'}</span>` : ''}
                    </div>
                </div>
                
                ${post.image && post.image.secure_url ? 
                    `<div class="post-image-container">
                        <img src="${post.image.secure_url}" alt="Post image" class="post-image-full" />
                    </div>` : ''}
                
                <div class="post-content">
                    ${post.content || ''}
                </div>
                
                <div class="post-actions">
                    <button onclick="window.history.back()" class="back-button">Back</button>
                </div>
            </div>
        `;
    })
    .catch(error => {
        postContainer.removeChild(loadingIndicator);
        console.error('Error loading post:', error);
        
        postContainer.innerHTML = `
            <div class="error-container">
                <p class="error-message">Error loading post: ${error.message}</p>
                <button onclick="window.history.back()" class="back-button">Back</button>
            </div>
        `;
    });
}

// Check current page and execute appropriate function
function initPage() {
    // Load posts based on page
    if (document.getElementById("post-list") || document.getElementById("postsContainer")) {
        loadPosts();
    }
    
    // Load single post details if on details page
    if (document.getElementById("post-details")) {
        loadSinglePost();
    }
    
    // Set up create post form
    const createPostForm = document.getElementById('create-post-form');
    if (createPostForm) {
        createPostForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createPost();
        });
    }
    
    // Check login status
    const userNavSection = document.getElementById('user-nav-section');
    if (userNavSection) {
        const token = localStorage.getItem('access_token');
        const userName = localStorage.getItem('user_name');
        
        if (token && userName) {
            userNavSection.innerHTML = `
                <span class="welcome-msg">Hello, ${userName}</span>
                <button id="logout-btn" class="logout-button">Logout</button>
            `;
            
            document.getElementById('logout-btn').addEventListener('click', logout);
        } else {
            userNavSection.innerHTML = `
                <button onclick="location.href='login.html'" class="login-button">Login</button>
            `;
        }
    }
}

// Execute function on page load
window.onload = initPage;
