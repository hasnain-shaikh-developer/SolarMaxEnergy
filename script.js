/* ============================================
   SolarMax Energy Pakistan - Premium Solar Website
   Complete JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 80,
            easing: 'ease-out-cubic',
            disable: function() {
                return window.innerWidth < 320;
            }
        });
    }

    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ============================================
    // DARK MODE TOGGLE
    // ============================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }

    // ============================================
    // STICKY NAVIGATION
    // ============================================
    const navbar = document.getElementById('navbar');
    
    function handleScroll() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ============================================
    // MOBILE MENU - COMPLETE FIX
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    let isMenuOpen = false;
    
    function openMobileMenu() {
        isMenuOpen = true;
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        
        if (hamburger) hamburger.classList.add('active');
        
        if (mobileMenuOverlay) {
            mobileMenuOverlay.style.display = 'block';
            void mobileMenuOverlay.offsetHeight;
            mobileMenuOverlay.classList.add('active');
        }
        
        if (navMenu) {
            navMenu.classList.add('active');
        }
        
        if (navbar) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    function closeMobileMenu() {
        isMenuOpen = false;
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        
        if (hamburger) hamburger.classList.remove('active');
        
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            setTimeout(() => {
                if (!isMenuOpen) {
                    mobileMenuOverlay.style.display = 'none';
                }
            }, 350);
        }
        
        if (navbar) {
            navbar.style.background = '';
            navbar.style.backdropFilter = '';
        }
    }
    
    function toggleMobileMenu() {
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (isMenuOpen) {
                closeMobileMenu();
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            !hamburger.contains(e.target) && 
            !navMenu.contains(e.target) &&
            !mobileMenuOverlay.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    window.addEventListener('orientationchange', function() {
        if (isMenuOpen && navMenu) {
            navMenu.style.height = window.innerHeight + 'px';
        }
    });

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeProgress * target);
                
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(updateCounter);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(counter);
        });
    }
    
    animateCounters();

    // ============================================
    // SOLAR SAVINGS CALCULATOR - PKR
    // ============================================
    const calculateBtn = document.getElementById('calculateBtn');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const monthlyBill = parseFloat(document.getElementById('monthlyBill').value);
            const propertyType = document.getElementById('propertyType').value;
            const city = document.getElementById('city').value;
            
            if (!monthlyBill || !propertyType || !city) {
                alert('Please fill in all fields to calculate your savings.');
                return;
            }
            
            const sunHours = {
                karachi: 5.8, lahore: 5.5, islamabad: 5.6,
                faisalabad: 5.4, peshawar: 5.7, quetta: 6.2,
                multan: 5.9, rawalpindi: 5.6
            };
            
            const propertyMultipliers = {
                residential: 1.0, commercial: 1.15, industrial: 1.3
            };
            
            const sunMultiplier = sunHours[city] || 5.5;
            const propMultiplier = propertyMultipliers[propertyType] || 1.0;
            const pkWhRate = 35;
            
            const monthlyUnits = monthlyBill / pkWhRate;
            const systemSize = ((monthlyUnits) / (sunMultiplier * 30) * propMultiplier * 1.3).toFixed(1);
            
            const monthlySavings = (monthlyBill * 0.85).toFixed(0);
            const annualSavings = (monthlySavings * 12).toFixed(0);
            
            const costPerKw = {
                residential: 120000, commercial: 100000, industrial: 85000
            };
            
            const totalCost = systemSize * (costPerKw[propertyType] || 120000);
            const paybackPeriod = (totalCost / annualSavings).toFixed(1);
            
            document.getElementById('systemSize').textContent = systemSize;
            document.getElementById('monthlySavings').textContent = '₨' + parseInt(monthlySavings).toLocaleString('en-PK');
            document.getElementById('annualSavings').textContent = '₨' + parseInt(annualSavings).toLocaleString('en-PK');
            document.getElementById('paybackPeriod').textContent = paybackPeriod;
            
            const placeholder = document.querySelector('.results-placeholder');
            const resultsContent = document.getElementById('resultsContent');
            
            if (placeholder) placeholder.style.display = 'none';
            if (resultsContent) resultsContent.style.display = 'block';
            
            if (typeof gsap !== 'undefined') {
                gsap.from('.result-card', {
                    y: 25, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
                });
            }
        });
    }

    // ============================================
    // TESTIMONIALS SLIDER
    // ============================================
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const testimonialPrev = document.getElementById('testimonialPrev');
    const testimonialNext = document.getElementById('testimonialNext');
    const testimonialsDots = document.getElementById('testimonialsDots');
    
    if (testimonialsTrack && testimonialPrev && testimonialNext) {
        const cards = testimonialsTrack.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        const totalCards = cards.length;
        
        if (testimonialsDots) {
            testimonialsDots.innerHTML = '';
            for (let i = 0; i < totalCards; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                testimonialsDots.appendChild(dot);
            }
        }
        
        const dots = testimonialsDots ? testimonialsDots.querySelectorAll('.dot') : [];
        
        function getCardsPerView() {
            return window.innerWidth > 768 ? 2 : 1;
        }
        
        function updateSlider() {
            const cardsPerView = getCardsPerView();
            const cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 0;
            const maxIndex = Math.max(0, totalCards - cardsPerView);
            
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;
            
            testimonialsTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
        }
        
        testimonialPrev.addEventListener('click', function() {
            currentIndex--;
            if (currentIndex < 0) currentIndex = totalCards - getCardsPerView();
            updateSlider();
        });
        
        testimonialNext.addEventListener('click', function() {
            currentIndex++;
            const maxIndex = totalCards - getCardsPerView();
            if (currentIndex > maxIndex) currentIndex = 0;
            updateSlider();
        });
        
        window.addEventListener('resize', updateSlider);
        
        let autoSlide = setInterval(() => {
            currentIndex++;
            const maxIndex = totalCards - getCardsPerView();
            if (currentIndex > maxIndex) currentIndex = 0;
            updateSlider();
        }, 5000);
        
        testimonialsTrack.addEventListener('mouseenter', () => clearInterval(autoSlide));
        testimonialsTrack.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                currentIndex++;
                const maxIndex = totalCards - getCardsPerView();
                if (currentIndex > maxIndex) currentIndex = 0;
                updateSlider();
            }, 5000);
        });
    }

    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ============================================
    // PROJECTS FILTER
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-full-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(card, 
                            { opacity: 0, scale: 0.95 },
                            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
                        );
                    }
                } else {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, {
                            opacity: 0, scale: 0.95, duration: 0.3,
                            onComplete: () => { card.style.display = 'none'; }
                        });
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // ============================================
    // CHATBOT WIDGET
    // ============================================
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotSuggestions = document.getElementById('chatbotSuggestions');
    
    const botResponses = {
        'cost': "Solar system costs in Pakistan vary based on size. Residential systems typically range from ₨450,000 to ₨1,800,000. With net metering, your payback period can be as short as 3-5 years.",
        'price': "Solar system costs in Pakistan vary based on size. Residential systems typically range from ₨450,000 to ₨1,800,000. With net metering, your payback period can be as short as 3-5 years.",
        'how': "Solar panels convert sunlight into electricity through photovoltaic cells. The DC power is converted to AC by a hybrid inverter, then used in your home or sent to the grid via net metering.",
        'work': "Solar panels convert sunlight into electricity through photovoltaic cells. The DC power is converted to AC by a hybrid inverter, then used in your home or sent to the grid via net metering.",
        'quote': "I'd be happy to help you get a quote! Please visit our Contact page or fill out the form on our homepage. Our team will provide a free assessment within 24 hours.",
        'maintenance': "Solar panels require minimal maintenance in Pakistan! We recommend quarterly cleaning due to dust, plus annual inspections. Our maintenance packages start at ₨15,000/year.",
        'battery': "Battery backup systems store excess solar energy for use during load shedding. We offer lithium-ion and tubular battery options. Prices start at ₨280,000.",
        'savings': "Most Pakistani homeowners save 50-90% on their electricity bills with solar. Use our Solar Calculator on the homepage to estimate your specific savings!",
        'install': "Most residential installations in Pakistan take 1-3 days, but the full process from consultation to net metering is typically 4-8 weeks.",
        'installation': "Most residential installations in Pakistan take 1-3 days, but the full process from consultation to net metering is typically 4-8 weeks.",
        'warranty': "We offer a comprehensive 25-year performance warranty on all solar panels, plus workmanship warranties on installation.",
        'financing': "We offer multiple financing options in Pakistan including bank solar loans and easy installment plans.",
        'net metering': "Net metering in Pakistan allows you to sell excess solar energy back to the grid. NEPRA has made net metering mandatory for all DISCOs.",
        'load shedding': "With our hybrid solar systems and battery backup, you can eliminate load shedding from your life!",
        'hello': "Assalamu Alaikum! Welcome to SolarMax Energy Pakistan. I'm your Solar Assistant. How can I help you today?",
        'hi': "Assalamu Alaikum! Welcome to SolarMax Energy Pakistan. I'm your Solar Assistant. How can I help you today?",
        'salam': "Wa Alaikum Assalam! Welcome to SolarMax Energy Pakistan. How can I assist you today?",
        'help': "I can help you with solar costs, how solar works, getting a quote, maintenance, battery backup, savings estimates, installation, warranties, net metering, and financing. What would you like to know?"
    };
    
    function getBotResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        for (const [key, response] of Object.entries(botResponses)) {
            if (lowerMsg.includes(key)) {
                return response;
            }
        }
        
        const defaults = [
            "That's a great question! For more detailed information, I'd recommend speaking with one of our solar experts at +92 300 1234567.",
            "I'd be happy to help with that! Could you provide a bit more detail so I can give you the most accurate information?",
            "Thanks for your interest in solar energy! Our team would love to discuss this with you. Would you like to schedule a free consultation?",
            "Solar energy has tremendous potential in Pakistan! For specific details, please use our Solar Calculator or contact our team."
        ];
        
        return defaults[Math.floor(Math.random() * defaults.length)];
    }
    
    function addMessage(text, isUser = false) {
        if (!chatbotMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', isUser ? 'user' : 'bot');
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content"><p>${text}</p></div>
            <span class="message-time">${timeStr}</span>
        `;
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function sendMessage() {
        if (!chatbotInput) return;
        
        const text = chatbotInput.value.trim();
        if (!text) return;
        
        addMessage(text, true);
        chatbotInput.value = '';
        
        setTimeout(() => {
            const response = getBotResponse(text);
            addMessage(response, false);
        }, 700);
    }
    
    if (chatbotToggle && chatbotPanel) {
        chatbotToggle.addEventListener('click', function() {
            chatbotPanel.classList.toggle('active');
            const notification = this.querySelector('.chatbot-notification');
            if (notification) notification.style.display = 'none';
        });
        
        if (chatbotClose) {
            chatbotClose.addEventListener('click', function() {
                chatbotPanel.classList.remove('active');
            });
        }
    }
    
    if (chatbotSend && chatbotInput) {
        chatbotSend.addEventListener('click', sendMessage);
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    if (chatbotSuggestions) {
        chatbotSuggestions.addEventListener('click', function(e) {
            if (e.target.classList.contains('suggestion-chip')) {
                chatbotInput.value = e.target.textContent;
                sendMessage();
            }
        });
    }

    // ============================================
    // CONTACT FORM
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            contactForm.style.display = 'none';
            if (formSuccess) {
                formSuccess.style.display = 'block';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }
    
    const contactPreviewForm = document.getElementById('contactPreviewForm');
    if (contactPreviewForm) {
        contactPreviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! Our Pakistan team will get back to you within 24 hours.');
            this.reset();
        });
    }

    // ============================================
    // GSAP ANIMATIONS
    // ============================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        if (document.querySelector('.hero')) {
            gsap.to('.hero-bg', {
                yPercent: 20, ease: 'none',
                scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
            });
        }
        
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                y: 30, opacity: 0, duration: 0.7, ease: 'power2.out',
                scrollTrigger: { trigger: header, start: 'top 88%', toggleActions: 'play none none none' }
            });
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============================================
    // WHATSAPP FLOAT
    // ============================================
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat && typeof gsap !== 'undefined') {
        gsap.from(whatsappFloat, {
            scale: 0, opacity: 0, duration: 0.5, delay: 1.2, ease: 'back.out(1.7)'
        });
    }

    // ============================================
    // PAGE LOAD
    // ============================================
    if (typeof gsap !== 'undefined') {
        gsap.from('.navbar', { y: -100, opacity: 0, duration: 0.7, ease: 'power2.out' });
        
        if (document.querySelector('.hero-content')) {
            gsap.from('.hero-content > *', {
                y: 40, opacity: 0, duration: 0.7, stagger: 0.12, delay: 0.25, ease: 'power2.out'
            });
        }
    }

    // ============================================
    // STORY STATS
    // ============================================
    const storyNumbers = document.querySelectorAll('.story-number[data-count]');
    
    storyNumbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-count'));
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(num, {
                            innerText: target, duration: 2, snap: { innerText: 1 }, ease: 'power1.out',
                            onUpdate: function() {
                                if (this.targets && this.targets()[0]) {
                                    num.textContent = Math.floor(this.targets()[0].innerText).toLocaleString('en-PK');
                                }
                            }
                        });
                    } else {
                        num.textContent = target.toLocaleString('en-PK');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(num);
    });

    console.log('SolarMax Energy Pakistan website loaded successfully!');
});
