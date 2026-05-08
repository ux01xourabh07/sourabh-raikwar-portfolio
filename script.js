document.addEventListener("DOMContentLoaded", () => {
    // Register ScrollTrigger and ScrollToPlugin
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Navbar Background Blur on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(5, 5, 5, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.8)';
        } else {
            navbar.style.background = 'rgba(5, 5, 5, 0.7)';
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Active Link Highlighting
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href') === `#${current}`) {
                li.classList.add('active');
            }
        });
    });

    // Smooth Scrolling for Navbar Links
    document.querySelectorAll('.nav-link, .btn, .back-to-top').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Allow standard links to work (like download resume)
            if(targetId && targetId.startsWith('#')) {
                e.preventDefault();
                // Close mobile menu if open
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if(navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }

                gsap.to(window, {
                    duration: 1,
                    scrollTo: {y: targetId, offsetY: 80},
                    ease: "power3.inOut"
                });
            }
        });
    });

    // Initialize VanillaTilt for Project Cards (Desktop only for performance)
    if (window.matchMedia("(min-width: 768px)").matches) {
        VanillaTilt.init(document.querySelectorAll(".tilt-effect"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });
    }

    // --- GSAP Animations ---
    
    // Hero Text Reveal
    gsap.from(".gsap-reveal", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2
    });

    // Hero Image Float Entrance
    gsap.from(".hero-mockup", {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
        delay: 0.5
    });

    gsap.from(".glass-badge", {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "elastic.out(1, 0.5)",
        delay: 1.2
    });

    // Mouse Parallax for Hero Image (Desktop only)
    if (window.matchMedia("(min-width: 992px)").matches) {
        document.addEventListener("mousemove", parallax);
    }
    function parallax(e) {
        document.querySelectorAll(".hero-mockup").forEach(function(move){
            var moving_value = 20;
            var x = (e.clientX * moving_value) / 1000;
            var y = (e.clientY * moving_value) / 1000;

            gsap.to(move, {
                x: x,
                y: y,
                duration: 1,
                ease: "power1.out"
            });
        });
        
        document.querySelectorAll(".glass-badge").forEach(function(move){
            var moving_value = -30; // Move opposite
            var x = (e.clientX * moving_value) / 1000;
            var y = (e.clientY * moving_value) / 1000;

            gsap.to(move, {
                x: x,
                y: y,
                duration: 1,
                ease: "power1.out"
            });
        });
    }

    // Scroll Animations (Fade Up)
    const revealElements = document.querySelectorAll(".gs_reveal");
    revealElements.forEach((elem) => {
        let x = 0;
        let y = 50;

        if (elem.classList.contains("gs_reveal_fromLeft")) {
            x = -100;
            y = 0;
        } else if (elem.classList.contains("gs_reveal_fromRight")) {
            x = 100;
            y = 0;
        } else if (elem.classList.contains("gs_reveal_fromBottom")) {
            x = 0;
            y = 100;
        }

        const delay = elem.getAttribute("data-delay") || 0;

        gsap.fromTo(elem, {x: x, y: y, autoAlpha: 0}, {
            duration: 1.2,
            x: 0,
            y: 0,
            autoAlpha: 1,
            ease: "power3.out",
            delay: delay,
            scrollTrigger: {
                trigger: elem,
                start: "top 85%", // when the top of the trigger hits 85% from the top of the viewport
                toggleActions: "play none none reverse"
            }
        });
    });

    // Animated Counters
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            onEnter: () => {
                const target = +counter.getAttribute('data-target');
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 3,
                    snap: { innerHTML: 1 },
                    ease: "power2.out",
                    onUpdate: function() {
                        // Optional: Format numbers (e.g., add + sign)
                        if(this.progress() === 1 && target > 20) {
                            counter.innerHTML += "+";
                        }
                    }
                });
            },
            once: true
        });
    });

    // Typing Animation logic (Alternating titles)
    const roles = ["AI Developer", "Full Stack Engineer", "MERN Stack Developer", "Spring Boot Developer"];
    const typingSpan = document.querySelector(".typing-text");
    if(typingSpan) {
        // Clear existing static text
        typingSpan.innerHTML = "";
        
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeEffect() {
            const currentRole = roles[roleIndex];
            
            if(isDeleting) {
                typingSpan.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingSpan.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typingSpeed = isDeleting ? 40 : 100;
            
            if(!isDeleting && charIndex === currentRole.length) {
                typingSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if(isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500; // Pause before new word
            }
            
            setTimeout(typeEffect, typingSpeed);
        }
        
        // Start typing effect slightly delayed
        setTimeout(typeEffect, 2000);
    }
});
