// Testimonials Review System with User Authentication
document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    const testimonialsList = document.getElementById('testimonials-list');
    const reviewFormMessage = document.getElementById('reviewFormMessage');
    
    // Get current user from localStorage (simulated authentication)
    let currentUser = localStorage.getItem('reviewUser');
    
    // Load reviews from localStorage
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    // Render all reviews on page load
    renderReviews();
    
    // Handle review submission
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('reviewName').value.trim();
        const role = document.getElementById('reviewRole').value.trim();
        const rating = document.getElementById('reviewRating').value;
        const message = document.getElementById('reviewMessage').value.trim();
        
        // Simple user identification using name (in production, use proper auth)
        const userId = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
        
        if (!currentUser) {
            currentUser = userId;
            localStorage.setItem('reviewUser', currentUser);
        }
        
        const newReview = {
            id: Date.now(),
            userId: currentUser,
            name: name,
            role: role || 'Customer',
            rating: parseInt(rating),
            message: message,
            date: new Date().toISOString(),
            isOwner: true
        };
        
        reviews.unshift(newReview);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        
        // Reset form
        reviewForm.reset();
        
        // Show success message
        reviewFormMessage.textContent = 'Review submitted successfully!';
        reviewFormMessage.classList.remove('hidden', 'text-red-600');
        reviewFormMessage.classList.add('text-green-600');
        
        setTimeout(() => {
            reviewFormMessage.classList.add('hidden');
        }, 3000);
        
        // Re-render reviews
        renderReviews();
    });
    
    // Render reviews function
    function renderReviews() {
        testimonialsList.innerHTML = '';
        
        if (reviews.length === 0) {
            testimonialsList.innerHTML = '<p class="text-gray-500 text-center col-span-2">No reviews yet. Be the first to review!</p>';
            return;
        }
        
        reviews.forEach(review => {
            const isOwner = review.userId === currentUser;
            const reviewCard = createReviewCard(review, isOwner);
            testimonialsList.appendChild(reviewCard);
        });
    }
    
    // Create review card HTML
    function createReviewCard(review, isOwner) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-[10px] shadow-sm p-6 relative';
        card.dataset.reviewId = review.id;
        
        // Generate star rating
        const stars = generateStars(review.rating);
        
        // Format date
        const date = new Date(review.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-[#06599F] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        ${review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h5 class="font-semibold text-[#1E1E1E]">${review.name}</h5>
                        <p class="text-sm text-gray-600">${review.role}</p>
                    </div>
                </div>
                ${isOwner ? `
                    <div class="flex gap-2">
                        <button onclick="editReview(${review.id})" class="text-[#06599F] hover:text-[#054a85] p-1" title="Edit">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="deleteReview(${review.id})" class="text-red-600 hover:text-red-700 p-1" title="Delete">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                ` : ''}
            </div>
            <div class="flex items-center gap-1 mb-3">
                ${stars}
            </div>
            <p class="text-[#1E1E1E] leading-relaxed">${review.message}</p>
            <p class="text-sm text-gray-500 mt-3">${date}</p>
        `;
        
        return card;
    }
    
    // Generate star rating HTML
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
            } else {
                stars += '<svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
            }
        }
        return stars;
    }
    
    // Edit review function (global scope)
    window.editReview = function(reviewId) {
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return;
        
        // Check if current user is the owner
        if (review.userId !== currentUser) {
            alert('You can only edit your own reviews!');
            return;
        }
        
        // Populate form with existing data
        document.getElementById('reviewName').value = review.name;
        document.getElementById('reviewRole').value = review.role;
        document.getElementById('reviewRating').value = review.rating;
        document.getElementById('reviewMessage').value = review.message;
        
        // Change submit button to update
        const submitBtn = reviewForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Review';
        submitBtn.dataset.editingId = reviewId;
        
        // Scroll to form
        reviewForm.scrollIntoView({ behavior: 'smooth' });
    };
    
    // Delete review function (global scope)
    window.deleteReview = function(reviewId) {
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return;
        
        // Check if current user is the owner
        if (review.userId !== currentUser) {
            alert('You can only delete your own reviews!');
            return;
        }
        
        if (confirm('Are you sure you want to delete this review?')) {
            reviews = reviews.filter(r => r.id !== reviewId);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            renderReviews();
        }
    };
    
    // Handle form submission for both add and edit
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = reviewForm.querySelector('button[type="submit"]');
        const editingId = submitBtn.dataset.editingId;
        
        if (editingId) {
            // Update existing review
            const reviewIndex = reviews.findIndex(r => r.id === parseInt(editingId));
            if (reviewIndex !== -1) {
                const review = reviews[reviewIndex];
                
                // Verify ownership
                if (review.userId !== currentUser) {
                    alert('You can only edit your own reviews!');
                    return;
                }
                
                reviews[reviewIndex] = {
                    ...review,
                    name: document.getElementById('reviewName').value.trim(),
                    role: document.getElementById('reviewRole').value.trim() || 'Customer',
                    rating: parseInt(document.getElementById('reviewRating').value),
                    message: document.getElementById('reviewMessage').value.trim(),
                    date: new Date().toISOString() // Update date
                };
                
                localStorage.setItem('reviews', JSON.stringify(reviews));
                
                // Reset form
                reviewForm.reset();
                submitBtn.textContent = 'Submit Review';
                delete submitBtn.dataset.editingId;
                
                // Show success message
                reviewFormMessage.textContent = 'Review updated successfully!';
                reviewFormMessage.classList.remove('hidden', 'text-red-600');
                reviewFormMessage.classList.add('text-green-600');
                
                setTimeout(() => {
                    reviewFormMessage.classList.add('hidden');
                }, 3000);
                
                renderReviews();
            }
        } else {
            // Add new review (existing logic)
            const name = document.getElementById('reviewName').value.trim();
            const role = document.getElementById('reviewRole').value.trim();
            const rating = document.getElementById('reviewRating').value;
            const message = document.getElementById('reviewMessage').value.trim();
            
            const userId = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
            
            if (!currentUser) {
                currentUser = userId;
                localStorage.setItem('reviewUser', currentUser);
            }
            
            const newReview = {
                id: Date.now(),
                userId: currentUser,
                name: name,
                role: role || 'Customer',
                rating: parseInt(rating),
                message: message,
                date: new Date().toISOString(),
                isOwner: true
            };
            
            reviews.unshift(newReview);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            
            reviewForm.reset();
            
            reviewFormMessage.textContent = 'Review submitted successfully!';
            reviewFormMessage.classList.remove('hidden', 'text-red-600');
            reviewFormMessage.classList.add('text-green-600');
            
            setTimeout(() => {
                reviewFormMessage.classList.add('hidden');
            }, 3000);
            
            renderReviews();
        }
    });
    
    // Add logout button functionality (for testing)
    function addLogoutButton() {
        const header = document.querySelector('nav .container');
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'text-sm text-gray-600 hover:text-[#06599F] ml-4';
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = function() {
            localStorage.removeItem('reviewUser');
            currentUser = null;
            alert('Logged out successfully!');
            renderReviews();
        };
        header.appendChild(logoutBtn);
    }
    
    // Uncomment below to add logout button for testing
    // addLogoutButton();
});
