// Mobile Menu Toggle Script
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const crossIcon = document.getElementById('cross-icon');
    const body = document.body;
    let isOpen = false;
    
    // Function to close mobile menu
    function closeMobileMenu() {
        mobileMenu.classList.remove('scale-y-100', 'opacity-100');
        mobileMenu.classList.add('scale-y-0', 'opacity-0');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
        
        // Show hamburger icon, hide cross
        crossIcon.classList.add('hidden');
        hamburgerIcon.classList.remove('hidden');
        
        // Remove overflow hidden from body
        body.style.overflow = '';
        
        isOpen = false;
    }
    
    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (!isOpen) {
            // Open menu with animation
            mobileMenu.classList.remove('hidden');
            setTimeout(() => {
                mobileMenu.classList.remove('scale-y-0', 'opacity-0');
                mobileMenu.classList.add('scale-y-100', 'opacity-100');
            }, 10);
            
            // Show cross icon, hide hamburger
            hamburgerIcon.classList.add('hidden');
            crossIcon.classList.remove('hidden');
            
            // Add overflow hidden to body
            body.style.overflow = 'hidden';
            
            isOpen = true;
        } else {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isOpen && !mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking on links or button inside mobile menu
    const mobileMenuLinks = mobileMenu.querySelectorAll('a, button');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isOpen) {
                closeMobileMenu();
            }
        });
    });

    // Close all service FAQs on page load
    const serviceFaqButtons = document.querySelectorAll('.service-faq-button');
    const serviceFaqContents = document.querySelectorAll('.service-faq-content');
    const serviceFaqIcons = document.querySelectorAll('.service-faq-icon');
    
    // Initialize all service FAQs as closed
    serviceFaqButtons.forEach((btn, index) => {
        const content = serviceFaqContents[index];
        const icon = serviceFaqIcons[index];
        
        // Ensure content is hidden initially
        content.classList.add('hidden');
        content.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
    });
});

