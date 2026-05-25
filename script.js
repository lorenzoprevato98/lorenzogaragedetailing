document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu ul li a');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // 3. Scroll Reveal Animations uses Intersection Observer
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Update Copyright Year (Optional small detail)
    const yearSpan = document.createElement('span');
    yearSpan.textContent = new Date().getFullYear();
    // find where copyright is and replace if there was a span, but right now it's static in footer. Needs no JS intervention unless needed dynamically.

    // 5. Form Submit Handling via Web3Forms
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            const formData = new FormData(contactForm);
            formData.append("access_key", "ca11f5b2-6f39-4531-9a0e-3b6bb7ddc87e");
            formData.append("subject", "Nuova richiesta di preventivo da Lorenzo Garage");

            submitBtn.textContent = 'Invio in corso...';
            submitBtn.disabled = true;

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    submitBtn.textContent = 'Richiesta Inviata!';
                    submitBtn.style.backgroundColor = '#4CAF50';
                    submitBtn.style.color = 'white';
                    contactForm.reset();
                } else {
                    alert("Errore: " + data.message);
                    submitBtn.textContent = 'Errore di invio!';
                    submitBtn.style.backgroundColor = '#f44336';
                    submitBtn.style.color = 'white';
                }
            } catch (error) {
                alert("Si è verificato un errore di connessione. Riprova più tardi.");
                submitBtn.textContent = 'Errore di connessione!';
                submitBtn.style.backgroundColor = '#f44336';
                submitBtn.style.color = 'white';
            } finally {
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 4000);
            }
        });
    }

    // 6. Configured Parallax Effect for the Backgrounds on Scroll
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 1024) return; // Disable JS parallax on mobile
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    let scrollPosition = window.pageYOffset;
                    let sectionPosition = parallaxBg.parentElement.offsetTop;
                    // Only parallax if the section is in view
                    if (scrollPosition > sectionPosition - window.innerHeight && scrollPosition < sectionPosition + parallaxBg.parentElement.offsetHeight) {
                        let offset = (scrollPosition - sectionPosition) * 0.4;
                        parallaxBg.style.transform = `translateY(${offset}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // 7. Before/After Sliders
    const baSliders = document.querySelectorAll('.ba-slider');
    
    baSliders.forEach(slider => {
        const handle = slider.querySelector('.ba-handle');
        const beforeImage = slider.querySelector('.ba-before');
        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let x = clientX - rect.left;
            
            x = Math.max(0, Math.min(x, rect.width));
            const percentage = (x / rect.width) * 100;
            
            handle.style.left = `${percentage}%`;
            beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        };

        // Mouse Events
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientX);
        });
        
        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });

        // Touch Events
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
        });
        
        window.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent scrolling while dragging
            updateSlider(e.touches[0].clientX);
        }, { passive: false });
    });

    // 8. Cookie Banner Handling (GDPR 2026)
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieModal = document.getElementById('cookieModal');
    
    // Banner Buttons
    const acceptAllBtn = document.getElementById('acceptAllBtn');
    const rejectAllBtn = document.getElementById('rejectAllBtn');
    const customizeBtn = document.getElementById('customizeBtn');
    const closeBannerBtn = document.getElementById('closeBannerBtn');
    
    // Modal Elements
    const closeModalBtn = document.getElementById('closeModalBtn');
    const savePreferencesBtn = document.getElementById('savePreferencesBtn');
    const toggleAnalytics = document.getElementById('toggleAnalytics');
    const toggleMarketing = document.getElementById('toggleMarketing');

    const GA4_ID = '[INSERIRE_ID_GA4]';

    const loadGA4 = () => {
        if(window.ga4Loaded) return;
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
        document.head.appendChild(script1);
        
        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}');
        `;
        document.head.appendChild(script2);
        window.ga4Loaded = true;
    };

    const loadCalendly = () => {
        const blockedWidgets = document.querySelectorAll('.calendly-inline-widget[data-blocked-url]');
        
        const initWidgets = () => {
            blockedWidgets.forEach(widget => {
                const url = widget.getAttribute('data-blocked-url');
                if (url) {
                    widget.removeAttribute('data-blocked-url');
                    widget.setAttribute('data-url', url);
                    
                    if (window.Calendly && widget.innerHTML.trim() === '') {
                        window.Calendly.initInlineWidget({
                            url: url,
                            parentElement: widget
                        });
                    }
                }
            });
        };

        if(window.calendlyLoaded) {
            if (window.Calendly) initWidgets();
            return;
        }

        window.calendlyLoaded = true;
        const script = document.createElement('script');
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        script.onload = () => {
            initWidgets();
        };
        document.body.appendChild(script);
    };

    const applyConsent = (consent) => {
        if (consent.analytics) {
            loadGA4();
        }
        if (consent.marketing) {
            loadCalendly();
        }
    };

    const saveConsent = (analytics, marketing) => {
        const consent = {
            technical: true,
            analytics: analytics,
            marketing: marketing,
            timestamp: new Date().getTime()
        };
        // 6 months expiration
        localStorage.setItem('lorenzo_cookie_consent', JSON.stringify(consent));
        applyConsent(consent);
        
        if(cookieBanner) cookieBanner.classList.remove('show');
        if(cookieModal) cookieModal.classList.remove('show');
    };

    const checkConsent = () => {
        const saved = localStorage.getItem('lorenzo_cookie_consent');
        if (saved) {
            try {
                const consent = JSON.parse(saved);
                const sixMonths = 180 * 24 * 60 * 60 * 1000;
                if (new Date().getTime() - consent.timestamp < sixMonths) {
                    applyConsent(consent);
                    return; // valid consent exists
                } else {
                    localStorage.removeItem('lorenzo_cookie_consent'); // expired
                }
            } catch (e) {
                // invalid JSON
            }
        }
        
        // No valid consent, show banner
        if (cookieBanner) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }
    };

    if (cookieBanner) {
        if (acceptAllBtn) acceptAllBtn.addEventListener('click', () => saveConsent(true, true));
        if (rejectAllBtn) rejectAllBtn.addEventListener('click', () => saveConsent(false, false));
        if (closeBannerBtn) closeBannerBtn.addEventListener('click', () => saveConsent(false, false));
        if (customizeBtn) customizeBtn.addEventListener('click', () => {
            cookieModal.classList.add('show');
            // Check current toggles state based on local storage if available
            const saved = localStorage.getItem('lorenzo_cookie_consent');
            if(saved) {
                try {
                    const consent = JSON.parse(saved);
                    if(toggleAnalytics) toggleAnalytics.checked = consent.analytics;
                    if(toggleMarketing) toggleMarketing.checked = consent.marketing;
                } catch(e) {}
            }
        });
    }

    if (cookieModal) {
        if (closeModalBtn) closeModalBtn.addEventListener('click', () => cookieModal.classList.remove('show'));
        if (savePreferencesBtn) savePreferencesBtn.addEventListener('click', () => {
            saveConsent(toggleAnalytics.checked, toggleMarketing.checked);
        });
        
        // Close on clicking outside modal
        cookieModal.addEventListener('click', (e) => {
            if (e.target === cookieModal) cookieModal.classList.remove('show');
        });
    }

    // Global function to reopen banner from footer or Calendly buttons
    window.openCookieBanner = () => {
        if (cookieBanner) cookieBanner.classList.add('show');
    };

    // Override original Calendly.initPopupWidget if marketing is not accepted
    window.openCalendlyPopup = (url) => {
        const saved = localStorage.getItem('lorenzo_cookie_consent');
        let hasMarketingConsent = false;
        if(saved) {
            try {
                const consent = JSON.parse(saved);
                const sixMonths = 180 * 24 * 60 * 60 * 1000;
                if(consent.marketing && new Date().getTime() - consent.timestamp < sixMonths) {
                    hasMarketingConsent = true;
                }
            } catch(e) {}
        }
        
        if(hasMarketingConsent && window.Calendly) {
            Calendly.initPopupWidget({ url: url });
        } else {
            alert('Per procedere con la prenotazione via Calendly, è necessario accettare i cookie di Marketing (Profilazione). Si aprirà ora il pannello di controllo.');
            window.openCookieBanner();
            if(cookieModal) cookieModal.classList.add('show'); // Apri anche il modal
        }
    };

    checkConsent();

    // 9. Simple AI Chatbot Widget
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    if (chatbotToggle && chatbotWindow) {
        // Toggle window
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            if (chatbotWindow.classList.contains('active')) {
                chatbotInput.focus();
            }
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });

        // Responses Logic
        const responses = [
            { keywords: ["prezz", "cost", "preventiv", "quanto", "pagare", "euro"], reply: "I nostri prezzi variano in base alle condizioni dell'auto e al trattamento scelto. I lavaggi completi hanno prezzi base, mentre i trattamenti nanotecnologici richiedono un preventivo su misura. Puoi usare il modulo nella sezione contatti o il pulsante 'Prenota Ora' per scriverci su WhatsApp." },
            { keywords: ["dove", "indirizzo", "trova", "sede", "posizione", "siete"], reply: "Ci troviamo in Via Liviana, 126, 35038 Torreglia (PD), Italia. Puoi trovare la mappa nella sezione contatti." },
            { keywords: ["orari", "aperto", "chiuso", "quando"], reply: "Riceviamo esclusivamente su appuntamento. Puoi contattarci tramite WhatsApp o il modulo sul sito per fissare un incontro." },
            { keywords: ["serviz", "lucidatura", "interni", "nanotecnologia", "fari", "ceramico", "lavaggio"], reply: "Offriamo servizi di car detailing completo: lavaggio a mano, lucidatura, ripristino interni, protezione nanotecnologica, restauro fari e molto altro! Scopri la sezione 'Servizi' per i dettagli." },
            { keywords: ["ciao", "salve", "buongiorno", "buonasera", "hey"], reply: "Ciao! Benvenuto al Lorenzo Garage Detailing. Come posso aiutarti?" },
            { keywords: ["contatti", "numero", "telefono", "whatsapp", "email", "mail"], reply: "Puoi contattarci al numero +39 347 552 5445 (scrivendoci su WhatsApp) o alla mail info@lorenzogaragedetailing.it." }
        ];

        const sendUserMessage = () => {
            const text = chatbotInput.value.trim();
            if (!text) return;

            // Add user message to UI
            addMessage(text, 'user-msg');
            chatbotInput.value = '';

            // Generate AI response
            setTimeout(() => {
                let aiReply = "Mi dispiace, non ho compreso appieno. Per richieste specifiche, contattaci via WhatsApp al +39 347 552 5445 o usa il modulo contatti in fondo alla pagina.";
                
                const lowerText = text.toLowerCase();
                for (let res of responses) {
                    if (res.keywords.some(kw => lowerText.includes(kw))) {
                        aiReply = res.reply;
                        break;
                    }
                }
                
                addMessage(aiReply, 'ai-msg');
            }, 600);
        };

        const addMessage = (text, typeClass) => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('msg', typeClass);
            msgDiv.textContent = text;
            chatbotMessages.appendChild(msgDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        };

        chatbotSend.addEventListener('click', sendUserMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });
    }
    // 10. Lightbox and Infinite Slider JS Logic
    const initSliderAndLightbox = () => {
        // --- Lightbox Logic ---
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        
        // Find all images that should open in the lightbox
        const galleryElements = document.querySelectorAll('.gallery-item, .slide');
        let currentImageIndex = 0;
        let imagesSrc = [];

        if (lightbox && galleryElements.length > 0) {
            // Raccogliamo i src unici per evitare duplicati nello slider
            const uniqueSrcs = new Set();
            galleryElements.forEach(el => {
                const img = el.querySelector('img');
                if (img && !uniqueSrcs.has(img.src)) {
                    uniqueSrcs.add(img.src);
                    imagesSrc.push(img.src);
                }
            });

            galleryElements.forEach(el => {
                el.addEventListener('click', () => {
                    const img = el.querySelector('img');
                    if (!img) return;
                    const src = img.src;
                    currentImageIndex = imagesSrc.indexOf(src);
                    if (currentImageIndex === -1) currentImageIndex = 0;
                    updateLightboxImage();
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            const updateLightboxImage = () => { lightboxImg.src = imagesSrc[currentImageIndex]; };
            const closeLightbox = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
            const showPrev = () => { currentImageIndex = (currentImageIndex - 1 + imagesSrc.length) % imagesSrc.length; updateLightboxImage(); };
            const showNext = () => { currentImageIndex = (currentImageIndex + 1) % imagesSrc.length; updateLightboxImage(); };

            lightboxClose.addEventListener('click', closeLightbox);
            lightboxPrev.addEventListener('click', showPrev);
            lightboxNext.addEventListener('click', showNext);
            lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

            document.addEventListener('keydown', e => {
                if (!lightbox.classList.contains('active')) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            });
        }

        // --- Infinite Slider JS Auto-scroll & Navigation Logic ---
        const slideTrack = document.querySelector('.slide-track');
        if (!slideTrack) return;

        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.slider-btn.prev-btn');
        const nextBtn = document.querySelector('.slider-btn.next-btn');

        const uniqueSlidesCount = Math.floor(slides.length / 2);
        let position = 0;
        let animationId;
        let isHovered = false;
        
        // Calculate the exact width of a single full set (slide width + gap)
        let singleSlideWidth = slides[0].offsetWidth; 
        let gap = 20; 
        let shiftWidth = singleSlideWidth + gap;
        let setWidth = shiftWidth * uniqueSlidesCount;

        const animateSlider = () => {
            if (!isHovered) {
                position -= 1; // Speed of auto-scroll
                if (Math.abs(position) >= setWidth) {
                    position = 0; // Seamless reset
                }
                slideTrack.style.transform = `translateX(${position}px)`;
            }
            animationId = requestAnimationFrame(animateSlider);
        };

        // Start animation
        animateSlider();

        // Pause on hover
        const sliderContainer = document.querySelector('.infinite-slider');
        sliderContainer.addEventListener('mouseenter', () => isHovered = true);
        sliderContainer.addEventListener('mouseleave', () => isHovered = false);

        // Arrows manual navigation
        const moveManual = (direction) => {
            // Add transitioning class for smooth jump
            slideTrack.classList.add('transitioning');
            isHovered = true; // Pause auto-scroll temporarily
            
            position += direction * shiftWidth; // Move by 1 slide
            
            // Loop boundaries logic
            if (position > 0) {
                // If moving left past the start, jump to the 2nd set seamlessly without transition, then slide
                slideTrack.classList.remove('transitioning');
                position = -setWidth; 
                slideTrack.style.transform = `translateX(${position}px)`;
                
                // Force reflow
                void slideTrack.offsetWidth; 
                
                slideTrack.classList.add('transitioning');
                position += direction * shiftWidth;
            } else if (Math.abs(position) >= setWidth * 2 - shiftWidth) {
                // Moving right past the end
                slideTrack.classList.remove('transitioning');
                position = -setWidth + shiftWidth; 
                slideTrack.style.transform = `translateX(${position}px)`;
                
                void slideTrack.offsetWidth;
                
                slideTrack.classList.add('transitioning');
                position += direction * shiftWidth;
            }

            slideTrack.style.transform = `translateX(${position}px)`;

            // After transition finishes, resume
            setTimeout(() => {
                slideTrack.classList.remove('transitioning');
                // Ensure position bounds are normalized silently
                if (Math.abs(position) >= setWidth) {
                    position = position % setWidth;
                    if(position > 0) position = position - setWidth;
                    slideTrack.style.transform = `translateX(${position}px)`;
                }
                isHovered = false;
            }, 400); // 400ms matches CSS transition
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => { e.stopPropagation(); moveManual(1); }); // Positive moves track logic backward = prev slide
            nextBtn.addEventListener('click', (e) => { e.stopPropagation(); moveManual(-1); }); // Negative moves track forward = next slide
        }
    };

    initSliderAndLightbox();

    // 11. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other accordions
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });

        // Open FAQ if URL hash matches an ID
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetItem = document.getElementById(targetId);
            if (targetItem) {
                setTimeout(() => {
                    targetItem.querySelector('.faq-question').click();
                    targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            }
        }
    }

    // 12. WhatsApp Popup Delay
    const waPopup = document.getElementById('wa-popup');
    const waPopupClose = document.getElementById('wa-popup-close');
    
    if (waPopup) {
        // Show after 7 seconds
        setTimeout(() => {
            waPopup.classList.add('show');
        }, 8500);
        
        if (waPopupClose) {
            waPopupClose.addEventListener('click', () => {
                waPopup.classList.remove('show');
            });
        }
    }

    // 13. Service Card Mobile Accordion
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                // Remove expanded from others
                serviceCards.forEach(c => {
                    if (c !== card) c.classList.remove('expanded');
                });
                card.classList.toggle('expanded');
            }
        });
    });
});
