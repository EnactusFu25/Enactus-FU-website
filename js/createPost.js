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
    const title = document.getElementById('postTitle').value;
    const imageInput = document.getElementById('postImage');
    const postsContainer = document.getElementById('postsContainer');

    if (content.trim() === '' && imageInput.files.length === 0 && title.trim() === '') {
        alert('Please enter content or select an image.');
        return;
    }

    const formData = new FormData();
    if (title.trim() !== '') {
        formData.append('title', title);
    }
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
        return response.json().catch(e => {
            throw new Error(`Response code: ${response.status}`);
        });
    })
    .then(postData => {
        // Safely remove loading indicator
        try {
            postsContainer.removeChild(loadingIndicator);
        } catch (error) {
            console.warn("Could not remove loading indicator:", error);
        }
        
        // Check if we have article data even if success is false
        if (postData.article) {
            const postDiv = createPostElement(postData.article);
            postsContainer.prepend(postDiv);
            
            document.getElementById('postContent').value = '';
            document.getElementById('postImage').value = '';
            document.getElementById('postTitle').value = '';
            
            // Show success message
            alert('Post created successfully!');
            return;
        }
        
        if (postData.success === false) {
            alert(postData.message || 'Error creating post');
            if (postData.error_msg === "please login first") {
                localStorage.removeItem('access_token');
                window.location.href = 'login.html';
            }
            return;
        }
    })
    .catch(error => {
        // Safely remove loading indicator
        try {
            postsContainer.removeChild(loadingIndicator);
        } catch (error) {
            console.warn("Could not remove loading indicator:", error);
        }
        console.error('Error creating post:', error);
        alert('Error creating post: ' + error.message);
    });
}

