/* ==========================================================================
   OMAR DESOUKY | CORE INTERACTIVE LOGIC (app.js)
   Vanilla JS Engine for Rich Micro-interactions, Calculators & Checkout Flows
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Global Navigation & Mobile Drawer ---
    const mainHeader = document.querySelector('.main-header');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    
    // Smooth Header Shrink on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scroll-scrolled');
        } else {
            mainHeader.classList.remove('scroll-scrolled');
        }
        
        // Sticky Footer CTA Trigger
        toggleStickyCTA();
    });
    
    // Mobile Navigation Drawer Toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileDrawer.classList.toggle('active');
        
        // Hamburger animation
        const spans = mobileToggle.querySelectorAll('span');
        if (mobileDrawer.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close Drawer when clicking links
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('active');
            mobileToggle.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });


    // --- 2. Interactive Before/After Comparison Slider ---
    const slider = document.getElementById('before-after-slider');
    const afterImgWrap = document.getElementById('after-img-wrap');
    const sliderHandle = document.getElementById('slider-handle');
    
    if (slider && afterImgWrap && sliderHandle) {
        let isDragging = false;
        
        const moveSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            // Calculate relative offset (0 to 1)
            let offset = (clientX - rect.left) / rect.width;
            
            // Constrain between 0% and 100%
            if (offset < 0) offset = 0;
            if (offset > 1) offset = 1;
            
            // Set styles
            const percentage = offset * 100;
            afterImgWrap.style.width = `${percentage}%`;
            sliderHandle.style.left = `${percentage}%`;
        };
        
        // Mouse Down / Touch Start
        const startDrag = () => { isDragging = true; };
        sliderHandle.addEventListener('mousedown', startDrag);
        sliderHandle.addEventListener('touchstart', startDrag, { passive: true });
        
        // Mouse Up / Touch End (Global to avoid losing focus)
        const stopDrag = () => { isDragging = false; };
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
        
        // Mouse Move / Touch Move (Global to track smooth sweeping)
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveSlider(e.clientX);
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches[0]) {
                moveSlider(e.touches[0].clientX);
            }
        }, { passive: true });
        
        // Initial setup sweep to 50%
        afterImgWrap.style.width = '50%';
        sliderHandle.style.left = '50%';
    }


    // --- 3. Operational Guidelines Panel Selector & Water Estimator ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Toggle active states on tab buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle active states on panels
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('id') === `panel-${targetTab}`) {
                    panel.classList.add('active');
                }
            });
        });
    });
    
    // Live Guidelines Water Target Calculator
    const waterInput = document.getElementById('water-weight-input');
    const waterResult = document.getElementById('water-result-val');
    
    if (waterInput && waterResult) {
        const calcWater = () => {
            const weight = parseFloat(waterInput.value) || 0;
            // standard athletic hydration model: 40ml water per kg bodyweight
            const recommendedWater = (weight * 0.04).toFixed(1);
            
            // Clamp logically
            if (weight > 30) {
                waterResult.textContent = recommendedWater;
            } else {
                waterResult.textContent = '3.0';
            }
        };
        
        waterInput.addEventListener('input', calcWater);
        calcWater(); // run initial
    }


    // --- 4. High-End Macro & Calorie Calculator Logic ---
    const macroForm = document.getElementById('macro-form');
    const targetCaloriesDisplay = document.getElementById('target-calories');
    const goalSubtext = document.getElementById('goal-subtext');
    const macroProtein = document.getElementById('macro-protein');
    const macroCarbs = document.getElementById('macro-carbs');
    const macroFats = document.getElementById('macro-fats');
    
    const macroProteinCal = document.getElementById('macro-protein-cal');
    const macroCarbsCal = document.getElementById('macro-carbs-cal');
    const macroFatsCal = document.getElementById('macro-fats-cal');
    
    if (macroForm) {
        // Toggle selection visuals
        const setupRadioButtons = (btnClass, containerClass) => {
            const btns = document.querySelectorAll(`.${btnClass}`);
            btns.forEach(btn => {
                const radio = btn.querySelector('input');
                btn.addEventListener('click', () => {
                    document.querySelectorAll(`.${btnClass}`).forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    radio.checked = true;
                });
            });
        };
        
        setupRadioButtons('gender-btn', 'gender-selection');
        setupRadioButtons('goal-btn', 'goal-selection');
        
        macroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Fetch inputs
            const gender = document.querySelector('input[name="gender"]:checked').value;
            const weight = parseFloat(document.getElementById('calc-weight').value);
            const height = parseFloat(document.getElementById('calc-height').value);
            const age = parseFloat(document.getElementById('calc-age').value);
            const activity = parseFloat(document.getElementById('calc-activity').value);
            const goal = document.querySelector('input[name="goal"]:checked').value;
            
            // BMR - Mifflin-St Jeor Formula
            let bmr = 0;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }
            
            // Total Daily Energy Expenditure (TDEE)
            const tdee = Math.round(bmr * activity);
            
            // Target Calorie Budgets based on Goal
            let targetCalories = tdee;
            let goalLabel = '';
            
            if (goal === 'loss') {
                // Optimized 20% deficit for maximum fat loss without muscle catabolism
                targetCalories = Math.round(tdee * 0.8);
                // Clamp safe minimal budgets
                const minCal = (gender === 'male') ? 1500 : 1200;
                if (targetCalories < minCal) targetCalories = minCal;
                goalLabel = "Optimized with a precise 20% caloric deficit to accelerate metabolic fat burning.";
            } else if (goal === 'recomp') {
                // Caloric maintenance for body recomposition
                targetCalories = tdee;
                goalLabel = "Maintenance calorie baseline optimized to fuel intense strength training and build muscle while melting abdominal fat.";
            } else if (goal === 'gain') {
                // Lean caloric surplus for hypertrophy
                targetCalories = Math.round(tdee + 300);
                goalLabel = "Lean muscle surplus designed to fuel muscle tissue growth while minimizing fat gain.";
            }
            
            // Biomechanics Signature Macro Formula
            // Protein: High targeting 2.2g per kg bodyweight
            let proteinGrams = Math.round(weight * 2.2);
            // Fats: 0.9g per kg bodyweight
            let fatGrams = Math.round(weight * 0.9);
            
            // Calories from protein/fats
            let proteinCals = proteinGrams * 4;
            let fatCals = fatGrams * 9;
            
            // Remaining calories allocated to Carbs
            let remainingCals = targetCalories - (proteinCals + fatCals);
            let carbGrams = Math.round(remainingCals / 4);
            
            // Safety fallback if remaining calories is extremely tight
            if (carbGrams < 50) {
                // Fallback to classic athletic percentage splits (40% carbs, 30% protein, 30% fat)
                proteinGrams = Math.round((targetCalories * 0.30) / 4);
                fatGrams = Math.round((targetCalories * 0.30) / 9);
                carbGrams = Math.round((targetCalories * 0.40) / 4);
                
                proteinCals = proteinGrams * 4;
                fatCals = fatGrams * 9;
            }
            
            // Update UI elements
            targetCaloriesDisplay.textContent = targetCalories.toLocaleString();
            goalSubtext.textContent = goalLabel;
            
            macroProtein.textContent = `${proteinGrams}g`;
            macroCarbs.textContent = `${carbGrams}g`;
            macroFats.textContent = `${fatGrams}g`;
            
            macroProteinCal.textContent = `${proteinCals} kcal`;
            macroCarbsCal.textContent = `${Math.round(carbGrams * 4)} kcal`;
            macroFatsCal.textContent = `${fatCals} kcal`;
            
            // Animate Macro bars dynamically
            const totalMacrosCal = proteinCals + Math.round(carbGrams * 4) + fatCals;
            document.querySelector('.macro-result-card.protein .bar-fill').style.width = `${(proteinCals / totalMacrosCal) * 100}%`;
            document.querySelector('.macro-result-card.carbs .bar-fill').style.width = `${((carbGrams * 4) / totalMacrosCal) * 100}%`;
            document.querySelector('.macro-result-card.fats .bar-fill').style.width = `${(fatCals / totalMacrosCal) * 100}%`;
            
            // Smoothly scroll to results
            document.getElementById('calculator-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }


    // --- 5. Egyptian Market Instapay & WhatsApp Checkout System ---
    const checkoutModal = document.getElementById('checkout-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const pkgTriggers = document.querySelectorAll('.checkout-trigger-btn');
    
    // Steps elements
    const steps = [
        document.getElementById('modal-step-1'),
        document.getElementById('modal-step-2'),
        document.getElementById('modal-step-3')
    ];
    
    const indicators = [
        document.getElementById('step-ind-1'),
        document.getElementById('step-ind-2'),
        document.getElementById('step-ind-3')
    ];
    
    // Dynamic Data parameters
    let currentSelectedPackage = {
        name: 'Velocity',
        price: '2000',
        token: ''
    };
    
    // Open Modal and lock package details
    pkgTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const pkgName = btn.getAttribute('data-package');
            const pkgPrice = btn.getAttribute('data-price');
            
            currentSelectedPackage.name = pkgName;
            currentSelectedPackage.price = pkgPrice;
            
            // Set initial dynamic fields in Modal Step 1
            document.getElementById('selected-package-name').textContent = pkgName;
            document.getElementById('selected-package-price').textContent = `${parseFloat(pkgPrice).toLocaleString()} EGP`;
            
            // Open Modal
            checkoutModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // lock scroll
            
            // Reset modal steps
            goToStep(0);
        });
    });
    
    // Close Modal actions
    const closeModal = () => {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // release scroll
    };
    
    closeModalBtn.addEventListener('click', closeModal);
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeModal();
    });
    
    // Modal Navigation Logic
    const goToStep = (index) => {
        steps.forEach((step, i) => {
            if (i === index) {
                step.classList.add('active');
                indicators[i].classList.add('active');
            } else {
                step.classList.remove('active');
                indicators[i].classList.remove('active');
            }
        });
        
        // Auto scroll step container back to top
        document.querySelector('.modal-scroll-container').scrollTop = 0;
    };
    
    // Step 1: Input details and proceed
    const nextStep1Btn = document.getElementById('next-step-1-btn');
    nextStep1Btn.addEventListener('click', () => {
        const clientNameInput = document.getElementById('client-name');
        const clientPhoneInput = document.getElementById('client-phone');
        
        // Basic Form Validation
        if (!clientNameInput.value.trim()) {
            clientNameInput.focus();
            clientNameInput.style.borderColor = '#FF453A';
            return;
        } else {
            clientNameInput.style.borderColor = '';
        }
        
        if (!clientPhoneInput.value.trim()) {
            clientPhoneInput.focus();
            clientPhoneInput.style.borderColor = '#FF453A';
            return;
        } else {
            clientPhoneInput.style.borderColor = '';
        }
        
        // Hydrate Step 2 billing texts
        document.getElementById('billing-package-name').textContent = currentSelectedPackage.name;
        document.getElementById('billing-package-price').textContent = `${parseFloat(currentSelectedPackage.price).toLocaleString()} EGP`;
        
        goToStep(1);
    });
    
    // Step 2: Instapay Completed
    const nextStep2Btn = document.getElementById('next-step-2-btn');
    const prevStep2Btn = document.getElementById('prev-step-2-btn');
    
    prevStep2Btn.addEventListener('click', () => goToStep(0));
    
    nextStep2Btn.addEventListener('click', () => {
        // Generate a random elite Transaction Token
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        currentSelectedPackage.token = `ODS-${new Date().getFullYear()}-${randomDigits}`;
        
        goToStep(2);
    });
    
    // Modal Step 3 triggers
    document.getElementById('back-to-packages-btn').addEventListener('click', closeModal);
    
    // Clipboard Copy Helper for Instapay address
    const copyAddressBtn = document.getElementById('copy-address-btn');
    const copyBtnText = document.getElementById('copy-btn-text');
    
    copyAddressBtn.addEventListener('click', () => {
        const instapayAddress = document.getElementById('instapay-address').textContent;
        
        navigator.clipboard.writeText(instapayAddress).then(() => {
            // success feedback
            copyBtnText.textContent = 'COPIED!';
            copyAddressBtn.style.backgroundColor = '#FFFFFF';
            copyAddressBtn.style.color = '#0B0B0C';
            
            setTimeout(() => {
                copyBtnText.textContent = 'COPY';
                copyAddressBtn.style.backgroundColor = '';
                copyAddressBtn.style.color = '';
            }, 2500);
        }).catch(err => {
            console.error('Failed to copy to clipboard', err);
        });
    });
    
    // WhatsApp Redirect Redirection compiler
    const whatsappConfirmBtn = document.getElementById('whatsapp-confirm-btn');
    
    whatsappConfirmBtn.addEventListener('click', () => {
        const clientName = document.getElementById('client-name').value.trim();
        const clientPhone = document.getElementById('client-phone').value.trim();
        const clientNotes = document.getElementById('client-notes').value.trim() || 'No additional notes.';
        
        // Coach details
        const coachPhone = '201129808526'; // Redirection number
        
        // Message template
        const waText = `Hello Coach Omar Desouky,
My name is *${clientName}*. I am ready to Own Your System!

I have selected the *Tier ${currentSelectedPackage.name === 'Kickstart' ? '01' : currentSelectedPackage.name === 'Velocity' ? '02' : '03'}: ${currentSelectedPackage.name}* Package (3 Months) for *${parseFloat(currentSelectedPackage.price).toLocaleString()} EGP*.

Client Details:
- WhatsApp Contact: ${clientPhone}
- Goal Target: "${clientNotes}"
- System Registration Token: ${currentSelectedPackage.token}

I have successfully completed the Instapay transfer of *${parseFloat(currentSelectedPackage.price).toLocaleString()} EGP* to *omardesoke@instapay*. 

Sending this to lock in my coaching slot! Here is my receipt screenshot:`;

        // URL Encoded link compilation
        const encodedText = encodeURIComponent(waText);
        const waUrl = `https://wa.me/${coachPhone}?text=${encodedText}`;
        
        // Redirect client in a new tab
        window.open(waUrl, '_blank');
        
        // Close modal
        closeModal();
    });


    // --- 6. Scroll Reveal Animations (High-performance Intersection Observer) ---
    // Target both standard blocks and cards
    const animatedElements = document.querySelectorAll('.fade-in-element, .scroll-reveal-card');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.12 // trigger when 12% is visible
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target); // run once
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => el.classList.add('animated'));
    }


    // --- 7. Sticky Footer CTA Reveal logic ---
    const pricingSection = document.getElementById('packages');
    const stickyCTA = document.querySelector('.sticky-footer-cta');
    
    const toggleStickyCTA = () => {
        if (!stickyCTA || !pricingSection) return;
        
        const scrollPosition = window.scrollY + window.innerHeight;
        const pricingTop = pricingSection.offsetTop;
        const pricingBottom = pricingTop + pricingSection.offsetHeight;
        
        // Show sticky banner after scrolling past 600px, but hide it when reaching the package cards themselves to avoid clutter
        if (window.scrollY > 600 && (scrollPosition < pricingTop || window.scrollY > pricingBottom)) {
            stickyCTA.classList.add('active');
        } else {
            stickyCTA.classList.remove('active');
        }
    };

});
