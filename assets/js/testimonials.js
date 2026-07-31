// Testimonials Review System with User Verification & Moderation
document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    const testimonialsList = document.getElementById('testimonials-list');
    const reviewFormMessage = document.getElementById('reviewFormMessage');
    
    // Admin email (only this email can access admin functions)
    const ADMIN_EMAIL = 'director.movers@gmail.com';
    const ADMIN_PASSWORD = 'Movers@2007';
    
    // Get current verified user from localStorage
    let currentUser = JSON.parse(localStorage.getItem('verifiedUser'));
    
    // Get admin session from localStorage
    let adminSession = JSON.parse(localStorage.getItem('adminSession'));
    
    // Load reviews from localStorage
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    let pendingReviews = []; // No longer using pending reviews, but keeping for compatibility
    
    // Check if current user is admin
    function isAdmin() {
        return adminSession && adminSession.email === ADMIN_EMAIL;
    }
    
    // Render reviews function (show all reviews publicly)
    function renderReviews() {
        testimonialsList.innerHTML = '';
        
        // Show all reviews (no status filter - all reviews are public)
        const allReviews = reviews;
        
        if (allReviews.length === 0) {
            testimonialsList.innerHTML = '<p class="text-gray-500 text-center col-span-2">No reviews yet. Be the first to review!</p>';
            return;
        }
        
        allReviews.forEach(review => {
            const isAdminUser = isAdmin();
            const reviewCard = createReviewCard(review, isAdminUser);
            testimonialsList.appendChild(reviewCard);
        });
    }
    
    // Render all reviews on page load (all reviews are public)
    renderReviews();
    
    // Show appropriate UI based on user/admin status
    if (currentUser) {
        showReviewForm(); // Show review form immediately if user is already verified
    } else {
        showVerificationForm(); // Show verification form if user is not verified
    }
    
    // Show admin login button or admin controls
    renderAdminUI();
    
    // Render admin UI based on session
    function renderAdminUI() {
        // Remove existing admin container
        const existingAdmin = document.querySelector('.admin-controls-container');
        if (existingAdmin) {
            existingAdmin.remove();
        }
        
        const adminContainer = document.createElement('div');
        adminContainer.className = 'admin-controls-container fixed bottom-[120px] right-8 flex flex-col gap-2 z-50';
        
        if (adminSession && adminSession.email === ADMIN_EMAIL) {
            // Admin is logged in - show admin controls
            const clearBtn = document.createElement('button');
            clearBtn.className = 'bg-red-600 text-white px-4 py-2 rounded text-sm';
            clearBtn.textContent = 'Clear All Data';
            clearBtn.onclick = window.clearAllReviews;
            
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'bg-gray-600 text-white px-4 py-2 rounded text-sm';
            logoutBtn.textContent = 'Admin Logout';
            logoutBtn.onclick = adminLogout;
            
            adminContainer.appendChild(clearBtn);
            adminContainer.appendChild(logoutBtn);
        } else {
            // Admin not logged in - show login button
            const loginBtn = document.createElement('button');
            loginBtn.className = 'bg-gray-800 text-white px-4 py-2 rounded text-sm';
            loginBtn.textContent = 'Admin Login';
            loginBtn.onclick = showAdminLoginForm;
            adminContainer.appendChild(loginBtn);
        }
        
        document.body.appendChild(adminContainer);
    }
    
    // Show admin login form
    function showAdminLoginForm() {
        const loginForm = document.createElement('div');
        loginForm.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]';
        loginForm.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-xl font-semibold mb-4">Admin Login</h3>
                <label class="block mb-3">
                    <span class="text-sm font-medium text-gray-700">Admin Email</span>
                    <input id="adminEmail" type="email" required class="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-[#06599F]" placeholder="Enter admin email">
                </label>
                <label class="block mb-3">
                    <span class="text-sm font-medium text-gray-700">Password</span>
                    <input id="adminPassword" type="password" required class="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-[#06599F]" placeholder="Enter password">
                </label>
                <button id="adminLoginBtn" class="w-full bg-[#06599F] text-white px-4 py-2 rounded-md hover:bg-[#054a85] mb-3">Login</button>
                <button id="closeAdminLogin" class="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <p id="adminLoginMessage" class="hidden text-sm mt-3"></p>
            </div>
        `;
        
        document.body.appendChild(loginForm);
        
        // Admin login with password
        document.getElementById('adminLoginBtn').addEventListener('click', function() {
            const email = document.getElementById('adminEmail').value.trim();
            const password = document.getElementById('adminPassword').value;
            
            if (email !== ADMIN_EMAIL) {
                showAdminLoginMessage('Access denied. Only authorized admin can login.', 'error');
                return;
            }
            
            if (password !== ADMIN_PASSWORD) {
                showAdminLoginMessage('Invalid password. Please try again.', 'error');
                return;
            }
            
            // Successful login
            adminSession = {
                email: email,
                loginAt: new Date().toISOString()
            };
            localStorage.setItem('adminSession', JSON.stringify(adminSession));
            
            showAdminLoginMessage('Admin login successful!', 'success');
            setTimeout(() => {
                loginForm.remove();
                renderAdminUI();
                renderReviews(); // Re-render to show admin delete buttons on all reviews
            }, 1000);
        });
        
        // Close admin login
        document.getElementById('closeAdminLogin').addEventListener('click', function() {
            loginForm.remove();
        });
    }
    
    // Admin logout
    function adminLogout() {
        if (confirm('Are you sure you want to logout as admin?')) {
            localStorage.removeItem('adminSession');
            adminSession = null;
            location.reload(); // Immediate page reload
        }
    }
    
    // Show admin login message
    function showAdminLoginMessage(message, type) {
        const msgEl = document.getElementById('adminLoginMessage');
        msgEl.textContent = message;
        msgEl.classList.remove('hidden', 'text-red-600', 'text-green-600');
        msgEl.classList.add(type === 'error' ? 'text-red-600' : 'text-green-600');
    }
    
    function showVerificationForm() {
        const formContainer = reviewForm.parentElement;
        formContainer.innerHTML = `
            <h4 class="text-xl font-semibold mb-4">Verify Your Identity</h4>
            <p class="text-sm text-gray-600 mb-4">Please verify your email or phone number to submit a genuine review.</p>
            
            <div class="flex flex-col sm:flex-row gap-2 mb-4">
                <button id="emailVerifyBtn" class="flex-1 bg-[#06599F] text-white px-4 py-2 rounded-md hover:bg-[#054a85]">Verify with Email</button>
                <button id="phoneVerifyBtn" class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Verify with Phone</button>
            </div>
            
            <div id="emailVerificationForm" class="hidden">
                <label class="block mb-3">
                    <span class="text-sm font-medium text-gray-700">Email Address</span>
                    <input id="verifyEmail" type="email" required class="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-[#06599F]" placeholder="Enter your email">
                </label>
                <button id="sendEmailOtp" class="w-full bg-[#06599F] text-white px-4 py-2 rounded-md hover:bg-[#054a85]">Send Verification Code</button>
                <div id="emailOtpSection" class="hidden mt-3">
                    <label class="block mb-3">
                        <span class="text-sm font-medium text-gray-700">Verification Code</span>
                        <input id="emailOtp" type="text" required class="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-[#06599F]" placeholder="Enter 6-digit code">
                    </label>
                    <button id="verifyEmailOtp" class="w-full bg-[#06599F] text-white px-4 py-2 rounded-md hover:bg-[#054a85]">Verify & Continue</button>
                </div>
            </div>
            
            <div id="phoneVerificationForm" class="hidden">
                <label class="block mb-3">
                    <span class="text-sm font-medium text-gray-700">Phone Number</span>
                    <input id="verifyPhone" type="tel" required class="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-[#06599F]" placeholder="Enter your phone number">
                </label>
                <button id="sendPhoneOtp" class="w-full bg-[#06599F] text-white px-4 py-2 rounded-md hover:bg-[#054a85]">Send Verification Code</button>
                <div id="phoneOtpSection" class="hidden mt-3">
                    <label class="block mb-3">
                        <span class="text-sm font-medium text-gray-700">Verification Code</span>
                        <input id="phoneOtp" type="text" required class="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-[#06599F]" placeholder="Enter 6-digit code">
                    </label>
                    <button id="verifyPhoneOtp" class="w-full bg-[#06599F] text-white px-4 py-2 rounded-md hover:bg-[#054a85]">Verify & Continue</button>
                </div>
            </div>
            
            <p id="verifyMessage" class="hidden text-sm mt-3"></p>
        `;
        
        // Email verification handlers
        document.getElementById('emailVerifyBtn').addEventListener('click', function() {
            document.getElementById('emailVerificationForm').classList.remove('hidden');
            document.getElementById('phoneVerificationForm').classList.add('hidden');
            this.classList.add('bg-[#06599F]', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            document.getElementById('phoneVerifyBtn').classList.remove('bg-[#06599F]', 'text-white');
            document.getElementById('phoneVerifyBtn').classList.add('bg-gray-200', 'text-gray-700');
        });
        
        document.getElementById('phoneVerifyBtn').addEventListener('click', function() {
            document.getElementById('phoneVerificationForm').classList.remove('hidden');
            document.getElementById('emailVerificationForm').classList.add('hidden');
            this.classList.add('bg-[#06599F]', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            document.getElementById('emailVerifyBtn').classList.remove('bg-[#06599F]', 'text-white');
            document.getElementById('emailVerifyBtn').classList.add('bg-gray-200', 'text-gray-700');
        });
        
        // Send email OTP (simulated)
        document.getElementById('sendEmailOtp').addEventListener('click', function() {
            const email = document.getElementById('verifyEmail').value.trim();
            if (!email || !isValidEmail(email)) {
                showVerifyMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate OTP sending
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            localStorage.setItem('emailOtp', otp);
            localStorage.setItem('emailOtpExpiry', Date.now() + 300000); // 5 minutes
            
            document.getElementById('emailOtpSection').classList.remove('hidden');
            showVerifyMessage(`Verification code: ${otp}`, 'success');
        });
        
        // Verify email OTP
        document.getElementById('verifyEmailOtp').addEventListener('click', function() {
            const enteredOtp = document.getElementById('emailOtp').value.trim();
            const storedOtp = localStorage.getItem('emailOtp');
            const expiry = localStorage.getItem('emailOtpExpiry');
            
            if (Date.now() > expiry) {
                showVerifyMessage('Verification code has expired. Please request a new one.', 'error');
                return;
            }
            
            if (enteredOtp === storedOtp) {
                const email = document.getElementById('verifyEmail').value.trim();
                currentUser = {
                    id: email,
                    type: 'email',
                    verifiedAt: new Date().toISOString()
                };
                localStorage.setItem('verifiedUser', JSON.stringify(currentUser));
                
                // Clear OTP data to force new OTP generation for next login
                localStorage.removeItem('emailOtp');
                localStorage.removeItem('emailOtpExpiry');
                
                showVerifyMessage('Verification successful! Redirecting...', 'success');
                setTimeout(() => location.reload(), 1000); // Reload page after 1 second
            } else {
                showVerifyMessage('Invalid verification code. Please try again.', 'error');
            }
        });
        
        // Send phone OTP (simulated)
        document.getElementById('sendPhoneOtp').addEventListener('click', function() {
            const phone = document.getElementById('verifyPhone').value.trim();
            if (!phone || !isValidPhone(phone)) {
                showVerifyMessage('Please enter a valid phone number', 'error');
                return;
            }
            
            // Simulate OTP sending
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            localStorage.setItem('phoneOtp', otp);
            localStorage.setItem('phoneOtpExpiry', Date.now() + 300000); // 5 minutes
            
            document.getElementById('phoneOtpSection').classList.remove('hidden');
            showVerifyMessage(`Verification code: ${otp}`, 'success');
        });
        
        // Verify phone OTP
        document.getElementById('verifyPhoneOtp').addEventListener('click', function() {
            const enteredOtp = document.getElementById('phoneOtp').value.trim();
            const storedOtp = localStorage.getItem('phoneOtp');
            const expiry = localStorage.getItem('phoneOtpExpiry');
            
            if (Date.now() > expiry) {
                showVerifyMessage('Verification code has expired. Please request a new one.', 'error');
                return;
            }
            
            if (enteredOtp === storedOtp) {
                const phone = document.getElementById('verifyPhone').value.trim();
                currentUser = {
                    id: phone,
                    type: 'phone',
                    verifiedAt: new Date().toISOString()
                };
                localStorage.setItem('verifiedUser', JSON.stringify(currentUser));
                
                // Clear OTP data to force new OTP generation for next login
                localStorage.removeItem('phoneOtp');
                localStorage.removeItem('phoneOtpExpiry');
                
                showVerifyMessage('Verification successful! Redirecting...', 'success');
                setTimeout(() => location.reload(), 1000); // Reload page after 1 second
            } else {
                showVerifyMessage('Invalid verification code. Please try again.', 'error');
            }
        });
    }
    
    // Show review form after verification
    function showReviewForm() {
        const formContainer = reviewForm.parentElement;
        formContainer.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-xl font-semibold">Add a Review</h4>
                <button id="logoutBtn" class="text-sm text-red-600 hover:text-red-700">Logout</button>
            </div>
            <p class="text-sm text-green-600 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                Verified as ${currentUser.type === 'email' ? currentUser.id : 'phone user'}
            </p>
            <form id="reviewForm" class="grid gap-4">
                <div class="grid gap-4 sm:grid-cols-2">
                    <label class="block">
                        <span class="text-sm font-medium text-gray-700">Name</span>
                        <input id="reviewName" type="text" required class="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-[#06599F]" placeholder="Enter your name">
                    </label>
                    <label class="block">
                        <span class="text-sm font-medium text-gray-700">Designation / City</span>
                        <input id="reviewRole" type="text" class="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-[#06599F]" placeholder="Customer role or city">
                    </label>
                </div>
                <label class="block">
                    <span class="text-sm font-medium text-gray-700">Rating</span>
                    <select id="reviewRating" required class="mt-2 w-full rounded border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#06599F]">
                        <option value="">Select rating</option>
                        <option value="5">5 stars</option>
                        <option value="4">4 stars</option>
                        <option value="3">3 stars</option>
                        <option value="2">2 stars</option>
                        <option value="1">1 star</option>
                    </select>
                </label>
                <label class="block">
                    <span class="text-sm font-medium text-gray-700">Your Review</span>
                    <textarea id="reviewMessage" required rows="5" class="mt-2 w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-[#06599F]" placeholder="Write your experience"></textarea>
                </label>
                <button type="submit" class="bg-[#06599F] text-white px-6 py-3 rounded-md hover:bg-[#054a85] transition-colors">Submit Review</button>
                <p id="reviewFormMessage" class="hidden text-sm leading-6"></p>
            </form>
        `;
        
        // Re-attach form handler
        attachFormHandler();
        
        // Logout handler
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('verifiedUser');
            currentUser = null;
            location.reload(); // Immediate page reload
        });
    }
    
    // Attach form handler
    function attachFormHandler() {
        const newForm = document.getElementById('reviewForm');
        if (newForm) {
            newForm.addEventListener('submit', handleReviewSubmit);
        }
    }
    
    // Handle review submission
    function handleReviewSubmit(e) {
        e.preventDefault();
        
        // Rate limiting check
        const lastSubmission = localStorage.getItem('lastReviewSubmission');
        if (lastSubmission && Date.now() - lastSubmission < 60000) { // 1 minute cooldown
            showReviewFormMessage('Please wait before submitting another review.', 'error');
            return;
        }
        
        const name = document.getElementById('reviewName').value.trim();
        const role = document.getElementById('reviewRole').value.trim();
        const rating = document.getElementById('reviewRating').value;
        const message = document.getElementById('reviewMessage').value.trim();
        
        // Validate review content
        if (message.length < 20) {
            showReviewFormMessage('Review must be at least 20 characters long.', 'error');
            return;
        }
        
        if (message.length > 500) {
            showReviewFormMessage('Review must be less than 500 characters.', 'error');
            return;
        }
        
        // Check for spam patterns
        const spamPatterns = [
            /http|www\.|\.com|\.org|\.net/i,
            /buy|sell|cheap|free|discount|offer/i,
            /click here|visit now|check this/i,
            /test|demo|sample|fake/i
        ];
        
        for (let pattern of spamPatterns) {
            if (pattern.test(message)) {
                showReviewFormMessage('Your review contains suspicious content. Please write a genuine review.', 'error');
                return;
            }
        }
        
        const newReview = {
            id: Date.now(),
            userId: currentUser.id,
            name: name,
            role: role || 'Customer',
            rating: parseInt(rating),
            message: message,
            date: new Date().toISOString(),
            status: 'approved', // Reviews are immediately approved for display
            verifiedUser: true
        };
        
        // Add to approved reviews (immediately visible)
        reviews.unshift(newReview);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        
        // Update last submission time
        localStorage.setItem('lastReviewSubmission', Date.now());
        
        // Reset form
        document.getElementById('reviewForm').reset();
        
        // Show success message
        showReviewFormMessage('Review submitted successfully!', 'success');
        
        // Re-render reviews to show the new review
        renderReviews();
        
        setTimeout(() => {
            document.getElementById('reviewFormMessage').classList.add('hidden');
        }, 5000);
    }
    
    // Create review card HTML
    function createReviewCard(review, canDelete, isAdminUser) {
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
                        <h5 class="font-semibold text-[#1E1E1E] flex items-center gap-2">
                            ${review.name}
                            ${review.verifiedUser ? '<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' : ''}
                            ${isAdminUser ? '<span class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Admin</span>' : ''}
                        </h5>
                        <p class="text-sm text-gray-600">${review.role}</p>
                    </div>
                </div>
                ${isAdminUser ? `
                    <button onclick="deleteReview(${review.id})" class="text-red-600 hover:text-red-700 p-1" title="Delete Review (Admin Only)">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
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
    
    // Edit review function (disabled - reviews are permanent)
    window.editReview = function(reviewId) {
        alert('Reviews are permanent for public display. Only admin can manage reviews.');
    };
    
    // Delete review function (admin only)
    window.deleteReview = function(reviewId) {
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return;
        
        // Only admin can delete reviews (permanent reviews)
        const isAdminUser = isAdmin();
        
        if (!isAdminUser) {
            alert('Only admin can delete reviews. Reviews are permanent for public display.');
            return;
        }
        
        if (confirm(`Are you sure you want to delete this review by ${review.name}? (Admin action - permanent deletion)`)) {
            reviews = reviews.filter(r => r.id !== reviewId);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            renderReviews();
        }
    };
    
    // Helper functions
    function showVerifyMessage(message, type) {
        const msgEl = document.getElementById('verifyMessage');
        msgEl.textContent = message;
        msgEl.classList.remove('hidden', 'text-red-600', 'text-green-600');
        msgEl.classList.add(type === 'error' ? 'text-red-600' : 'text-green-600');
    }
    
    function showReviewFormMessage(message, type) {
        const msgEl = document.getElementById('reviewFormMessage');
        if (msgEl) {
            msgEl.textContent = message;
            msgEl.classList.remove('hidden', 'text-red-600', 'text-green-600');
            msgEl.classList.add(type === 'error' ? 'text-red-600' : 'text-green-600');
        }
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function isValidPhone(phone) {
        return /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));
    }
    
    // Clear all review data (admin only)
    window.clearAllReviews = function() {
        // Check if user is admin
        if (!isAdmin()) {
            alert('Access denied. Only admin can clear all data.');
            return;
        }
        
        if (confirm('Are you sure you want to delete ALL reviews? This cannot be undone. (Admin action)')) {
            localStorage.removeItem('reviews');
            localStorage.removeItem('verifiedUser');
            localStorage.removeItem('emailOtp');
            localStorage.removeItem('emailOtpExpiry');
            localStorage.removeItem('phoneOtp');
            localStorage.removeItem('phoneOtpExpiry');
            localStorage.removeItem('lastReviewSubmission');
            
            reviews = [];
            currentUser = null;
            
            renderReviews();
            showVerificationForm();
            alert('All review data cleared successfully!');
        }
    };
});