// Reviews list rendering and Google review redirect
(function() {
    const storageKey = 'cmg_testimonials';
    const openBtn = document.getElementById('openReviewModal');
    const list = document.getElementById('testimonials-list');
    const googleReviewUrl = 'https://www.google.com/maps/search/?api=1&query=SwiftMove+Packers+%26+Movers+reviews';

    if (!list) return;

    function escapeHTML(s) {
        return String(s).replace(/[&<>"']/g, function(m) {
            return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m];
        });
    }

    function loadReviews() {
        try {
            const raw = localStorage.getItem(storageKey) || '[]';
            const arr = JSON.parse(raw);
            renderReviews(arr);
        } catch (e) {
            console.error('Failed to load testimonials', e);
            renderReviews([]);
        }
    }

    function renderReviews(arr) {
        list.innerHTML = '';
        if (!arr || !arr.length) {
            list.innerHTML = '<p class="text-gray-600">No testimonials available yet.</p>';
            return;
        }

        arr.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded shadow';
            const ratingStars = '★'.repeat(Number(item.rating || 5));
            card.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="flex-1">
                        <h4 class="font-semibold">${escapeHTML(item.name)}</h4>
                        <p class="text-sm text-gray-500">${escapeHTML(item.role || '')}</p>
                        <p class="mt-2 text-gray-700">${escapeHTML(item.message)}</p>
                        <p class="text-xs text-gray-400 mt-2">${escapeHTML(item.date || '')}</p>
                    </div>
                    <div class="text-yellow-400 font-semibold text-lg">${ratingStars}</div>
                </div>
            `;
            list.appendChild(card);
        });
    }

    if (openBtn) {
        openBtn.addEventListener('click', function() {
            window.open(googleReviewUrl, '_blank');
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        loadReviews();
    });
})();

// Accordion Toggle Function
function toggleAccordion(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.faq-icon');
    const allButtons = document.querySelectorAll('.faq-button');
    const allContents = document.querySelectorAll('.faq-content');
    const allIcons = document.querySelectorAll('.faq-icon');
    
    // Close all other accordions with animation
    allButtons.forEach((btn, index) => {
        if (btn !== button) {
            const otherContent = allContents[index];
            const otherIcon = allIcons[index];
            
            // Close animation
            otherContent.style.maxHeight = '0px';
            otherContent.classList.add('hidden');
            otherIcon.style.transform = 'rotate(0deg)';
            btn.classList.remove('bg-[#F8F9FA]');
        }
    });
    
    // Toggle current accordion with animation
    if (content.classList.contains('hidden')) {
        // Open animation
        content.classList.remove('hidden');
        button.classList.add('bg-[#F8F9FA]');
        
        // Set max height for smooth animation
        setTimeout(() => {
            content.style.maxHeight = content.scrollHeight + 'px';
        }, 10);
        
        // Rotate icon
        icon.style.transform = 'rotate(180deg)';
    } else {
        // Close animation
        content.style.maxHeight = '0px';
        button.classList.remove('bg-[#F8F9FA]');
        icon.style.transform = 'rotate(0deg)';
        
        // Hide after animation completes
        setTimeout(() => {
            content.classList.add('hidden');
        }, 300);
    }
}

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.add('opacity-0', 'invisible');
            backToTopButton.classList.remove('opacity-100', 'visible');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const contactForm = document.getElementById('contactForm');
    const contactFormMessage = document.getElementById('contactFormMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const form = event.currentTarget;
            let formIsValid = true;

            const validationFields = [
                { id: 'fullName', message: 'Please enter your full name.' },
                { id: 'mobile', message: 'Please enter a valid mobile number.' },
                { id: 'email', message: 'Please enter a valid email address.' },
                { id: 'relocateFrom', message: 'Please enter your current location.' },
                { id: 'relocateTo', message: 'Please enter your destination.' },
                { id: 'relocationDate', message: 'Please choose a relocation date.' }
            ];

            validationFields.forEach(({ id, message }) => {
                const field = document.getElementById(id);
                const errorEl = form.querySelector(`[data-error="${id}"]`);
                if (!field.checkValidity()) {
                    formIsValid = false;
                    if (errorEl) {
                        errorEl.textContent = message;
                        errorEl.classList.remove('hidden');
                    }
                    field.classList.add('border-red-500', 'ring-2', 'ring-red-100');
                } else {
                    if (errorEl) {
                        errorEl.classList.add('hidden');
                    }
                    field.classList.remove('border-red-500', 'ring-2', 'ring-red-100');
                }
            });

            if (!formIsValid) {
                contactFormMessage.classList.remove('hidden', 'bg-[#ECFDF5]', 'text-[#06599F]');
                contactFormMessage.classList.add('bg-[#FEE2E2]', 'text-[#991B1B]');
                contactFormMessage.textContent = 'Please fix the errors above and try again.';
                return;
            }

            document.getElementById('hiddenName').value = document.getElementById('fullName').value.trim();
            document.getElementById('hiddenMobile').value = document.getElementById('mobile').value.trim();
            document.getElementById('hiddenEmail').value = document.getElementById('email').value.trim();
            document.getElementById('hiddenRelocateFrom').value = document.getElementById('relocateFrom').value.trim();
            document.getElementById('hiddenRelocateTo').value = document.getElementById('relocateTo').value.trim();
            document.getElementById('hiddenRelocationDate').value = document.getElementById('relocationDate').value;
            document.getElementById('hiddenMessage').value = document.getElementById('message').value.trim();

            const formData = new FormData(form);
            contactFormMessage.classList.remove('hidden', 'bg-[#FEE2E2]', 'text-[#991B1B]');
            contactFormMessage.classList.add('bg-[#ECFDF5]', 'text-[#06599F]');
            contactFormMessage.textContent = 'Sending your request...';

            fetch(form.action, {
                method: form.method || 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            })
            .then(response => {
                if (response.ok) {
                    contactFormMessage.classList.remove('bg-[#FEE2E2]', 'text-[#991B1B]');
                    contactFormMessage.classList.add('bg-[#ECFDF5]', 'text-[#06599F]');
                    contactFormMessage.textContent = 'Thank you! Your request has been submitted successfully. We will contact you shortly.';
                    form.reset();
                } else {
                    return response.json().then(() => {
                        throw new Error('Submission failed.');
                    });
                }
            })
            .catch(() => {
                contactFormMessage.classList.remove('bg-[#ECFDF5]', 'text-[#06599F]');
                contactFormMessage.classList.add('bg-[#FEE2E2]', 'text-[#991B1B]');
                contactFormMessage.textContent = 'Submission failed. Please try again or contact director.movers@gmail.com directly.';
            });
        });

        contactForm.addEventListener('input', function(event) {
            const field = event.target;
            if (!field.id || !field.validity) return;
            const errorEl = contactForm.querySelector(`[data-error="${field.id}"]`);
            if (field.checkValidity()) {
                if (errorEl) {
                    errorEl.classList.add('hidden');
                }
                field.classList.remove('border-red-500', 'ring-2', 'ring-red-100');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonial-swiper', {
            loop: true,
            speed: 700,
            autoplay: {
                delay: 6500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            slidesPerView: 1,
            spaceBetween: 24,
            breakpoints: {
                768: {
                    slidesPerView: 1,
                },
                1024: {
                    slidesPerView: 1,
                },
            },
        });
    }

    const counterElements = document.querySelectorAll('.count-counter');
    if (counterElements.length) {
        const startCounter = (counter) => {
            const target = parseInt(counter.dataset.target, 10) || 0;
            const suffix = counter.dataset.suffix || '';
            const duration = 1800;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const currentValue = Math.floor(progress * target);
                counter.textContent = currentValue.toLocaleString() + suffix;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = target.toLocaleString() + suffix;
                }
            };

            requestAnimationFrame(animate);
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counterElements.forEach((counter) => {
            counter.textContent = '0' + (counter.dataset.suffix || '');
            observer.observe(counter);
        });
    }
});

// Service FAQ Toggle Function
function toggleServiceFaq(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.service-faq-icon');
    const allButtons = document.querySelectorAll('.service-faq-button');
    const allContents = document.querySelectorAll('.service-faq-content');
    const allIcons = document.querySelectorAll('.service-faq-icon');
    
    // Close all other service FAQs with smooth animation
    allButtons.forEach((btn, index) => {
        if (btn !== button) {
            const otherContent = allContents[index];
            const otherIcon = allIcons[index];
            
            // Close animation
            otherContent.style.maxHeight = '0px';
            otherContent.classList.add('hidden');
            otherIcon.style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current service FAQ with smooth animation
    if (content.classList.contains('hidden')) {
        // Open animation
        content.classList.remove('hidden');
        
        // Set max height for smooth animation
        setTimeout(() => {
            content.style.maxHeight = content.scrollHeight + 'px';
        }, 10);
        
        // Rotate icon
        icon.style.transform = 'rotate(180deg)';
    } else {
        // Close animation
        content.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
        
        // Hide after animation completes
        setTimeout(() => {
            content.classList.add('hidden');
        }, 300);
    }
}

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('backToTop');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.add('opacity-0', 'invisible');
            backToTopButton.classList.remove('opacity-100', 'visible');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

