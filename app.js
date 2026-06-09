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


    // --- 2. Dynamic Bilingual Language Switching Logic ---
    let currentLang = localStorage.getItem('omar_pt_lang') || 'en';
    let updateRoutineOptimizerLanguage = null;

    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('omar_pt_lang', lang);

        const htmlRoot = document.documentElement;
        htmlRoot.classList.remove('lang-en', 'lang-ar');
        htmlRoot.classList.add(`lang-${lang}`);
        htmlRoot.setAttribute('lang', lang);

        // Update all language switcher toggle buttons active states
        const switcherPills = document.querySelectorAll('.lang-switcher-pill');
        switcherPills.forEach(pill => {
            const btnEn = pill.querySelector('[data-lang="en"]');
            const btnAr = pill.querySelector('[data-lang="ar"]');
            if (lang === 'en') {
                btnEn.classList.add('active');
                btnAr.classList.remove('active');
            } else {
                btnAr.classList.add('active');
                btnEn.classList.remove('active');
            }
        });

        // Trigger dynamic routine redraw if registered
        if (typeof updateRoutineOptimizerLanguage === 'function') {
            updateRoutineOptimizerLanguage();
        }
    };

    // Attach click listeners to switcher buttons
    const langBtns = document.querySelectorAll('.lang-btn-switcher');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            setLanguage(selectedLang);
        });
    });

    // Run initial language setup on page load
    setLanguage(currentLang);


    // --- 3. Interactive Before/After Comparison Slider ---
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
                if (e.cancelable) e.preventDefault(); // Lock vertical scrolling while dragging the slider
                moveSlider(e.touches[0].clientX);
            }
        }, { passive: false });
        
        // Initial setup sweep to 50%
        afterImgWrap.style.width = '50%';
        sliderHandle.style.left = '50%';
    }


    // --- 4. Interactive Routine Optimizer Logic ---
    const lifestyleBtns = document.querySelectorAll('#lifestyle-options .opt-btn');
    const bottleneckBtns = document.querySelectorAll('#bottleneck-options .opt-btn');
    const timelineContainer = document.getElementById('routine-timeline-container');
    const coachTipText = document.getElementById('coach-tip-text');

    if (lifestyleBtns.length && bottleneckBtns.length && timelineContainer && coachTipText) {
        const routineData = {
            office: {
                energy: {
                    timeline: [
                        { time: "7:30 AM", title: { en: "Delay Caffeine & Hydrate", ar: "أخر القهوة واشرب مياه" }, desc: { en: "Drink 500ml water with a pinch of salt. Delay coffee by 90 minutes to prevent the afternoon crash.", ar: "اشرب كوبايتين مياه بملح خفيف، وأخر أول فنجان قهوة 90 دقيقة عشان تتفادى خمول نص اليوم." } },
                        { time: "1:30 PM", title: { en: "Post-Lunch Walk", ar: "مشي خفيف بعد الغدا" }, desc: { en: "A 10-minute walk post-lunch activates insulin sensitivity and keeps fatigue at bay.", ar: "مشي 10 دقائق بعد الغدا بيظبط سكر الدم ويمنع وخامة بعد الأكل." } },
                        { time: "6:00 PM", title: { en: "System Workout", ar: "تمرين السيستم" }, desc: { en: "High-intensity biomechanical session utilizing stored energy from lunch.", ar: "تمرين مكثف مستهدف للعضلات صح مستغلين طاقة وجبة الغدا." } },
                        { time: "10:00 PM", title: { en: "Screen Block", ar: "فصل الشاشات" }, desc: { en: "Turn off screens to lower cortisol and trigger natural melatonin production.", ar: "اقفل الموبايل عشان تقلل الكورتيزول وجسمك يفرز هرمون النوم طبيعي." } }
                    ],
                    tip: {
                        en: "By delaying your morning caffeine and getting a short post-lunch walk, you will completely bypass the typical 2 PM office brain-fog. The System schedules your workouts post-work to capitalize on energy stores.",
                        ar: "بتأجيل قهوة الصبح والمشي الخفيف بعد الغدا، هتتخلص تماماً من خمول الضهر. السيستم بينظم تمرينك بعد الشغل عشان نستغل الأكل اللي أكلته طول اليوم في التمرين."
                    }
                },
                diet: {
                    timeline: [
                        { time: "8:00 AM", title: { en: "High Protein Breakfast", ar: "فطار بروتين عالي" }, desc: { en: "Eggs, veggies, and healthy fats. No simple carbs to prevent insulin spikes.", ar: "فطار غني بالبروتين والدهون الصحية وبدون كربوهيدرات بسيطة عشان سكر الدم يفضل مستقر." } },
                        { time: "2:00 PM", title: { en: "Balanced Lunch", ar: "غدا متوازن" }, desc: { en: "Clean protein, complex carbs, and fiber to maintain focus at work.", ar: "بروتين صافي مع كارب معقد وألياف عشان يمدك بالطاقة طول ساعات الشغل." } },
                        { time: "7:00 PM", title: { en: "System Workout", ar: "تمرين السيستم" }, desc: { en: "Strength training before your largest meal of the day.", ar: "تمرينك في الجيم قبل الوجبة الأساسية الأكبر في يومك." } },
                        { time: "8:30 PM", title: { en: "Massive Recovery Dinner", ar: "عشاء ضخم للاستشفاء" }, desc: { en: "High carbs, high protein. Your muscles absorb it like a sponge post-workout.", ar: "وجبة كبيرة فيها كارب عالي وبروتين عالي. عضلاتك هتمتصها زي السفنجة بعد التمرين." } }
                    ],
                    tip: {
                        en: "Late-night hunger is driven by erratic daytime blood sugar. We structure your main carbohydrates post-workout in the evening. This satisfies your appetite and promotes deep sleep.",
                        ar: "جوع بالليل سببه الأساسي عدم استقرار سكر الدم طول اليوم. السيستم بتاعنا بيخلي الوجبة الأكبر والكارب الأعلى بعد التمرين بالليل، ده بيشبعك تماماً وبيساعدك تنام نوم عميق."
                    }
                },
                time: {
                    timeline: [
                        { time: "8:00 AM", title: { en: "Active Commute", ar: "حركة سريعة" }, desc: { en: "Park further away or take the stairs to get 2,000 steps done early.", ar: "اركن بعيد شوية أو اطلع السلم عشان تخلص أول 2000 خطوة من بدري." } },
                        { time: "1:00 PM", title: { en: "10-Min Step Accumulation", ar: "مشي سريع 10 دقائق" }, desc: { en: "Walk around the office or park to accumulate steps independently.", ar: "مشي خفيف في مكتبك أو حولين المبنى لزيادة عدد خطواتك اليومية." } },
                        { time: "6:30 PM", title: { en: "Focused 45-Min System Workout", ar: "تمرين مركز 45 دقيقة" }, desc: { en: "Optimized supersets and minimal rest periods for maximal stimulation.", ar: "تمرين مركز بأسلوب السوبرسيتس (Supersets) لتقليل وقت الراحة واستغلال كل دقيقة." } },
                        { time: "9:00 PM", title: { en: "Fast Meal Prep Protocol", ar: "وجبة استشفاء سريعة" }, desc: { en: "Quick, pre-planned high protein meal to support recovery.", ar: "وجبة بروتين عالية سريعة التحضير وتكون متجهزة مسبقاً." } }
                    ],
                    tip: {
                        en: "You don't need 2 hours in the gym. The System uses optimized compound movements and supersets to squeeze a massive hypertrophy stimulus into a 45-minute window that fits your schedule.",
                        ar: "مش محتاج تقعد ساعتين في الجيم. السيستم بيعتمد على تمارين مركبة وتكنيكات متقدمة بتديك أقصى استثارة عضلية في 45 دقيقة بس تناسب يومك المزدحم."
                    }
                },
                sleep: {
                    timeline: [
                        { time: "8:30 AM", title: { en: "Morning Sun Exposure", ar: "تعرض للشمس صباحاً" }, desc: { en: "Get 10 minutes of direct sunlight to set your circadian rhythm.", ar: "اتعرض لضوء الشمس المباشر 10 دقائق عشان تظبط ساعتك البيولوجية." } },
                        { time: "2:00 PM", title: { en: "Caffeine Cutoff", ar: "منع الكافيين" }, desc: { en: "Strict cutoff for all coffee/tea. Caffeine stays in your blood for 8 hours.", ar: "ممنوع كافيين نهائي بعد الساعة 2 عشان الكافيين بيفضل في الدم 8 ساعات وبيأثر على جودة نومك." } },
                        { time: "6:00 PM", title: { en: "System Workout", ar: "تمرين السيستم" }, desc: { en: "Physical fatigue helps drive sleep pressure.", ar: "مجهود التمرين بيساعد جسمك يدخل في النوم أسرع وبعمق أكبر." } },
                        { time: "9:30 PM", title: { en: "Magnesium & Wind Down", ar: "مغنسيوم وفصل أجهزة" }, desc: { en: "Take your sleep supplements and turn off bright lights.", ar: "خد مكملات المغنسيوم واقفل الإضاءات العالية والشاشات." } }
                    ],
                    tip: {
                        en: "Sleep is a biological process that starts in the morning. Setting your light-dark cycle early and respecting the 2 PM caffeine cutoff is key to high-efficiency deep sleep.",
                        ar: "الاستشفاء والنوم العميق بيبدأ من الصبح. التعرض للشمس بدري وقطع الكافيين الساعة 2 الضهر هي الأساس عشان جسمك يدخل في مرحلة الاستشفاء والبناء العضلي صح."
                    }
                }
            },
            shift: {
                energy: {
                    timeline: [
                        { time: "Wakeup", title: { en: "Electrolyte Hydration", ar: "ترطيب بالأملاح" }, desc: { en: "500ml water + salt. Skip early heavy meals to keep digestion light.", ar: "اشرب مياه بملح أول ما تصحى، وأخر الوجبات الثقيلة عشان تحافظ على نشاطك ومتركزش الدم في معدتك." } },
                        { time: "Mid-Shift", title: { en: "Strategic Fasting & Water", ar: "صيام مؤقت ومياه" }, desc: { en: "Avoid heavy carb snacks that cause sleepiness. Keep hydration high.", ar: "تجنب السناكس اللي فيها سكريات عالية عشان متعملش هبوط مفاجئ. اشرب مياه بس." } },
                        { time: "Shift End", title: { en: "System Workout", ar: "تمرين السيستم" }, desc: { en: "Train right after or before shift starts to maintain routine consistency.", ar: "اتمرن مباشرة بعد الشغل أو قبل ما يبدأ عشان تحافظ على استمرارية روتينك." } },
                        { time: "Sleep-Prep", title: { en: "Blackout Environment", ar: "تجهيز غرفة مظلمة" }, desc: { en: "Use blackout curtains and sleep mask. Essential for daytime sleep.", ar: "استخدم ستاير بلاك أوت وقناع عين. ضروري جداً لو بتنام بالنهار عشان هرمونات النمو." } }
                    ],
                    tip: {
                        en: "Shift work disrupts circadian biology. The System keeps your eating windows structured and hydration high to maintain rock-solid energy regardless of your clock hours.",
                        ar: "شغل الشفتات بيلخبط الساعة البيولوجية. السيستم بيظبطلك مواعيد أكل خفيفة ومستمرة ومياه عالية عشان تحافظ على طاقتك ونشاطك مهما اختلف وقت شفتك."
                    }
                },
                diet: {
                    timeline: [
                        { time: "Mid-Shift", title: { en: "High Protein Pack", ar: "وجبة بروتين مجهزة" }, desc: { en: "Pre-prepared chicken/meat with high fiber. Avoid fast food deliveries.", ar: "وجبة بروتين عالية (فراخ/لحمة) مجهزة من البيت، عشان تتجنب طلب الدليفري والأكل السريع." } },
                        { time: "Shift End", title: { en: "System Workout", ar: "تمرين السيستم" }, desc: { en: "Use training to shift your hunger hormones into recovery signals.", ar: "استغل التمرين عشان تحول إشارات الجوع لإشارات بناء واستشفاء عضلي." } },
                        { time: "Pre-Sleep", title: { en: "Volumetric Meal", ar: "وجبة مشبعة وخفيفة" }, desc: { en: "Large volume meal of clean protein and veggies to sleep full.", ar: "وجبة حجمها كبير بس سعراتها محسوبة (بروتين وخضار) عشان تنام شبعان ومستقر." } }
                    ],
                    tip: {
                        en: "Fast food calls are the enemy of night shifts. Having pre-prepped high protein meals ready eliminates decision fatigue and keeps you locked in on your fat loss targets.",
                        ar: "طلب الدليفري بالليل هو العدو الأول لشغل الشفتات. تجهيز وجباتك مسبقاً بيمنع لخبطة الأكل وبيخليك ملتزم بنسبة 100% بنظام حرق الدهون."
                    }
                },
                time: {
                    timeline: [
                        { time: "Pre-Shift", title: { en: "Express 30-Min Gym Session", ar: "تمرين سريع 30 دقيقة" }, desc: { en: "High-density workout focussing on vertical and horizontal load.", ar: "تمرين مكثف وسريع بيركز على الحركات الأساسية لزيادة كفاءة الوقت." } },
                        { time: "During Shift", title: { en: "Hourly Movement Trigger", ar: "حركة كل ساعة" }, desc: { en: "Stand up or walk for 2 minutes every hour. Boosts steps easily.", ar: "اتحرك دقيقتين كل ساعة عشان تضمن إن خطواتك وحرقك اليومي عالي." } },
                        { time: "Post-Shift", title: { en: "Structured Recovery Nutrition", ar: "تغذية استشفاء منظمة" }, desc: { en: "High protein shake or quick meal. No time wasted on cooking.", ar: "بروتين شيك أو وجبة سريعة جداً ومجهزة، عشان تنام مباشرة ومضيعش وقت نومك." } }
                    ],
                    tip: {
                        en: "Consistency beats duration. A highly optimized 30-to-45 minute System protocol done consistently is infinitely better than skipping workouts due to shift fatigue.",
                        ar: "الاستمرارية أهم من وقت التمرين. تمرين مركز 30 لـ 40 دقيقة بانتظام أحسن بكتير من إنك تضيع أيام تمرينك بسبب تعب وضيق الوقت."
                    }
                },
                sleep: {
                    timeline: [
                        { time: "Pre-Sleep", title: { en: "Circadian Light Shielding", ar: "حجب الضوء قبل النوم" }, desc: { en: "Wear blue-blocking glasses during your drive home in daylight.", ar: "البس نضارة شمسية غامقة وإنت مروح في الشمس الصبح عشان تهيأ جسمك للنوم." } },
                        { time: "Home", title: { en: "Cool Down Shower", ar: "دش فاتر" }, desc: { en: "Lower body core temperature to signal sleep readiness.", ar: "خد دش فاتر عشان تقلل درجة حرارة جسمك الداخلية وتهيأه للنوم العميق." } },
                        { time: "Sleep Room", title: { en: "Strict Noise & Light Block", ar: "عزل تام للغرفة" }, desc: { en: "Silicon earplugs, white noise, and 100% dark room.", ar: "استخدم سدادات أذن وعزل تام للغرفة من أي إضاءة نهارية." } }
                    ],
                    tip: {
                        en: "Daytime sleep is lighter due to biological clocks. The System utilizes light manipulation (dark glasses post-shift) and temperature control to force your body into deep REM phases.",
                        ar: "النوم بالنهار بيكون خفيف بسبب الساعة البيولوجية. السيستم بيعتمد على حيل ذكية (زي لبس نضارة شمسية وإنت مروح الصبح) عشان نجبر جسمك يدخل في النوم العميق."
                    }
                }
            },
            busy: {
                energy: {
                    timeline: [
                        { time: "Morning", title: { en: "Salt & Cold Water", ar: "مياه ساقعة وملح" }, desc: { en: "Drink cold water with a pinch of pink salt for immediate adrenal wake-up.", ar: "اشرب كوباية مياه ساقعة بملح خفيف عشان تنشط الدورة الدموية فوراً وتصحصح." } },
                        { time: "Mid-Day", title: { en: "Standing Study/Work", ar: "مذاكرة/شغل وإنت واقف" }, desc: { en: "Stand up during classes/calls. Keeps dopamine active.", ar: "حاول تقف وإنت بتذاكر أو بتكلم حد، ده بينشط الدوبامين ويمنع الخمول." } },
                        { time: "Late Afternoon", title: { en: "System Workout", ar: "تمرين السيستم" }, desc: { en: "Train to relieve cognitive fatigue and replace it with physical drive.", ar: "تمرينك هو اللي هيفصلك عن ضغط المذاكرة وهيجدد نشاطك البدني والذهني." } }
                    ],
                    tip: {
                        en: "Mental fatigue is not physical fatigue. When your brain is tired from studying, your body needs movement to flush out waste products and restore cognitive performance.",
                        ar: "التعب الذهني مش تعب بدني. لما دماغك تفصل من المذاكرة والشغل، جسمك بيحتاج حركة وتمرين عشان يجدد النشاط وتعرف ترجع تركز تاني بقوة."
                    }
                },
                diet: {
                    timeline: [
                        { time: "Daytime", title: { en: "Protein Satiety Shielding", ar: "حماية الشبع بالبروتين" }, desc: { en: "Eat highly satiating protein sources at every major block.", ar: "ركز على وجبات بروتين مشبعة جداً طول اليوم عشان تمنع نوبات الجوع المفاجئة." } },
                        { time: "Evening", title: { en: "Hydration Focus", ar: "تركيز المياه بالليل" }, desc: { en: "Drink carbonated water or zero soda to fill stomach volume when studying.", ar: "اشرب مياه فوارة أو صودا زيرو عشان تملى معدتك وإنت بتذاكر بالليل." } },
                        { time: "Late Night", title: { en: "Low Calorie High Volume Snack", ar: "سناك حجم كبير وسعرات صفر" }, desc: { en: "Cucumber, Greek yogurt, or protein pudding if study hunger strikes.", ar: "لو جعت وإنت بتذاكر بالليل، سناك خيار أو زبادي يوناني هيكون منقذ وبدون سعرات تذكر." } }
                    ],
                    tip: {
                        en: "Boredom and study stress trigger emotional eating. The System provides high-volume, low-calorie options that satisfy the hand-to-mouth habit without destroying your deficit.",
                        ar: "الملل وضغط المذاكرة بيخليك تاكل بدون وعي. السيستم بيوفرلك بدائل حجمها كبير وسعراتها قليلة جداً تشبع رغبتك في الأكل من غير ما تخرب دايتك."
                    }
                },
                time: {
                    timeline: [
                        { time: "Morning", title: { en: "30-Min Dumbbell System Routine", ar: "تمرين سريع 30 دقيقة" }, desc: { en: "Quick full-body workout at home or gym using simple movements.", ar: "تمرين سريع للجسم كامل بدمبلز في البيت أو الجيم لإنقاذ اليوم." } },
                        { time: "Daytime", title: { en: "Passive Step Accumulation", ar: "تجميع خطوات غير مباشر" }, desc: { en: "Walk while listening to lectures or taking calls. Accumulate steps.", ar: "اسمع محاضراتك أو مكالماتك وإنت بتتمشى، كسبت خطوات وكسبت وقت." } },
                        { time: "Post-study", title: { en: "Batch Preparation", ar: "تجهيز وجبات سريع" }, desc: { en: "Pre-pack snacks for the next day to prevent impulse buying at cafeteria.", ar: "جهة سناك بكره من بالليل عشان متشتريش أي أكل سريع وغير صحي من الكافتيريا." } }
                    ],
                    tip: {
                        en: "A 30-minute workout is 2% of your day. The System designs ultra-compressed home workouts that ensure your physical progress doesn't stall during exams or heavy workloads.",
                        ar: "تمرين 30 دقيقة هو 2% بس من يومك. السيستم بيصمملك تمارين منزلية سريعة بالدمبلز تضمن إن جسمك يفضل يتطور حتى في وقت الامتحانات وضغط الشغل."
                    }
                },
                sleep: {
                    timeline: [
                        { time: "6:00 PM", title: { en: "System Workout", ar: "تمرين السيستم" }, desc: { en: "Burn off accumulated mental stress physically in the gym.", ar: "طلع كل ضغط يومك والمذاكرة في الجيم عشان تهيأ جسمك للاسترخاء." } },
                        { time: "9:00 PM", title: { en: "Blue Light Blockers", ar: "نضارة حجب الضوء" }, desc: { en: "Wear blue blockers if studying on laptop late. Protects sleep quality.", ar: "البس نضارة حجب الضوء الأزرق لو بتذاكر على اللاب توب بالليل عشان تحمي جودة نومك." } },
                        { time: "10:30 PM", title: { en: "Brain Dump Protocol", ar: "تفريغ الدماغ" }, desc: { en: "Write down tomorrow's to-do list to stop brain loops before bed.", ar: "اكتب كل اللي وراك لبكره في ورقة عشان تفصل تفكيرك وترتاح وتنام أسرع." } }
                    ],
                    tip: {
                        en: "Study anxiety keeps your brain in high-alert beta waves. The 'Brain Dump' protocol signals safety to your nervous system, allowing you to fall asleep rapidly.",
                        ar: "قلق المذاكرة بيخلي دماغك شغال في موجات التوتر. كتابة وراك إيه بكره في ورقة بيدي إشارة أمان لجهازك العصبي وبيخليك تنام في دقايق."
                    }
                }
            },
            travel: {
                energy: {
                    timeline: [
                        { time: "Arrival", title: { en: "Rehydration Protocol", ar: "ترطيب عالي سريع" }, desc: { en: "Drink 1L water with electrolytes. Flying dehydrates cells severely.", ar: "اشرب لتر مياه بمحلول جفاف أو ملح خفيف. الطيران بيسبب جفاف شديد للخلايا وبيسبب الخمول." } },
                        { time: "Mid-Day", title: { en: "Light Exposure Walk", ar: "مشي في ضوء الشمس" }, desc: { en: "Walk outside for 20 minutes to sync your body with the new time zone.", ar: "اتمشى بره 20 دقيقة عشان تظبط ساعتك البيولوجية مع البلد الجديدة." } },
                        { time: "Evening", title: { en: "Hotel Gym Session", ar: "تمرين جيم الفندق" }, desc: { en: "Light active recovery session to flush out jet lag.", ar: "تمرين خفيف في جيم الفندق لتنشيط الدورة الدموية والتخلص من إرهاق السفر." } }
                    ],
                    tip: {
                        en: "Jet lag is magnified by cell dehydration. Rehydrating immediately and getting direct sunlight sets your internal clock, preserving your energy levels.",
                        ar: "إرهاق السفر بيزيد جداً بسبب جفاف الخلايا. شرب مياه كافية مع التعرض للشمس أول ما توصل بيظبط طاقتك ونشاطك علطول."
                    }
                },
                diet: {
                    timeline: [
                        { time: "Flight", title: { en: "Fast & Hydrate", ar: "صيام وقت الرحلة" }, desc: { en: "Skip plane food (high sodium & fats). Drink pure water.", ar: "تجنب أكل الطيارة (بيكون فيه صوديوم ودهون عالية بتنفخ الجسم). اشرب مياه بس." } },
                        { time: "Hotel", title: { en: "Stock The Fridge", ar: "تجهيز تلاجة الفندق" }, desc: { en: "Buy Greek yogurt, fruit, and clean protein from a local market immediately.", ar: "اشتري زبادي يوناني، فاكهة، وبروتين جاهز من السوبر ماركت القريب أول ما توصل." } },
                        { time: "Dinner", title: { en: "Dining Out Protocol", ar: "نظام الأكل بره" }, desc: { en: "Order double protein (grilled meat/chicken) with double green salad.", ar: "اطلب بروتين مضاعف (لحمة أو فراخ مشوية) مع سلطة خضراء وتجنب الصوصات الدسمة." } }
                    ],
                    tip: {
                        en: "Traveling exposes you to hyper-palatable foods. The System utilizes 'Dining Out' protocols, focusing on protein first to keep you full and prevent weight gain.",
                        ar: "السفر بيعرضك لأكل مغري وسعراته عالية. السيستم بتاعنا بيعلمك بروتوكولات الأكل في المطاعم (التركيز على البروتين المشبع أولاً) عشان تستمتع من غير ما تزيد في الوزن."
                    }
                },
                time: {
                    timeline: [
                        { time: "Morning", title: { en: "15-Min Hotel Room Routine", ar: "تمرين سريع في الغرفة" }, desc: { en: "High-intensity bodyweight protocol (Pushups, Squats, Planks).", ar: "تمرين سويدي مكثف في الغرفة (ضغط، بطن، سكوات) مش هياخد 15 دقيقة." } },
                        { time: "Daytime", title: { en: "Explore Via Steps", ar: "المشي للاستكشاف" }, desc: { en: "Walk to your meetings or explore the city on foot. Hit 12,000 steps.", ar: "استكشف البلد مشي أو روح مشاويرك على رجلك. هدفنا 12000 خطوة حرق دهون تلقائي." } },
                        { time: "Evening", title: { en: "Resistance Band Routine", ar: "تمرين استك بـ المقاومة" }, desc: { en: "Use portable bands in hotel room. Minimal gear, maximal result.", ar: "استخدم أحبال المقاومة في الغرفة. وزن خفيف في الشنطة بس تأثيره ممتاز للعضلات." } }
                    ],
                    tip: {
                        en: "A lack of a gym is no excuse. The System equips you with high-efficiency hotel bodyweight and resistance band protocols that keep your muscles activated anywhere in the world.",
                        ar: "عدم وجود جيم مش عذر. السيستم بيوفرلك تمارين مخصصة لغرف الفنادق بأحبال المقاومة، عشان تحافظ على كتلتك العضلية وتستمر في حرق الدهون في أي مكان."
                    }
                },
                sleep: {
                    timeline: [
                        { time: "Sunset", title: { en: "Local Time Sync", ar: "التأقلم مع التوقيت المحلي" }, desc: { en: "Do not sleep until local bedtime. Force alignment.", ar: "ماتنامش نهائي بالنهار لحد ما يجي وقت النوم المحلي للبلد عشان تظبط يومك." } },
                        { time: "Pre-Sleep", title: { en: "Magnesium Load", ar: "جرعة المغنسيوم" }, desc: { en: "Take Magnesium Glycinate to calm nervous system stimulation from travel.", ar: "خد جرعة المغنسيوم عشان تهدي جهازك العصبي بعد ضغط السفر والمطار." } },
                        { time: "Sleep Room", title: { en: "Hotel Room Darkness Lock", ar: "تعتيم غرفة الفندق" }, desc: { en: "Clip hotel curtains tight to block all street lights. Use eye mask.", ar: "اقفل ستاير الفندق كويس جداً واقفل أي إضاءة للتكييف أو التلفزيون." } }
                    ],
                    tip: {
                        en: "Sleeping in a new hotel room triggers a biological 'first-night effect' (half the brain stays alert). Blocking all sensory inputs (eye mask, eye plugs) is critical to override this response.",
                        ar: "النوم في مكان جديد بيخلي نص عقلك صاحي كحماية طبيعية. عزل الإضاءة والصوت تماماً واستخدام سدادات أذن هو الحل عشان تدخل في نوم عميق علطول."
                    }
                }
            }
        };

        const renderTimeline = (lifestyle, bottleneck) => {
            const data = routineData[lifestyle][bottleneck];
            if (!data) return;

            // Render Timeline items
            timelineContainer.innerHTML = '';
            data.timeline.forEach(item => {
                const titleText = currentLang === 'ar' ? item.title.ar : item.title.en;
                const descText = currentLang === 'ar' ? item.desc.ar : item.desc.en;
                const dirAttr = currentLang === 'ar' ? 'dir="rtl"' : '';
                
                const itemHtml = `
                    <div class="timeline-item">
                        <span class="timeline-time">${item.time}</span>
                        <div class="timeline-content" ${dirAttr}>
                            <h4 class="timeline-title">${titleText}</h4>
                            <p class="timeline-desc">${descText}</p>
                        </div>
                    </div>
                `;
                timelineContainer.insertAdjacentHTML('beforeend', itemHtml);
            });

            // Render Coach Tip
            coachTipText.innerHTML = currentLang === 'ar' ? data.tip.ar : data.tip.en;
            if (currentLang === 'ar') {
                coachTipText.setAttribute('dir', 'rtl');
            } else {
                coachTipText.removeAttribute('dir');
            }
        };

        const getActiveSelection = () => {
            const activeLifestyleBtn = document.querySelector('#lifestyle-options .opt-btn.active');
            const activeBottleneckBtn = document.querySelector('#bottleneck-options .opt-btn.active');
            return {
                lifestyle: activeLifestyleBtn ? activeLifestyleBtn.getAttribute('data-lifestyle') : 'office',
                bottleneck: activeBottleneckBtn ? activeBottleneckBtn.getAttribute('data-bottleneck') : 'energy'
            };
        };

        // Hook language switches
        updateRoutineOptimizerLanguage = () => {
            const current = getActiveSelection();
            renderTimeline(current.lifestyle, current.bottleneck);
        };

        // Attach click listeners to Lifestyle buttons
        lifestyleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                lifestyleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const current = getActiveSelection();
                renderTimeline(btn.getAttribute('data-lifestyle'), current.bottleneck);
            });
        });

        // Attach click listeners to Bottleneck buttons
        bottleneckBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                bottleneckBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const current = getActiveSelection();
                renderTimeline(current.lifestyle, btn.getAttribute('data-bottleneck'));
            });
        });

        // Run initial render (Office + Energy)
        renderTimeline('office', 'energy');
    }


    // --- 5. High-End Macro & Calorie Calculator Logic ---
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
                targetCalories = Math.round(tdee * 0.8);
                const minCal = (gender === 'male') ? 1500 : 1200;
                if (targetCalories < minCal) targetCalories = minCal;
                
                goalLabel = (currentLang === 'ar') 
                    ? "محسوبة بعجز سعرات مدروس بنسبة 20% لتحفيز حرق الدهون العضلية بأقصى كفاءة."
                    : "Optimized with a precise 20% caloric deficit to accelerate metabolic fat burning.";
            } else if (goal === 'recomp') {
                targetCalories = tdee;
                
                goalLabel = (currentLang === 'ar')
                    ? "مستوى سعرات الثبات للحفاظ على الطاقة، لبناء الكتلة العضلية مع تذويب الشحوم المحيطة بالعضلات."
                    : "Maintenance calorie baseline optimized to fuel intense strength training and build muscle while melting abdominal fat.";
            } else if (goal === 'gain') {
                targetCalories = Math.round(tdee + 300);
                
                goalLabel = (currentLang === 'ar')
                    ? "مستوى فائض سعرات خفيف لبناء وتضخيم الألياف العضلية مع الحد الأدنى من كسب الدهون."
                    : "Lean muscle surplus designed to fuel muscle tissue growth while minimizing fat gain.";
            }
            
            // Biomechanics Signature Macro Formula
            let proteinGrams = Math.round(weight * 2.2);
            let fatGrams = Math.round(weight * 0.9);
            let proteinCals = proteinGrams * 4;
            let fatCals = fatGrams * 9;
            
            let remainingCals = targetCalories - (proteinCals + fatCals);
            let carbGrams = Math.round(remainingCals / 4);
            
            if (carbGrams < 50) {
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


    // --- 6. Egyptian Market Instapay & WhatsApp Checkout System ---
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
        price: '2400',
        token: ''
    };
    
    // Open Modal and lock package details
    pkgTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const pkgName = btn.getAttribute('data-package');
            const pkgPrice = btn.getAttribute('data-price');
            
            currentSelectedPackage.name = pkgName;
            currentSelectedPackage.price = pkgPrice;

            // Translated package names map for step indicators
            const arPkgNames = {
                'Kickstart': 'كيك ستارت',
                'Velocity': 'فيلوسيتي',
                'Apex': 'أبيكس'
            };
            const pkgNameAr = arPkgNames[pkgName] || pkgName;
            
            // Set initial dynamic fields in Modal Step 1 (Bilingual wrappers)
            document.getElementById('selected-package-name').textContent = pkgName;
            document.getElementById('selected-package-price').textContent = `${parseFloat(pkgPrice).toLocaleString()} EGP`;
            
            document.getElementById('selected-package-name-ar').textContent = pkgNameAr;
            document.getElementById('selected-package-price-ar').textContent = `${parseFloat(pkgPrice).toLocaleString()} جنيه مصري`;
            
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
        
        // Hydrate Step 2 billing texts (Dynamic bilingual display)
        const arPkgNames = {
            'Kickstart': 'كيك ستارت',
            'Velocity': 'فيلوسيتي',
            'Apex': 'أبيكس'
        };
        const pkgNameAr = arPkgNames[currentSelectedPackage.name] || currentSelectedPackage.name;

        if (currentLang === 'ar') {
            document.getElementById('billing-package-name').textContent = pkgNameAr;
            document.getElementById('billing-package-price').textContent = `${parseFloat(currentSelectedPackage.price).toLocaleString()} جنيه مصري`;
        } else {
            document.getElementById('billing-package-name').textContent = currentSelectedPackage.name;
            document.getElementById('billing-package-price').textContent = `${parseFloat(currentSelectedPackage.price).toLocaleString()} EGP`;
        }
        
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
            copyBtnText.textContent = (currentLang === 'ar') ? 'تم النسخ!' : 'COPIED!';
            copyAddressBtn.style.backgroundColor = '#FFFFFF';
            copyAddressBtn.style.color = '#0B0B0C';
            
            setTimeout(() => {
                copyBtnText.textContent = (currentLang === 'ar') ? 'نسخ' : 'COPY';
                copyAddressBtn.style.backgroundColor = '';
                copyAddressBtn.style.color = '';
            }, 2500);
        }).catch(err => {
            console.error('Failed to copy to clipboard', err);
        });
    });
    
    // WhatsApp Redirect Redirection compiler (Bilingual template engines)
    const whatsappConfirmBtn = document.getElementById('whatsapp-confirm-btn');
    
    whatsappConfirmBtn.addEventListener('click', () => {
        const clientName = document.getElementById('client-name').value.trim();
        const clientPhone = document.getElementById('client-phone').value.trim();
        const clientNotes = document.getElementById('client-notes').value.trim() || ((currentLang === 'ar') ? 'لا توجد ملاحظات إضافية.' : 'No additional notes.');
        
        // Coach details
        const coachPhone = '201129808526'; // Redirection number
        
        // Package name in Arabic
        const arPkgNames = {
            'Kickstart': 'كيك ستارت',
            'Velocity': 'فيلوسيتي',
            'Apex': 'أبيكس'
        };
        const pkgNameAr = arPkgNames[currentSelectedPackage.name] || currentSelectedPackage.name;

        // Compile Arabic or English pre-filled messages
        let waText = '';
        if (currentLang === 'ar') {
            waText = `مرحباً كابتن عمر دسوقي،
أنا الاسم: *${clientName}*. ومستعد لتمكين نظامي البدني الخاص!

لقد اخترت باقة: *${pkgNameAr}* (٣ أشهر) بقيمة *${parseFloat(currentSelectedPackage.price).toLocaleString()} جنيه مصري*.

تفاصيل العميل:
- رقم الواتساب: ${clientPhone}
- الهدف البدني والملاحظات: "${clientNotes}"
- رمز التسجيل بالنظام: ${currentSelectedPackage.token}

لقد قمت بإتمام عملية التحويل بنجاح بقيمة *${parseFloat(currentSelectedPackage.price).toLocaleString()} جنيه* إلى حساب إنستاباي: *omardesoke@instapay*.

أرسل هذه الرسالة لتأكيد وحجز مكاني بالسيستم! مرفق لقطة الشاشة لإيصال التحويل:`;
        } else {
            waText = `Hello Coach Omar Desoke,
My name is *${clientName}*. I am ready to Own Your System!

I have selected the *${currentSelectedPackage.name}* Package (3 Months) for *${parseFloat(currentSelectedPackage.price).toLocaleString()} EGP*.

Client Details:
- WhatsApp Contact: ${clientPhone}
- Goal Target: "${clientNotes}"
- System Registration Token: ${currentSelectedPackage.token}

I have successfully completed the Instapay transfer of *${parseFloat(currentSelectedPackage.price).toLocaleString()} EGP* to *omardesoke@instapay*. 

Sending this to lock in my coaching slot! Here is my receipt screenshot:`;
        }

        // URL Encoded link compilation
        const encodedText = encodeURIComponent(waText);
        const waUrl = `https://wa.me/${coachPhone}?text=${encodedText}`;
        
        // Redirect client in a new tab
        window.open(waUrl, '_blank');
        
        // Close modal
        closeModal();
    });


    // --- 7. Scroll Reveal Animations (High-performance Intersection Observer) ---
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


    // --- 8. Sticky Footer CTA Reveal logic ---
    const pricingSection = document.getElementById('packages');
    const stickyCTA = document.querySelector('.sticky-footer-cta');
    
    const toggleStickyCTA = () => {
        if (!stickyCTA || !pricingSection) return;
        
        const scrollPosition = window.scrollY + window.innerHeight;
        const pricingTop = pricingSection.offsetTop;
        const pricingBottom = pricingTop + pricingSection.offsetHeight;
        
        if (window.scrollY > 600 && (scrollPosition < pricingTop || window.scrollY > pricingBottom)) {
            stickyCTA.classList.add('active');
        } else {
            stickyCTA.classList.remove('active');
        }
    };

});
