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
