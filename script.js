// ===============================================
// Professional Investment Market - Interactive Presentation
// ===============================================

class PresentationApp {
    constructor() {
        this.currentPage = 0;
        this.totalPages = 4;
        this.isTransitioning = false;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }

    init() {
        this.setupCustomCursor();
        this.setupNavigation();
        this.setupScrollNavigation();
        this.setupParallax();
        this.setupCardHoverEffects();
        this.setupKeyboardNavigation();
        this.addInteractiveElements();
        this.setupNetworkCanvas();
        this.setupSegmentDiagram();
    }

    // ===============================================
    // Custom Cursor
    // ===============================================
    setupCustomCursor() {
        const cursor = document.querySelector('.cursor-follower');
        const cursorGlow = document.querySelector('.cursor-glow');
        
        if (!cursor || !cursorGlow) return;

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Smooth cursor follow
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            });
            
            // Delayed glow follow
            setTimeout(() => {
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.top = `${e.clientY}px`;
            }, 50);
        });

        // Cursor hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .nav-dot, .feature-card, .contact-card, .process-step');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                cursorGlow.classList.add('hovering');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                cursorGlow.classList.remove('hovering');
            });
        });
    }

    // ===============================================
    // Navigation
    // ===============================================
    setupNavigation() {
        const navDots = document.querySelectorAll('.nav-dot');
        
        navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const pageIndex = parseInt(dot.dataset.page);
                if (pageIndex !== this.currentPage && !this.isTransitioning) {
                    this.navigateToPage(pageIndex);
                }
            });
        });

        // CTA buttons navigation
        document.querySelectorAll('.btn-nav, .btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Navigate to next page or contact
                if (this.currentPage < this.totalPages - 1) {
                    this.navigateToPage(this.currentPage + 1);
                }
            });
        });
    }

    navigateToPage(pageIndex) {
        if (this.isTransitioning || pageIndex === this.currentPage) return;
        
        this.isTransitioning = true;
        
        // Get elements
        const pages = document.querySelectorAll('.page');
        const navDots = document.querySelectorAll('.nav-dot');
        const transition = document.querySelector('.page-transition');
        
        // Start transition animation
        transition.classList.add('animating');
        
        // Update nav dots
        navDots.forEach(dot => dot.classList.remove('active'));
        navDots[pageIndex].classList.add('active');
        
        // Change page at midpoint of transition
        setTimeout(() => {
            pages.forEach(page => page.classList.remove('active'));
            pages[pageIndex].classList.add('active');
            this.currentPage = pageIndex;
            
            // Reset animations for new page
            this.resetPageAnimations(pages[pageIndex]);
        }, 500);
        
        // End transition
        setTimeout(() => {
            transition.classList.remove('animating');
            // Reset transition slices
            document.querySelectorAll('.transition-slice').forEach(slice => {
                slice.style.animation = 'none';
                slice.offsetHeight; // Trigger reflow
                slice.style.animation = '';
            });
            this.isTransitioning = false;
        }, 1200);
    }

    resetPageAnimations(page) {
        // Reset all animated elements
        const animatedElements = page.querySelectorAll('.title-word, .section-tag, .feature-card, .process-step, .contact-card, .contact-cta, .timeline-line');
        
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = '';
        });
    }

    // ===============================================
    // Scroll Navigation
    // ===============================================
    setupScrollNavigation() {
        let scrollTimeout;
        let lastScrollTime = 0;
        const scrollCooldown = 1500; // Cooldown between page changes
        
        // Mouse wheel navigation
        window.addEventListener('wheel', (e) => {
            const now = Date.now();
            if (now - lastScrollTime < scrollCooldown || this.isTransitioning) return;
            
            if (e.deltaY > 50 && this.currentPage < this.totalPages - 1) {
                lastScrollTime = now;
                this.navigateToPage(this.currentPage + 1);
            } else if (e.deltaY < -50 && this.currentPage > 0) {
                lastScrollTime = now;
                this.navigateToPage(this.currentPage - 1);
            }
        }, { passive: true });

        // Touch navigation
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50 && !this.isTransitioning) {
                const now = Date.now();
                if (now - lastScrollTime < scrollCooldown) return;
                lastScrollTime = now;
                
                if (diff > 0 && this.currentPage < this.totalPages - 1) {
                    this.navigateToPage(this.currentPage + 1);
                } else if (diff < 0 && this.currentPage > 0) {
                    this.navigateToPage(this.currentPage - 1);
                }
            }
        }, { passive: true });
    }

    // ===============================================
    // Keyboard Navigation
    // ===============================================
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;
            
            switch(e.key) {
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    if (this.currentPage < this.totalPages - 1) {
                        this.navigateToPage(this.currentPage + 1);
                    }
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    if (this.currentPage > 0) {
                        this.navigateToPage(this.currentPage - 1);
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    this.navigateToPage(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.navigateToPage(this.totalPages - 1);
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                    const pageNum = parseInt(e.key) - 1;
                    if (pageNum < this.totalPages) {
                        this.navigateToPage(pageNum);
                    }
                    break;
            }
        });
    }

    // ===============================================
    // Parallax Effects
    // ===============================================
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        document.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const moveX = (e.clientX - centerX) / centerX;
            const moveY = (e.clientY - centerY) / centerY;
            
            parallaxElements.forEach(el => {
                const intensity = parseFloat(el.dataset.parallax) || 0.05;
                const x = moveX * intensity * 100;
                const y = moveY * intensity * 100;
                
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            // Move gradient orbs
            document.querySelectorAll('.gradient-orb').forEach((orb, index) => {
                const speed = 0.02 + (index * 0.01);
                orb.style.transform = `translate(${moveX * speed * 50}px, ${moveY * speed * 50}px)`;
            });
            
            // Move floating shapes
            document.querySelectorAll('.shape').forEach((shape, index) => {
                const speed = 0.03 + (index * 0.01);
                shape.style.transform = `translate(${moveX * speed * 30}px, ${moveY * speed * 30}px)`;
            });
        });
    }

    // ===============================================
    // Card Hover Effects
    // ===============================================
    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
                
                // 3D tilt effect
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (e.clientY - rect.top - centerY) / 20;
                const rotateY = (e.clientX - rect.left - centerX) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });

        // Contact cards 3D effect
        const contactCards = document.querySelectorAll('.contact-card');
        
        contactCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (e.clientY - rect.top - centerY) / 25;
                const rotateY = (e.clientX - rect.left - centerX) / 25;
                
                card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    // ===============================================
    // Network Canvas - Connecting Dots
    // ===============================================
    setupNetworkCanvas() {
        const canvas = document.getElementById('networkCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let animationId;
        let particles = [];
        const particleCount = 60;
        const connectionDistance = 150;
        const mouseRadius = 200;
        
        // Colors
        const colors = [
            { r: 211, g: 158, b: 70 },   // Gold
            { r: 0, g: 51, b: 99 },      // Navy
        ];
        
        // Resize canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        // Create particle
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 3 + 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.originalRadius = this.radius;
            }
            
            update(mouseX, mouseY) {
                // Move particle
                this.x += this.vx;
                this.y += this.vy;
                
                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                
                // Mouse interaction - attract particles
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouseRadius) {
                    const force = (mouseRadius - dist) / mouseRadius;
                    this.vx += dx * force * 0.0005;
                    this.vy += dy * force * 0.0005;
                    this.radius = this.originalRadius + force * 2;
                } else {
                    this.radius = this.originalRadius;
                }
                
                // Limit velocity
                const maxSpeed = 0.8;
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > maxSpeed) {
                    this.vx = (this.vx / speed) * maxSpeed;
                    this.vy = (this.vy / speed) * maxSpeed;
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.6)`;
                ctx.fill();
                
                // Glow effect
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.2)`;
                ctx.fill();
            }
        }
        
        // Initialize particles
        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };
        
        // Draw connections
        const drawConnections = (mouseX, mouseY) => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < connectionDistance) {
                        // Check if near mouse
                        const midX = (particles[i].x + particles[j].x) / 2;
                        const midY = (particles[i].y + particles[j].y) / 2;
                        const mouseDist = Math.sqrt(
                            (mouseX - midX) ** 2 + (mouseY - midY) ** 2
                        );
                        
                        let opacity = (1 - dist / connectionDistance) * 0.12;
                        let lineWidth = 0.5;
                        
                        // Stronger connection near mouse
                        if (mouseDist < mouseRadius) {
                            const mouseInfluence = 1 - mouseDist / mouseRadius;
                            opacity += mouseInfluence * 0.15;
                            lineWidth += mouseInfluence * 1;
                        }
                        
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        
                        // Gradient line
                        const gradient = ctx.createLinearGradient(
                            particles[i].x, particles[i].y,
                            particles[j].x, particles[j].y
                        );
                        gradient.addColorStop(0, `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${opacity})`);
                        gradient.addColorStop(1, `rgba(${particles[j].color.r}, ${particles[j].color.g}, ${particles[j].color.b}, ${opacity})`);
                        
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = lineWidth;
                        ctx.stroke();
                    }
                }
                
                // Connect to mouse
                const mouseDistToParticle = Math.sqrt(
                    (mouseX - particles[i].x) ** 2 + (mouseY - particles[i].y) ** 2
                );
                
                if (mouseDistToParticle < mouseRadius * 0.8) {
                    const opacity = (1 - mouseDistToParticle / (mouseRadius * 0.8)) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        };
        
        // Animation loop
        let mouseX = canvas.width / 2;
        let mouseY = canvas.height / 2;
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update(mouseX, mouseY);
                particle.draw();
            });
            
            // Draw connections
            drawConnections(mouseX, mouseY);
            
            animationId = requestAnimationFrame(animate);
        };
        
        // Event listeners
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Initialize
        resizeCanvas();
        initParticles();
        animate();
    }

    // ===============================================
    // Segment Diagram - Detail View
    // ===============================================
    setupSegmentDiagram() {
        const segments = document.querySelectorAll('.info-card');
        const modalPrivate = document.getElementById('presentationModal');
        const modalTransfer = document.getElementById('presentationModalTransfer');
        const modalInnovative = document.getElementById('presentationModalInnovative');
        const modalProject = document.getElementById('presentationModalProject');
        const modalDebt = document.getElementById('presentationModalDebt');
        const closeBtnPrivate = document.getElementById('modalClose');
        const closeBtnTransfer = document.getElementById('modalCloseTransfer');
        const closeBtnInnovative = document.getElementById('modalCloseInnovative');
        const closeBtnProject = document.getElementById('modalCloseProject');
        const closeBtnDebt = document.getElementById('modalCloseDebt');
        
        if (!segments.length) return;
        
        // Open modal based on segment type
        segments.forEach((segment) => {
            segment.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const segmentType = this.dataset.segment;
                
                let targetModal = null;
                
                if (segmentType === 'private' && modalPrivate) {
                    targetModal = modalPrivate;
                } else if (segmentType === 'transfer' && modalTransfer) {
                    targetModal = modalTransfer;
                } else if (segmentType === 'innovative' && modalInnovative) {
                    targetModal = modalInnovative;
                } else if (segmentType === 'project' && modalProject) {
                    targetModal = modalProject;
                } else if (segmentType === 'debt' && modalDebt) {
                    targetModal = modalDebt;
                }
                
                if (targetModal) {
                    targetModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // Reset to intro panel
                    this.resetToIntroPanel(targetModal);
                }
            });
        });
        
        // Close buttons
        if (closeBtnPrivate) {
            closeBtnPrivate.addEventListener('click', () => this.closePresentation('private'));
        }
        if (closeBtnTransfer) {
            closeBtnTransfer.addEventListener('click', () => this.closePresentation('transfer'));
        }
        if (closeBtnInnovative) {
            closeBtnInnovative.addEventListener('click', () => this.closePresentation('innovative'));
        }
        if (closeBtnProject) {
            closeBtnProject.addEventListener('click', () => this.closePresentation('project'));
        }
        if (closeBtnDebt) {
            closeBtnDebt.addEventListener('click', () => this.closePresentation('debt'));
        }
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePresentation('all');
            }
        });
        
        // Setup question boxes navigation for all modals
        this.setupQuestionBoxes(modalPrivate);
        this.setupQuestionBoxes(modalTransfer);
        this.setupQuestionBoxes(modalInnovative);
        this.setupQuestionBoxes(modalProject);
        this.setupQuestionBoxes(modalDebt);
    }

    closePresentation(type = 'all') {
        const modalPrivate = document.getElementById('presentationModal');
        const modalTransfer = document.getElementById('presentationModalTransfer');
        const modalInnovative = document.getElementById('presentationModalInnovative');
        const modalProject = document.getElementById('presentationModalProject');
        const modalDebt = document.getElementById('presentationModalDebt');
        
        if (type === 'private' || type === 'all') {
            if (modalPrivate) {
                modalPrivate.classList.remove('active');
            }
        }
        if (type === 'transfer' || type === 'all') {
            if (modalTransfer) {
                modalTransfer.classList.remove('active');
            }
        }
        if (type === 'innovative' || type === 'all') {
            if (modalInnovative) {
                modalInnovative.classList.remove('active');
            }
        }
        if (type === 'project' || type === 'all') {
            if (modalProject) {
                modalProject.classList.remove('active');
            }
        }
        if (type === 'debt' || type === 'all') {
            if (modalDebt) {
                modalDebt.classList.remove('active');
            }
        }
        document.body.style.overflow = '';
    }

    resetToIntroPanel(modal) {
        if (!modal) return;
        
        // Reset all question boxes
        const questionBoxes = modal.querySelectorAll('.question-box');
        questionBoxes.forEach(box => box.classList.remove('active'));
        
        // Show only intro panel
        const panels = modal.querySelectorAll('.content-panel');
        panels.forEach(panel => {
            if (panel.dataset.panel === 'intro') {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
        
        // Scroll to top in mobile
        if (window.innerWidth < 900) {
            const panelInner = modal.querySelector('.panel-inner.scrollable');
            if (panelInner) {
                panelInner.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    }

    setupQuestionBoxes(modal) {
        if (!modal) return;
        
        const questionBoxes = modal.querySelectorAll('.question-box');
        const panels = modal.querySelectorAll('.content-panel');
        
        questionBoxes.forEach(box => {
            box.addEventListener('click', () => {
                const target = box.dataset.target;
                
                // Update active states within this modal only
                questionBoxes.forEach(b => b.classList.remove('active'));
                box.classList.add('active');
                
                // Show target panel within this modal only
                panels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.dataset.panel === target) {
                        panel.classList.add('active');
                    }
                });
            });
        });
        
        // Setup expandable items
        this.setupExpandableItems(modal);
        
        // Exchange cards interaction (only for private modal)
        if (modal.id === 'presentationModal') {
            this.setupExchangeCards();
        }
    }
    
    setupExchangeCards() {
        const exchangeCards = document.querySelectorAll('.exchange-card');
        const exchangeDetails = document.querySelectorAll('.exchange-detail');
        const detailCloseButtons = document.querySelectorAll('.detail-close');
        
        exchangeCards.forEach(card => {
            card.addEventListener('click', () => {
                const exchange = card.dataset.exchange;
                
                // Toggle active state on cards
                exchangeCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                // Show corresponding detail
                exchangeDetails.forEach(detail => {
                    detail.classList.remove('active');
                    if (detail.dataset.detail === exchange) {
                        detail.classList.add('active');
                        
                        // Scroll to detail in mobile view
                        setTimeout(() => {
                            if (window.innerWidth < 900) {
                                const panelInner = detail.closest('.panel-inner');
                                if (panelInner) {
                                    // Get bounding rectangles
                                    const panelRect = panelInner.getBoundingClientRect();
                                    const detailRect = detail.getBoundingClientRect();
                                    
                                    // Calculate current scroll position
                                    const currentScroll = panelInner.scrollTop;
                                    
                                    // Calculate where detail is relative to panel-inner's top
                                    const detailTopRelative = detailRect.top - panelRect.top + currentScroll;
                                    
                                    // Scroll to show detail at top with small offset
                                    panelInner.scrollTo({
                                        top: detailTopRelative - 15,
                                        behavior: 'smooth'
                                    });
                                }
                            }
                        }, 150);
                    }
                });
            });
        });
        
        // Close buttons
        detailCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                exchangeCards.forEach(c => c.classList.remove('active'));
                exchangeDetails.forEach(d => d.classList.remove('active'));
            });
        });
    }
    
    setupExpandableItems(modal) {
        if (!modal) return;
        
        const expandableItems = modal.querySelectorAll('.expandable-item');
        
        expandableItems.forEach(item => {
            const header = item.querySelector('.expandable-header');
            
            if (header) {
                header.addEventListener('click', () => {
                    // Close other expanded items in the same list
                    const parent = item.closest('.expandable-list');
                    if (parent) {
                        parent.querySelectorAll('.expandable-item').forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });
                    }
                    
                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
    }

    // ===============================================
    // Interactive Elements
    // ===============================================
    addInteractiveElements() {
        // Magnetic buttons
        document.querySelectorAll('.btn-primary, .btn-nav').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });

        // Text scramble effect on hover for titles
        this.setupTextScramble();

        // Ripple effect on buttons
        this.setupRippleEffect();

    }

    setupTextScramble() {
        // Text scramble effect disabled as per user request
    }

    setupRippleEffect() {
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rect = btn.getBoundingClientRect();
                const ripple = document.createElement('span');
                
                ripple.style.cssText = `
                    position: absolute;
                    background: rgba(255,255,255,0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size/2}px`;
                ripple.style.top = `${e.clientY - rect.top - size/2}px`;
                
                btn.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===============================================
// Typewriter Effect for Subtitle
// ===============================================
class TypeWriter {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }

    start(delay = 0) {
        setTimeout(() => this.type(), delay);
    }
}

// ===============================================
// Smooth Scroll Reveal
// ===============================================
class ScrollReveal {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };
        
        this.observer = new IntersectionObserver(this.onIntersection.bind(this), this.observerOptions);
        this.init();
    }

    init() {
        document.querySelectorAll('[data-reveal]').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            this.observer.observe(el);
        });
    }

    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ===============================================
// Magnetic Effect for Elements
// ===============================================
class MagneticElement {
    constructor(element, strength = 0.3) {
        this.element = element;
        this.strength = strength;
        this.init();
    }

    init() {
        this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }

    onMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.element.style.transform = `translate(${x * this.strength}px, ${y * this.strength}px)`;
    }

    onMouseLeave() {
        this.element.style.transform = 'translate(0, 0)';
    }
}

// ===============================================
// Initialize Application
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    const app = new PresentationApp();
    
    // Initialize scroll reveal
    const scrollReveal = new ScrollReveal();
    
    // Add loading animation complete class
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Log initialization
    console.log('🚀 Professional Investment Market Presentation Initialized');
    console.log('📖 Navigation: Use scroll, arrows, or navigation dots');
    console.log('⌨️ Keyboard shortcuts: 1-4 for pages, Arrow keys, Home/End');
});

// ===============================================
// Performance Optimization
// ===============================================
// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate positions if needed
}, 250));

// Preload images for smooth transitions
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) return;
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    });
});

