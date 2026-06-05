/* ============================================
   SolarMax Energy Pakistan - Premium Solar Website
   JavaScript - Fixed & Optimized
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
    // Dark Mode Toggle
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
    // Sticky Navigation
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
    // Hamburger Menu - FIXED
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ============================================
    // Counter Animation
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
    // Solar Savings Calculator - PKR Version
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
            
            // Pakistani city sun hours (annual average peak sun hours)
            const sunHours = {
                karachi: 5.8,
                lahore: 5.5,
                islamabad: 5.6,
                faisalabad: 5.4,
                peshawar: 5.7,
                quetta: 6.2,
                multan: 5.9,
                rawalpindi: 5.6
            };
            
            // Property type multipliers
            const propertyMultipliers = {
                residential: 1.0,
                commercial: 1.15,
                industrial: 1.3
            };
            
            const sunMultiplier = sunHours[city] || 5.5;
            const propMultiplier = propertyMultipliers[propertyType] || 1.0;
            
            // PKR per kWh average rate in Pakistan (approximate)
            const pkWhRate = 35;
            
            // Calculate system size (kW)
            // Formula: (monthly bill / rate) / (sun hours * 30) * property multiplier
            const monthlyUnits = monthlyBill / pkWhRate;
            const systemSize = ((monthlyUnits) / (sunMultiplier * 30) * propMultiplier * 1.3).toFixed(1);
            
            // Calculate savings (85% of bill typically saved)
            const monthlySavings = (monthlyBill * 0.85).toFixed(0);
            const annualSavings = (monthlySavings * 12).toFixed(0);
            
            // Calculate payback period
            // Average cost per kW in Pakistan: ₨120,000 residential, ₨100,000 commercial, ₨85,000 industrial
            const costPerKw = {
                residential: 120000,
                commercial: 100000,
                industrial: 85000
            };
            
            const totalCost = systemSize * (costPerKw[propertyType] || 120000);
            const paybackPeriod = (totalCost / annualSavings).toFixed(1);
            
            // Display results with PKR formatting
            document.getElementById('systemSize').textContent = systemSize;
            document.getElementById('monthlySavings').textContent = '₨' + parseInt(monthlySavings).toLocaleString('en-PK');
            document.getElementById('annualSavings').textContent = '₨' + parseInt(annualSavings).toLocaleString('en-PK');
            document.getElementById('paybackPeriod').textContent = paybackPeriod;
            
            const placeholder = document.querySelector('.results-placeholder');
            const resultsContent = document.getElementById('resultsContent');
            
            if (placeholder) placeholder.style.display = 'none';
            if (resultsContent) resultsContent.style.display = 'block';
            
            // Animate results with GSAP
            if (typeof gsap !== 'undefined') {
                gsap.from('.result-card', {
                    y: 25,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                });
            }
        });
    }

    // ============================================
    // Testimonials Slider - FIXED
    // ============================================
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const testimonialPrev = document.getElementById('testimonialPrev');
    const testimonialNext = document.getElementById('testimonialNext');
    const testimonialsDots = document.getElementById('testimonialsDots');
    
    if (testimonialsTrack && testimonialPrev && testimonialNext) {
        const cards = testimonialsTrack.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        const totalCards = cards.length;
        
        // Create dots
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
        
        // Auto-slide
        let autoSlide = setInterval(() => {
            currentIndex++;
            const maxIndex = totalCards - getCardsPerView();
            if (currentIndex > maxIndex) currentIndex = 0;
            updateSlider();
        }, 5000);
        
        // Pause on hover
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
    // FAQ Accordion
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(i => i.classList.remove('active'));
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ============================================
    // Projects Filter
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-full-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
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
                            opacity: 0,
                            scale: 0.95,
                            duration: 0.3,
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
    // Chatbot Widget
    // ============================================
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotSuggestions = document.getElementById('chatbotSuggestions');
    
    // Pakistan-specific responses
    const botResponses = {
        'cost': "Solar system costs in Pakistan vary based on size. Residential systems typically range from ₨450,000 to ₨1,800,000. With net metering, your payback period can be as short as 3-5 years. Would you like a personalized quote?",
        'price': "Solar system costs in Pakistan vary based on size. Residential systems typically range from ₨450,000 to ₨1,800,000. With net metering, your payback period can be as short as 3-5 years. Would you like a personalized quote?",
        'how': "Solar panels convert sunlight into electricity through photovoltaic cells. The DC power is converted to AC by a hybrid inverter, then used in your home or sent to the grid via net metering. It's clean, renewable, and perfect for Pakistan's sunny climate!",
        'work': "Solar panels convert sunlight into electricity through photovoltaic cells. The DC power is converted to AC by a hybrid inverter, then used in your home or sent to the grid via net metering. It's clean, renewable, and perfect for Pakistan's sunny climate!",
        'quote': "I'd be happy to help you get a quote! Please visit our Contact page or fill out the form on our homepage. Our team will provide a free, no-obligation assessment within 24 hours for your location in Pakistan.",
        'maintenance': "Solar panels require minimal maintenance in Pakistan! We recommend quarterly cleaning due to dust, plus annual inspections. Our maintenance packages start at ₨15,000/year and include monitoring, cleaning, and priority repair service.",
        'battery': "Battery backup systems store excess solar energy for use during load shedding. We offer lithium-ion and tubular battery options. Prices start at ₨280,000. Essential for Pakistan's power situation!",
        'savings': "Most Pakistani homeowners save 50-90% on their electricity bills with solar. Use our Solar Calculator on the homepage to estimate your specific savings based on your monthly bill and city!",
        'install': "Most residential installations in Pakistan take 1-3 days, but the full process from consultation to net metering is typically 4-8 weeks. This includes NEPRA approvals and DISCO interconnection.",
        'installation': "Most residential installations in Pakistan take 1-3 days, but the full process from consultation to net metering is typically 4-8 weeks. This includes NEPRA approvals and DISCO interconnection.",
        'warranty': "We offer a comprehensive 25-year performance warranty on all solar panels, plus workmanship warranties on installation. Your investment is fully protected!",
        'financing': "We offer multiple financing options in Pakistan including bank solar loans and easy installment plans. Many homeowners qualify for affordable monthly payments less than their current electricity bills.",
        'net metering': "Net metering in Pakistan allows you to sell excess solar energy back to the grid through your DISCO. NEPRA has made net metering mandatory for all DISCOs. We handle the entire application process for you!",
        'load shedding': "With our hybrid solar systems and battery backup, you can eliminate load shedding from your life! The battery stores energy during the day to power your home at night or during outages.",
        'hello': "Assalamu Alaikum! Welcome to SolarMax Energy Pakistan. I'm your Solar Assistant. How can I help you today?",
        'hi': "Assalamu Alaikum! Welcome to SolarMax Energy Pakistan. I'm your Solar Assistant. How can I help you today?",
        'salam': "Wa Alaikum Assalam! Welcome to SolarMax Energy Pakistan. How can I assist you with solar energy today?",
        'help': "I can help you with information about solar costs in Pakistan, how solar works, getting a quote, maintenance, battery backup for load shedding, savings estimates, installation timelines, warranties, net metering, and financing options. What would you like to know?"
    };
    
    function getBotResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        for (const [key, response] of Object.entries(botResponses)) {
            if (lowerMsg.includes(key)) {
                return response;
            }
        }
        
        const defaults = [
            "That's a great question! For more detailed information specific to Pakistan, I'd recommend speaking with one of our solar experts. You can reach us at +92 300 1234567 or fill out our contact form.",
            "I'd be happy to help with that! Could you provide a bit more detail so I can give you the most accurate information for your situation in Pakistan?",
            "Thanks for your interest in solar energy in Pakistan! Our team would love to discuss this with you in detail. Would you like to schedule a free consultation?",
            "Solar energy has tremendous potential in Pakistan! For specific details about your situation, please use our Solar Calculator or contact our team directly."
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
            <div class="message-content">
                <p>${text}</p>
            </div>
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
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    if (chatbotSuggestions) {
        chatbotSuggestions.addEventListener('click', function(e) {
            if (e.target.classList.contains('suggestion-chip')) {
                const text = e.target.textContent;
                chatbotInput.value = text;
                sendMessage();
            }
        });
    }

    // ============================================
    // Contact Form Handling
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            contactForm.style.display = 'none';
            if (formSuccess) {
                formSuccess.style.display = 'block';
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
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
    // GSAP Animations
    // ============================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        
        // Hero parallax
        if (document.querySelector('.hero')) {
            gsap.to('.hero-bg', {
                yPercent: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
        
        // Section reveals
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: header,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    // ============================================
    // Smooth Scroll
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // WhatsApp Float Animation
    // ============================================
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    if (whatsappFloat && typeof gsap !== 'undefined') {
        gsap.from(whatsappFloat, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            delay: 1.2,
            ease: 'back.out(1.7)'
        });
    }

    // ============================================
    // Page Load Animation
    // ============================================
    if (typeof gsap !== 'undefined') {
        gsap.from('.navbar', {
            y: -100,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out'
        });
        
        if (document.querySelector('.hero-content')) {
            gsap.from('.hero-content > *', {
                y: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.12,
                delay: 0.25,
                ease: 'power2.out'
            });
        }
    }

    // ============================================
    // About Page Story Stats
    // ============================================
    const storyNumbers = document.querySelectorAll('.story-number[data-count]');
    
    storyNumbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-count'));
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(num, {
                            innerText: target,
                            duration: 2,
                            snap: { innerText: 1 },
                            ease: 'power1.out',
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