// Edit post
function editPost(postDiv, postData) {
    if (!checkAuth()) return;

    const titleH3 = postDiv.querySelector('.post-title');
    const contentP = postDiv.querySelector('.post-content');
    
    // Create form for editing
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    
    // Create title input
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'edit-title';
    titleInput.value = titleH3 ? titleH3.textContent : '';
    editForm.appendChild(titleInput);
    
    // Create content textarea
    const textarea = document.createElement('textarea');
    textarea.className = 'edit-textarea';
    textarea.value = contentP ? contentP.textContent : '';
    editForm.appendChild(textarea);
    
    // Replace content elements with edit form
    if (titleH3) postDiv.removeChild(titleH3);
    if (contentP) postDiv.removeChild(contentP);
    
    // Insert edit form after the date element (if exists)
    const dateDiv = postDiv.querySelector('.post-date');
    if (dateDiv) {
        postDiv.insertBefore(editForm, dateDiv.nextSibling);
    } else {
        postDiv.insertBefore(editForm, postDiv.firstChild);
    }

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
        const updatedTitle = titleInput.value;
        const updatedContent = textarea.value;
        
        if (updatedTitle.trim() === '') {
            alert('Title cannot be empty');
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
            body: JSON.stringify({
                title: updatedTitle,
                content: updatedContent
            })
        })
        .then(response => {
            return response.json().catch(e => {
                throw new Error(`Response code: ${response.status}`);
            });
        })
        .then(response => {
            // Safely remove loading indicator
            try {
                buttonsDiv.removeChild(loadingIndicator);
            } catch (error) {
                console.warn("Could not remove loading indicator:", error);
            }
            
            // Check if we have article data even if success is false
            if (response.article) {
                // Remove edit form
                postDiv.removeChild(editForm);
                
                // Recreate title element
                const newTitleH3 = document.createElement('h3');
                newTitleH3.className = 'post-title';
                newTitleH3.textContent = updatedTitle;
                
                // Recreate content element
                const newContentP = document.createElement('p');
                newContentP.className = 'post-content';
                newContentP.textContent = updatedContent;
                
                // Insert elements in correct order
                if (dateDiv) {
                    postDiv.insertBefore(newContentP, dateDiv.nextSibling);
                    postDiv.insertBefore(newTitleH3, dateDiv);
                } else {
                    postDiv.insertBefore(newContentP, postDiv.firstChild);
                    postDiv.insertBefore(newTitleH3, postDiv.firstChild);
                }
                
                // Restore original buttons
                buttonsDiv.innerHTML = originalButtons;
                
                console.log('Post updated:', response.article);
                return;
            }
            
            if (response.success === false) {
                alert(response.message || 'Error updating post');
                if (response.error_msg === "please login first") {
                    localStorage.removeItem('access_token');
                    window.location.href = 'login.html';
                }
                return;
            }
        })
        .catch(error => {
            // Safely remove loading indicator
            try {
                buttonsDiv.removeChild(loadingIndicator);
            } catch (error) {
                console.warn("Could not remove loading indicator:", error);
            }
            console.error('Error updating post:', error);
            alert('Error updating post: ' + error.message);
        });
    };

    cancelButton.onclick = function() {
        // Remove edit form
        postDiv.removeChild(editForm);
        
        // Recreate original elements
        if (titleH3) {
            const newTitleH3 = document.createElement('h3');
            newTitleH3.className = 'post-title';
            newTitleH3.textContent = titleH3.textContent;
            
            if (dateDiv) {
                postDiv.insertBefore(newTitleH3, dateDiv);
            } else {
                postDiv.insertBefore(newTitleH3, postDiv.firstChild);
            }
        }
        
        if (contentP) {
            const newContentP = document.createElement('p');
            newContentP.className = 'post-content';
            newContentP.textContent = contentP.textContent;
            
            const referenceNode = dateDiv ? dateDiv.nextSibling : postDiv.firstChild;
            postDiv.insertBefore(newContentP, referenceNode);
        }
        
        // Restore original buttons
        buttonsDiv.innerHTML = originalButtons;
    };
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
        return response.json().catch(e => {
            throw new Error(`Response code: ${response.status}`);
        });
    })
    .then(response => {
        // Safely remove loading indicator
        try {
            postDiv.removeChild(loadingIndicator);
        } catch (error) {
            console.warn("Could not remove loading indicator:", error);
        }
        
        if (response.success === false && !response.message?.includes('deleted')) {
            alert(response.message || 'Error deleting post');
            if (response.error_msg === "please login first") {
                localStorage.removeItem('access_token');
                window.location.href = 'login.html';
            }
            return;
        }
        
        const postsContainer = document.getElementById('postsContainer');
        if (postsContainer && postsContainer.contains(postDiv)) {
            postsContainer.removeChild(postDiv);
        }
    })
    .catch(error => {
        // Safely remove loading indicator
        try {
            postDiv.removeChild(loadingIndicator);
        } catch (error) {
            console.warn("Could not remove loading indicator:", error);
        }
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
    
    // Corrected URL patterns based on API testing
    // Try to fetch user's own posts if we're on the create post page
    const token = localStorage.getItem('access_token');
    let url;
    
    if (postList) {
        url = `${API_URL}`; // Public posts endpoint
    } else {
        // For user's posts, use the main endpoint with auth token
        url = API_URL;
    }
    
    fetch(url, {
        method: 'GET',
        headers: {
            ...(token && {'accesstoken': token})
        }
    }) 
    .then(response => {
        return response.json().catch(e => {
            throw new Error(`Response code: ${response.status}`);
        });
    })
    .then(data => {
        // Safely remove loading indicator
        try {
            targetElement.removeChild(loadingIndicator);
        } catch (error) {
            console.warn("Could not remove loading indicator:", error);
        }
        
        // Determine what to do with the data
        let articles = [];
        
        if (data.articles) {
            articles = data.articles;
        } else if (data.article) {
            // Single article in response
            articles = [data.article];
        } else if (Array.isArray(data)) {
            // Direct array of articles
            articles = data;
        }
        
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
                        ${post.image ? `<img src="${post.image.secure_url}" alt="${post.title || 'Post image'}"/>` : 
                          post.Image ? `<img src="${post.Image.secure_url}" alt="${post.title || 'Post image'}"/>` : ''}
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
        // Safely remove loading indicator
        try {
            targetElement.removeChild(loadingIndicator);
        } catch (error) {
            console.warn("Could not remove loading indicator:", error);
        }
        
        console.error('Error loading posts:', error);
        
        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Error loading posts: ' + error.message;
        targetElement.appendChild(errorMsg);
        
        // If we're on the posts creation page, show an empty state to allow creation
        if (postsContainer) {
            const emptyStateMsg = document.createElement('p');
            emptyStateMsg.className = 'empty-state-message';
            emptyStateMsg.textContent = 'You can create new posts above.';
            postsContainer.appendChild(emptyStateMsg);
        }
    });
}

// Create post element
function createPostElement(postData) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.setAttribute('data-post-id', postData._id);

    // Add title if available
    if (postData.title) {
        const titleH3 = document.createElement('h3');
        titleH3.className = 'post-title';
        titleH3.textContent = postData.title;
        postDiv.appendChild(titleH3);
    }

    // Add date if available
    if (postData.createdAt || postData.uploadedAt) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'post-date';
        const postDate = new Date(postData.createdAt || postData.uploadedAt);
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

    // Add image if available - handle both image and Image property names
    const imageData = postData.image || postData.Image;
    if (imageData && imageData.secure_url) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'post-image-container';
        
        const image = document.createElement('img');
        image.src = imageData.secure_url;
        image.alt = 'Post image';
        image.className = 'post-image';
        
        // Add zoom capability on click
        image.onclick = function() {
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            
            const modalImg = document.createElement('img');
            modalImg.src = imageData.secure_url;
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
        return response.json().catch(e => {
            throw new Error(`Response code: ${response.status}`);
        });
    })
    .then(data => {
        // Safely remove loading indicator
        try {
            postContainer.removeChild(loadingIndicator);
        } catch (error) {
            console.warn("Could not remove loading indicator:", error);
        }
        
        if (data.success === false && !data.article) {
            throw new Error(data.message || 'Error retrieving post');
        }
        
        const post = data.article;
        
        if (!post) {
            throw new Error('Post not found');
        }
        
        // Handle both image and Image property names
        const imageData = post.image || post.Image;
        
        postContainer.innerHTML = `
            <div class="post-card single-post">
                <div class="post-header">
                    ${post.title ? `<h2>${post.title}</h2>` : ''}
                    <div class="post-metadata">
                        ${post.createdAt || post.uploadedAt ? 
                          `<span class="post-date">Posted on: ${new Date(post.createdAt || post.uploadedAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}</span>` : ''}
                        ${post.author || post.uploadedBy ? 
                          `<span class="post-author">By: ${(post.author && post.author.name) || post.uploadedBy || 'Unknown'}</span>` : ''}
                    </div>
                </div>
                
                ${imageData && imageData.secure_url ? 
                    `<div class="post-image-container">
                        <img src="${imageData.secure_url}" alt="Post image" class="post-image-full" />
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
        // Safely remove loading indicator
        try {
            postContainer.removeChild(loadingIndicator);
        } catch (error) {
            console.warn("Could not remove loading indicator:", error);
        }
        
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