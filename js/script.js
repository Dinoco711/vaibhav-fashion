// Global variables for cursor and mouse tracking
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let speed = 0.2;

// Smooth cursor animation
function updateCursor() {
    // Calculate distance between cursor and follower
    let dx = mouseX - cursorX;
    let dy = mouseY - cursorY;
    
    // Update positions with easing
    cursorX += dx * speed;
    cursorY += dy * speed;
    
    // Apply transforms
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    cursorFollower.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    
    requestAnimationFrame(updateCursor);
}

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, { passive: true });

// Initialize cursor animation
updateCursor();

// Enhanced cursor interactions
const cursorElements = document.querySelectorAll('a, button, .collection-item, .testimonial-card');

cursorElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorFollower.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorFollower.classList.remove('cursor-hover');
    });
});

// Hide cursor when mouse leaves window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
});

// Enhanced loading animation with mobile optimization
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    // Create particles
    createParticles();
    
    // Initialize progress
    let progress = 0;
    const updateProgress = () => {
        progress += 1;
        if (progressText) progressText.textContent = `${progress}%`;
        progressBar.style.setProperty('--progress', `${progress}%`);
        
        if (progress >= 100) {
            setTimeout(completeLoading, 500);
            return;
        }
        
        const speed = progress < 90 ? 25 : 50;
        setTimeout(updateProgress, speed);
    };
    
    // Start progress animation
    setTimeout(updateProgress, 500);
});

// Create particle effect
function createParticles() {
    const particlesContainer = document.querySelector('.loader-particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and animation delay
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 2;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: 2px;
            height: 2px;
            background: #c4a747;
            border-radius: 50%;
            animation: floatParticle 3s ease-in-out infinite;
            animation-delay: ${delay}s;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Complete loading animation
function completeLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Add particle animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px);
        }
    }
`;
document.head.appendChild(style);

// Add this at the start of your script
document.body.style.overflow = 'hidden'; // Prevent scrolling during loading

// Three.js Scene Setup
const heroCanvas = document.getElementById('hero-canvas');
const heroScene = new THREE.Scene();
const heroCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const heroRenderer = new THREE.WebGLRenderer({ 
    canvas: heroCanvas, 
    antialias: true,
    alpha: true 
});

heroRenderer.setSize(window.innerWidth, window.innerHeight);
heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
heroCamera.position.z = 5;

// Create animated particles background
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0xc4a747,
    transparent: true,
    opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
heroScene.add(particlesMesh);

// Three.js Animation
let cameraMouseX = 0;
let cameraMouseY = 0;

document.addEventListener('mousemove', (event) => {
    cameraMouseX = event.clientX / window.innerWidth - 0.5;
    cameraMouseY = event.clientY / window.innerHeight - 0.5;
});

function animateScene() {
    requestAnimationFrame(animateScene);
    
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.001;
    
    heroCamera.position.x += (cameraMouseX - heroCamera.position.x) * 0.05;
    heroCamera.position.y += (-cameraMouseY - heroCamera.position.y) * 0.05;
    
    heroRenderer.render(heroScene, heroCamera);
}

animateScene();

// Scroll animations
const sections = document.querySelectorAll('section');
const navBar = document.querySelector('.nav-container');

// Unified observer options and observer
const observerOptions = {
    threshold: 0.2,
    rootMargin: '50px'
};

// Create a single observer for both sections and collection items
const universalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Handle sections
            entry.target.classList.add('fade-in');
            
            // Handle collection items
            if (entry.target.classList.contains('collection-item')) {
                const items = entry.target.parentElement.children;
                const index = Array.from(items).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.2}s`;
                entry.target.classList.add('visible');
            }
            
            // Handle collections section
            if (entry.target.classList.contains('collections')) {
                const items = entry.target.querySelectorAll('.collection-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 200);
                });
            }
        }
    });
}, observerOptions);

// Observe all sections and collection items
document.querySelectorAll('section, .collection-item').forEach(element => {
    universalObserver.observe(element);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navBar.classList.add('nav-scrolled');
    } else {
        navBar.classList.remove('nav-scrolled');
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Enhanced hover effects
const links = document.querySelectorAll('a');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursorFollower.style.transform = 'scale(1.5)';
        link.style.color = '#c4a747';
    });
    
    link.addEventListener('mouseleave', () => {
        cursorFollower.style.transform = 'scale(1)';
        link.style.color = '';
    });
});

// Responsive handling
window.addEventListener('resize', () => {
    // Update camera
    heroCamera.aspect = window.innerWidth / window.innerHeight;
    heroCamera.updateProjectionMatrix();
    
    // Update renderer
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Add touch device detection
const isTouchDevice = () => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};

// Disable custom cursor on touch devices
if (isTouchDevice()) {
    document.body.style.cursor = 'auto';
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
}

// Add this to your existing JavaScript for testimonial animations
const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animation for multiple cards
            const cards = entry.target.querySelectorAll('.testimonial-card');
            cards.forEach((card, index) => {
                card.style.transitionDelay = `${index * 0.2}s`;
                card.classList.add('visible');
            });
        }
    });
}, observerOptions);

// Observe the testimonials section
document.querySelectorAll('.testimonials').forEach(section => {
    testimonialObserver.observe(section);
});

// Mobile Navigation
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

// Toggle menu
mobileNavToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    body.classList.toggle('nav-open');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileNavToggle.contains(e.target) && navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('nav-open');
    }
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        
        // Close mobile menu
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('nav-open');
        
        // Get the target section
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Scroll to section after menu closes
        if (targetSection) {
            setTimeout(() => {
                const headerOffset = 80; // Adjust based on your header height
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 300); // Wait for menu animation to complete
        }
    });
});
