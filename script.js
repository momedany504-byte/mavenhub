// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyD2DLWwr1fI_4wZYlEroVTGrg1QHrpF8uE",
    authDomain: "mavenhub-72863.firebaseapp.com",
    projectId: "mavenhub-72863",
    storageBucket: "mavenhub-72863.firebasestorage.app",
    messagingSenderId: "219331508714",
    appId: "1:219331508714:web:4b40030b8b03a9ec481a93",
    measurementId: "G-WX1MGBDSS4"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// دالة جلب البيانات من Cloud Firestore (شاملة طلبات أولياء الأمور المعلقة والإشعارات)
async function fetchAllDataFromCloud() {
    try {
        let querySnapshot = await db.collection('site_data').get();
        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                let row = doc.data();
                let key = doc.id;
                if (key === 'playersData' && row.value) playersData = row.value;
                if (key === 'newsArticles' && row.value) newsArticles = row.value;
                if (key === 'playerOfTheMonth' && row.value) playerOfTheMonth = row.value;
                if (key === 'playerOfTheWeek' && row.value) playerOfTheWeek = row.value;
                if (key === 'academyLegendsData' && row.value) academyLegendsData = row.value;
                if (key === 'coachNotebookEntries' && row.value) coachNotebookEntries = row.value;
                if (key === 'parentsAccounts' && row.value) parentsAccounts = row.value;
                if (key === 'pendingParentRequests' && row.value) pendingParentRequests = row.value; // جلب طلبات أولياء الأمور المعلقة سحابياً
                if (key === 'systemNotifications' && row.value) systemNotifications = row.value; // جلب الإشعارات سحابياً
                if (key === 'staffCredentials' && row.value) {
                    for(let k in row.value) {
                        if(staffCredentials[k]) {
                            staffCredentials[k].img = row.value[k].img || staffCredentials[k].img;
                        }
                    }
                }
            });
            console.log("تم جلب البيانات من فايربيز بنجاح!");
        }
    } catch (err) {
        console.log("استمرار العمل محلياً نظراً لخطأ في الاتصال بقاعدة البيانات:", err);
    }
}

// دالة لحفظ أو تحديث البيانات في Firestore
async function saveDataToCloud(keyName, valueData) {
    try {
        await db.collection('site_data').doc(keyName).set({
            key: keyName,
            value: valueData
        });
        console.log(`تم حفظ البيانات بنجاح لـ: ${keyName}`);
    } catch (error) {
        console.error("خطأ في حفظ البيانات على فايربيز:", error);
    }
}

// تشغيل الموقع عند التحميل
window.addEventListener('load', async () => {
    try {
        await fetchAllDataFromCloud();
    } catch (err) {}

    const loadingScreen = document.getElementById('loading-screen');
    if(loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.style.display = 'none', 500);
    }

    if(typeof renderArtisticGallery === 'function') renderArtisticGallery();
    if(typeof renderAcademyLegends === 'function') renderAcademyLegends();
    if(typeof updatePotmUI === 'function') updatePotmUI();
    if(typeof updatePotwUI === 'function') updatePotwUI();
    if(typeof updateNotificationsUI === 'function') updateNotificationsUI();
    if(typeof renderCoachesImages === 'function') renderCoachesImages();
    if(typeof renderCoachNotebookList === 'function') renderCoachNotebookList();
    if(typeof renderNewsTickers === 'function') renderNewsTickers();
    if(typeof renderNewsFullList === 'function') renderNewsFullList();

    const savedCoachKey = localStorage.getItem('maven_saved_coach_key');
    if(savedCoachKey && staffCredentials[savedCoachKey]) {
        isStaffLoggedIn = true;
        loggedInStaffKey = savedCoachKey;
        loggedInStaffName = staffCredentials[savedCoachKey].name;
        loggedInUserType = 'staff';
        updateHeaderUserAvatarUI();
    }
});

const translations = {
    ar: {
        loading_phrase: "فخورين انك جزء من رحلتنا",
        header_ticker: " Professional Football Analytics & Training Club • Where Legends Begin",
        home_btn: "الرئيسية",
        nav_menu: "قائمة التنقل",
        nav_home: "الرئيسية (Home)",
        sub_players: "Players (اللاعبون)",
        sub_coaches: "Coaches & Analysts",
        sub_parents: "Parents (أولياء الأمور)",
        nav_legends: "POTM",
        nav_gallery: "Gallery (معرض الصور)",
        nav_about: "Who We Are",
        nav_news: "News (الأخـبـار)",
        nav_contact: "Contact Us (اتصل بنا)",
        hero_badge: "النظام الاحترافي للتحليل والتطوير",
        hero_title: "Where Legends Begin",
        hero_desc: "نصنع نجوم المستقبل في كرة القدم عبر أحدث أنظمة التحليل التكتيكي، القياسات البدنية، والمتابعة الدقيقة لأولياء الأمور.",
        explore_btn: "استكشف اللاعبين",
        gallery_btn: "معرض الصور",
        training_playground: "Training Playground",
        potm_crown_title: "لاعب الشهر (POTM)",
        potw_crown_title: "لاعب الأسبوع (Player of the Week)",
        show_stars: "عرض النجوم",
        potm_main_title: "POTM (لاعب الشهر)",
        potm_main_subtitle: "قائمة نجوم وأساطير النادي المعتمدة لكل شهر",
        news_section_header: "أحدث أخبار النادي (News)",
        news_section_subheader: "تابع كافة مستجدات وإعلانات النادي الرسمية",
        who_we_are_title: "Who We Are",
        about_title_1: "Our journey",
        about_title_2: "Our vision",
        about_title_3: "The next chapter",
        about_part_1: "تأسست نادي Maven Hub في يوليو 2024 في ملعب ريو لكرة القدم، وانطلقت برؤية واضحة لتشكيل الجيل القادم من مواهب كرة القدم.",
        about_georgia_highlight: "ومن خلال شراكتنا مع نادي لكرة القدم في جورجيا، نفتح أفقاً واسعاً وفرصاً حقيقية للاعبين لتحقيق طموحاتهم خارج الحدود.",
        about_part_2: "تقوم شبكة الكشافين لدينا بمتابعة أداء اللاعبين وتطورهم باستمرار لتحديد المواهب الواعدة القادرة على السفر للخارج وبناء مسيرة احترافية ناجحة.",
        about_desc_2: "في Maven Hub، رسالتنا تتجاوز حدود التدريب التقليدي. نهدف إلى صناعة لاعب متكامل عبر تطوير مهاراته التقنية، قوته البدنية، فهمه التكتيكي، وصلابته الذهنية.",
        about_desc_3: "تمتد رحلتنا إلى ما بعد ملاعب التدريب؛ حيث يشارك نادي Maven Hub في البطولات الرسمية التي ينظمها الاتحاد المصري لكرة القدم.",
        contact_text: "تابعنا عبر منصات التواصل الاجتماعي أو تفضل بزيارتنا.",
        visitor_label: "زائر",
        login_menu_btn: "تسجيل دخول",
        login_player: "لاعب",
        login_parent: "ولي أمر",
        login_coach: "مدرب / محلل",
        coaches_section_title: "الجهاز الفني ومحلل الأداء",
        players_cat_title: "فئات اللاعبين",
        cat_1: "مواليد 2010 - 2011 - 2012",
        cat_1_desc: "إعمار النخبة وتطوير التكتيكات العالية",
        cat_2: "مواليد 2013 - 2014",
        cat_2_desc: "بناء المهارات الأساسية وفن اللعب الجماعي",
        cat_3: "مواليد 2015 - 2016",
        cat_3_desc: "البراعم والخطوات الأولى نحو الاحتراف",
        back_btn: "رجوع للفئات",
        players_list_title: "قائمة اللاعبين",
        parent_login_tab: "تسجيل دخول",
        parent_reg_tab: "إنشاء حساب جديد",
        parent_login_title: "تسجيل دخول ولي الأمر",
        parent_reg_title: "إنشاء حساب ولي أمر جديد",
        parent_reg_hint: "* أدخل بياناتك، ارفع صورتك، ورقم هاتفك لإرسال طلب الموافقة عبر واتساب مجاناً للمدربين.",
        parent_full_name: "اسم ولي الأمر",
        parent_phone_label: "رقم الهاتف (للتواصل عبر واتساب)",
        son_name_label: "اسم الابن اللاعب",
        password_label: "كلمة المرور",
        remember_me: "تذكرني",
        forgot_pass_link: "نسيت كلمة المرور؟",
        new_pass_label: "اختر كلمة مرور جديدة لك",
        parent_login_submit: "دخول لحساب ولي الأمر",
        parent_whatsapp_submit: "إرسال طلب الانضمام عبر واتساب مجاناً",
        parent_portal: "بوابة متابعة الابن اللاعب",
        logout_btn: "تسجيل خروج",
        parent_eval_title: "معايير تقييم ولي الأمر (الالتزام والحضور)",
        parent_warnings_title: "سجل الإنذارات والتنبيهات الموجهة من الجهاز الفني",
        gallery_title: "معرض الصور والذكريات",
        coach_1_name: "ك/ خليل عمارة",
        coach_1_role: "مؤسس نادي Maven Hub ومدرب الحراس",
        coach_2_name: "ك/ عبد الرحمن خليل",
        coach_2_role: "مدرب الأحمال والسرعات",
        coach_3_name: "ك/ أمير أحمد",
        coach_3_role: "مدرب المهارات والبراعم",
        analyst_name: "محلل الأداء/ محمد مدني",
        analyst_role: "محلل الأداء الكروي",
        parent_avatar_label: "صورتك الشخصية (بروفايل ولي الأمر)"
    },
    en: {
        loading_phrase: "Proud You Are Part Of Our Journey",
        header_ticker: " Professional Football Analytics & Training Club • Where Legends Begin",
        home_btn: "Home",
        nav_menu: "Navigation Menu",
        nav_home: "Home",
        sub_players: "Players",
        sub_coaches: "Coaches & Analysts",
        sub_parents: "Parents",
        nav_legends: "POTM",
        nav_gallery: "Gallery",
        nav_about: "Who We Are",
        nav_news: "News",
        nav_contact: "Contact Us",
        hero_badge: "Professional Analysis & Development System",
        hero_title: "Where Legends Begin",
        hero_desc: "We build future football stars through state-of-the-art tactical analysis systems.",
        explore_btn: "Explore Players",
        gallery_btn: "Photo Gallery",
        training_playground: "Training Playground",
        potm_crown_title: "Player of the Month (POTM)",
        potw_crown_title: "Player of the Week",
        show_stars: "Show Stars",
        potm_main_title: "POTM (Player of the Month)",
        potm_main_subtitle: "Approved club legends & stars list for each month",
        news_section_header: "Club News",
        news_section_subheader: "Follow all official club updates and announcements",
        who_we_are_title: "Who We Are",
        about_title_1: "Our journey",
        about_title_2: "Our vision",
        about_title_3: "The next chapter",
        about_part_1: "Maven Hub Club was founded in July 2024 at Rio Football Pitch with a clear vision.",
        about_georgia_highlight: "Through our partnership with a football club in Georgia, we open wide horizons.",
        about_part_2: "Our scouts continuously monitor players' performance.",
        about_desc_2: "At Maven Hub, our mission goes beyond traditional training.",
        about_desc_3: "Our journey extends beyond training pitches.",
        contact_text: "Follow us across social media platforms or visit us.",
        visitor_label: "Visitor",
        login_menu_btn: "Login",
        login_player: "Player",
        login_parent: "Parent",
        login_coach: "Coach / Analyst",
        coaches_section_title: "Coaching Staff & Performance Analyst",
        players_cat_title: "Player Categories",
        cat_1: "Born 2010 - 2011 - 2012",
        cat_1_desc: "Elite age group & advanced tactics development",
        cat_2: "Born 2013 - 2014",
        cat_2_desc: "Building core skills & team play art",
        cat_3: "Born 2015 - 2016",
        cat_3_desc: "Buds & first steps toward professionalism",
        back_btn: "Back to Categories",
        players_list_title: "Players List",
        parent_login_tab: "Login",
        parent_reg_tab: "Register",
        parent_login_title: "Parent Login",
        parent_reg_title: "Create Parent Account",
        parent_reg_hint: "* Enter details, upload avatar, and phone to send approval via WhatsApp.",
        parent_full_name: "Parent Full Name",
        parent_phone_label: "Phone Number",
        son_name_label: "Son Player Name",
        password_label: "Password",
        remember_me: "Remember me",
        forgot_pass_link: "Forgot Password?",
        new_pass_label: "Choose a new password",
        parent_login_submit: "Login",
        parent_whatsapp_submit: "Send Join Request via WhatsApp Free",
        parent_portal: "Player Son Tracking Portal",
        logout_btn: "Logout",
        parent_eval_title: "Parent Evaluation Standards (Commitment & Attendance)",
        parent_warnings_title: "Warnings Record from Coaching Staff",
        gallery_title: "Gallery & Memories",
        coach_1_name: "Coach/ Khalil Emara",
        coach_1_role: "Founder of Maven Hub Club & Goalkeepers Coach",
        coach_2_name: "Coach/ Abdelrahman Khalil",
        coach_2_role: "Fitness & Speed Coach",
        coach_3_name: "Coach/ Amir Ahmed",
        coach_3_role: "Skills & Buds Coach",
        analyst_name: "Analyst/ Mohamed Medany",
        analyst_role: "Performance Analyst",
        parent_avatar_label: "Your Avatar"
    },
    ka: {
        loading_phrase: "ვამაყობთ, რომ ჩვენი მოგზაურობის ნაწილი ხართ",
        header_ticker: " Professional Football Analytics & Training Club • Where Legends Begin",
        home_btn: "მთავარი",
        nav_menu: "ნავიგაცია",
        nav_home: "მთავარი",
        sub_players: "მოთამაშეები",
        sub_coaches: "მწვრთნელები",
        sub_parents: "მშობლები",
        nav_legends: "POTM",
        nav_gallery: "გალერეა",
        nav_about: "Who We Are",
        nav_news: "News",
        nav_contact: "კონტაქტი",
        hero_badge: "პროფესიონალური ანალიზის სისტემა",
        hero_title: "Where Legends Begin",
        hero_desc: "ჩვენ ვქმნით ფეხბურთის მომავალ ვარსკვლავებს.",
        explore_btn: "მოთამაშეები",
        gallery_btn: "გალერეა",
        training_playground: "Training Playground",
        potm_crown_title: "თვის საუკეთესო მოთამაშე",
        potw_crown_title: "კვირის საუკეთესო მოთამაშე",
        show_stars: "ვარსკვლავები",
        potm_main_title: "POTM",
        potm_main_subtitle: "კლუბის ლეგენდები",
        news_section_header: "News",
        news_section_subheader: "კლუბის სიახლეები",
        who_we_are_title: "Who We Are",
        about_title_1: "Our journey",
        about_title_2: "Our vision",
        about_title_3: "The next chapter",
        about_part_1: "Maven Hub Club დაარსდა 2024 წლის ივლისში.",
        about_georgia_highlight: "საქართველოს კლუბთან პარტნიორობით.",
        about_part_2: "ჩვენი სკაუტები მუდმივად აკვირდებიან მოთამაშეებს.",
        about_desc_2: "Maven Hub-ში ჩვენი მისიაა შევქმნათ სრულყოფილი ფეხბურთელი.",
        about_desc_3: "ჩვენი მოგზაურობა სცილდება საწვრთნელ მოედნებს.",
        contact_text: "მოგვყევით სოციალურ ქსელებში.",
        visitor_label: "სტუმარი",
        login_menu_btn: "შესვლა",
        login_player: "მოთამაშე",
        login_parent: "მშობელი",
        login_coach: "მწვრთნელი",
        coaches_section_title: "სამწვრთნელო შტაბი",
        players_cat_title: "კატეგორიები",
        cat_1: "დაბადებული 2010 - 2011 - 2012",
        cat_1_desc: "ელიტარული ასაკობრივი ჯგუფი",
        cat_2: "დაბადებული 2013 - 2014",
        cat_2_desc: "ძირითადი უნარები",
        cat_3: "დაბადებული 2015 - 2016",
        cat_3_desc: "პირველი ნაბიჯები",
        back_btn: "უკან",
        players_list_title: "მოთამაშეთა სია",
        parent_login_tab: "შესვლა",
        parent_reg_tab: "რეგისტრაცია",
        parent_login_title: "შესვლა",
        parent_reg_title: "რეგისტრაცია",
        parent_reg_hint: "* შეიყვანეთ მონაცემები.",
        parent_full_name: "მშობლის სახელი",
        parent_phone_label: "ტელეფონი",
        son_name_label: "მოთამაშის სახელი",
        password_label: "პაროლი",
        remember_me: "დამახსოვრება",
        forgot_pass_link: "დაგავიწყდათ?",
        new_pass_label: "ახალი პაროლი",
        parent_login_submit: "შესვლა",
        parent_whatsapp_submit: "WhatsApp",
        parent_portal: "პორტალი",
        logout_btn: "გასვლა",
        parent_eval_title: "შეფასება",
        parent_warnings_title: "გაფრთხილებები",
        gallery_title: "გალერეა",
        coach_1_name: "მწვრთნელი/ ხალილ ემარა",
        coach_1_role: "Maven Hub-ის დამფუძნებელი და მეკარეების მწვრთნელი",
        coach_2_name: "მწვრთნელი/ აბდელრაჰმან ხალილი",
        coach_2_role: "ფიზ. მომზადების მწვრთნელი",
        coach_3_name: "მწვრთნელი/ ამირ აჰმედი",
        coach_3_role: "ტექნიკის მწვრთნელი",
        analyst_name: "ანალიტიკოსი/ მოჰამედ მედანი",
        analyst_role: "ანალიტიკოსი",
        parent_avatar_label: "ავატარი"
    }
};

const coachesBios = {
    ar: {
        khalil: {
            name: "كابتن/ خليل عمارة",
            role: "مؤسس نادي Maven Hub ومدرب الحراس",
            desc: "مؤسس نادي ميفن هاب و مدرب مواليد 97، حراس مرمى في حرس الحدود وسموحة سابقاً. درب أكتر من تمانية أكاديميات على مدار تمانية سنين ولديه خبرة إدارية واسعة. درب كمدير فني لفريق المنتزه 2007، وكان لاعب سابق في ناشئين بيراميدز وفي جورجيا والامارات، وحاصل على شهادات تغذية معتمدة من European Academy Training Platform."
        },
        amir: {
            name: "كابتن/ أمير أحمد",
            role: "مدرب المهارات والبراعم",
            desc: "مدرب ناشئ وواعد من مواليد 2007 وله خبرة سنتين في تدريب الأكاديميات، وطالب بكلية التربية الرياضية جامعة الإسكندرية حالياً."
        },
        abdelrahman: {
            name: "كابتن/ عبد الرحمن خليل",
            role: "مدرب الأحمال والسرعات",
            desc: "مدرب مواليد 2000 وله خبرة أكتر من ست سنين في تدريب الأكاديميات، وخريج كلية التربية الرياضية جامعة الإسكندرية."
        },
        medany: {
            name: "محلل الأداء/ محمد مدني",
            role: "محلل الأداء الكروي",
            desc: "محلل أداء تكتيكي وبدني، متخصص في قراءة المباريات، دراسة الخصوم، وتطوير إحصائيات اللاعبين عبر أحدث الأنظمة التقنية."
        }
    },
    en: {
        khalil: {
            name: "Coach/ Khalil Emara",
            role: "Founder of Maven Hub Club & Goalkeepers Coach",
            desc: "Founder of Maven Hub and coach of '97 born, former goalkeeper at Haras El Hodoud and Smouha. Coached across more than 8 academies for 8 years with extensive management experience. Head coach of El Montaza 2007 team, former youth player at Pyramids FC, Georgia, and UAE, holding nutrition certificates from European Academy Training Platform."
        },
        amir: {
            name: "Coach/ Amir Ahmed",
            role: "Skills & Buds Coach",
            desc: "Young and promising coach born in 2007 with 2 years of academy coaching experience, currently a student at the Faculty of Physical Education, Alexandria University."
        },
        abdelrahman: {
            name: "Coach/ Abdelrahman Khalil",
            role: "Fitness & Speed Coach",
            desc: "Coach born in 2000 with over 6 years of academy coaching experience, graduate of the Faculty of Physical Education, Alexandria University."
        },
        medany: {
            name: "Analyst/ Mohamed Medany",
            role: "Performance Analyst",
            desc: "Tactical and physical performance analyst specialized in match analysis, opponent scouting, and player stats development."
        }
    },
    ka: {
        khalil: {
            name: "მწვრთნელი/ ხალილ ემარა",
            role: "Maven Hub-ის დამფუძნებელი და მეკარეების მწვრთნელი",
            desc: "Maven Hub-ის დამფუძნებელი."
        },
        amir: {
            name: "მწვრთნელი/ ამირ აჰმედი",
            role: "ტექნიკის მწვრთნელი",
            desc: "ახალგაზრდა და პერსპექტიული მწვრთნელი."
        },
        abdelrahman: {
            name: "მწვრთნელი/ აბდელრაჰმან ხალილი",
            role: "ფიზ. მომზადების მწვრთნელი",
            desc: "მწვრთნელი 6 წელზე მეტი გამოცდილებით."
        },
        medany: {
            name: "ანალიტიკოსი/ მოჰამედ მედანი",
            role: "ანალიტიკოსი",
            desc: "ტაქტიკური ანალიტიკოსი."
        }
    }
};

let academyLegendsData = [
    { monthLabel: "نوفمبر (November)", nameAr: "", nameEn: "", nameKa: "", img: "" },
    { monthLabel: "ديسمبر (December)", nameAr: "", nameEn: "", nameKa: "", img: "" },
    { monthLabel: "يناير (January)", nameAr: "", nameEn: "", nameKa: "", img: "" },
    { monthLabel: "فبراير (February)", nameAr: "", nameEn: "", nameKa: "", img: "" },
    { monthLabel: "مارس (March)", nameAr: "", nameEn: "", nameKa: "", img: "" },
    { monthLabel: "أبريل (April)", nameAr: "", nameEn: "", nameKa: "", img: "" },
    { monthLabel: "مايو (May)", nameAr: "", nameEn: "", nameKa: "", img: "" },
    { monthLabel: "يونيو (June)", nameAr: "", nameEn: "", nameKa: "", img: "" }
];

let playerOfTheMonth = { name: "", img: "" };
let playerOfTheWeek = { name: "", img: "" };

let playersData = {
    '2010-2012': [],
    '2013-2014': [],
    '2015-2016': []
};

let artisticGalleryImages = [
            { id: 1, url: "https://i.ibb.co/Kxtrs2fB/571130373-122145397838897937-8287073912211216502-n.jpg", span: "slot-1" },
            { id: 2, url: "https://i.ibb.co/nMcPdkVM/571298517-122145397982897937-1422789647226507421-n.jpg", span: "slot-2" },
            { id: 3, url: "https://i.ibb.co/jktyrmMX/543521129-122137955502897937-8173491443653136263-n.jpg", span: "slot-3" },
            { id: 4, url: "https://i.ibb.co/FL7hZvr6/571360690-122145397718897937-8087716033927012128-n.jpg", span: "slot-2" },
            { id: 5, url: "https://i.ibb.co/YBSDXz9Z/544790912-122137955688897937-5264359672051010372-n.jpg", span: "slot-5" },
            { id: 6, url: "https://i.ibb.co/rG1yPWSY/627149590-122149673970897937-1759600100726710603-n.jpg", span: "slot-6" },
            { id: 7, url: "https://i.ibb.co/whmQXnhQ/649501789-122152862804897937-7750849642595088651-n.jpg", span: "slot-7" },
            { id: 8, url: "https://i.ibb.co/PZBsGGBV/806473736-122159011704897937-2516480806441584693-n.jpg", span: "slot-8" },
            { id: 9, url: "https://i.ibb.co/yFZhSX5L/807385761-122159011536897937-6799042578500171261-n.jpg", span: "slot-9" },
            { id: 10, url: "https://i.ibb.co/fGCRtkYk/858814271-122161109918897937-7769913165021237978-n.jpg", span: "slot-10" }
        ];

let parentsAccounts = {}; 
let pendingParentRequests = []; 
let pendingForgotRequests = []; 
let systemNotifications = []; 
let coachNotebookEntries = []; 
let newsArticles = [
    { id: 1, title: "مرحباً بكم في الموقع الرسمي لنادي Maven Hub", content: "انطلق نظامنا الاحترافي الجديد لمتابعة اللاعبين وتحليلات الأداء البدني والتكتيكي.", img: "", date: "2026/10/25" }
];

let isStaffLoggedIn = false;
let loggedInStaffKey = '';
let loggedInStaffName = '';
let loggedInUserType = null;
let currentLoggedInPlayer = null;
let currentLoggedInParentObj = null;
let currentGroupKey = '';
let currentActivePlayerForPhoto = null;
let targetCoachForDirectMsg = null;
let currentGallerySlotId = null;
let activeCoachKeyForAvatar = null;
let activeCoachKeyForBio = '';

let cropSourceImage = null;
let cropTargetType = '';
let cropCanvasObj, cropCtxObj;
let cropBox = { x: 20, y: 20, size: 160 };
let isDraggingCrop = false;
let dragStartX = 0, dragStartY = 0;

const staffCredentials = {
    "khalil": { pass: "khalil12341234", name: "كابتن/ خليل عمارة", img: "" },
    "abdelrahman": { pass: "abdelrahman12341234", name: "كابتن/ عبد الرحمن خليل", img: "" },
    "amir": { pass: "amir12341234", name: "كابتن/ أمير أحمد", img: "" },
    "medany": { pass: "medany12341234", name: "محلل الأداء/ محمد مدني", img: "" }
};

function renderCoachesImages() {
    for(let key in staffCredentials) {
        const imgEl = document.getElementById(`coachImg_${key}`);
        if(imgEl) { imgEl.src = staffCredentials[key].img || ''; }
    }
}

function triggerHeaderAvatarUpload() {
    if(!isStaffLoggedIn || !loggedInStaffKey) {
        openLoginModal('coach');
        return;
    }
    activeCoachKeyForAvatar = loggedInStaffKey;
    document.getElementById('coach-avatar-upload-input').click();
}

function toggleStaffDropdown() {
    document.getElementById('staffDropdownMenu').classList.toggle('active');
}

function openCoachDashboardTab(tabName) {
    document.getElementById('staffDropdownMenu').classList.remove('active');
    openCoachDashboard();
    switchCoachTab(tabName);
}

function previewCropImage(event, targetType) {
    const file = event.target.files[0];
    if(!file) return;
    cropTargetType = targetType;
    const reader = new FileReader();
    reader.onload = function(e) {
        cropSourceImage = new Image();
        cropSourceImage.onload = function() {
            openCropModal();
        };
        cropSourceImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function openCropModal() {
    document.getElementById('crop-modal').classList.add('active');
    cropCanvasObj = document.getElementById('cropCanvas');
    cropCtxObj = cropCanvasObj.getContext('2d');
    
    let maxW = 320;
    let scale = Math.min(1, maxW / cropSourceImage.width);
    cropCanvasObj.width = cropSourceImage.width * scale;
    cropCanvasObj.height = cropSourceImage.height * scale;
    
    cropBox = { x: 10, y: 10, size: Math.min(cropCanvasObj.width, cropCanvasObj.height) * 0.7 };
    drawCropCanvas();

    cropCanvasObj.onmousedown = (e) => startCropDrag(e.offsetX, e.offsetY);
    cropCanvasObj.onmousemove = (e) => moveCropDrag(e.offsetX, e.offsetY);
    cropCanvasObj.onmouseup = endCropDrag;

    cropCanvasObj.ontouchstart = (e) => {
        if (e.touches.length === 1) {
            let touch = e.touches[0];
            let rect = cropCanvasObj.getBoundingClientRect();
            startCropDrag(touch.clientX - rect.left, touch.clientY - rect.top);
            e.preventDefault();
        }
    };

    cropCanvasObj.ontouchmove = (e) => {
        if (e.touches.length === 1) {
            let touch = e.touches[0];
            let rect = cropCanvasObj.getBoundingClientRect();
            moveCropDrag(touch.clientX - rect.left, touch.clientY - rect.top);
            e.preventDefault();
        }
    };

    cropCanvasObj.ontouchend = endCropDrag;
}
function closeCropModal() {
    document.getElementById('crop-modal').classList.remove('active');
}

function drawCropCanvas() {
    cropCtxObj.clearRect(0, 0, cropCanvasObj.width, cropCanvasObj.height);
    cropCtxObj.drawImage(cropSourceImage, 0, 0, cropCanvasObj.width, cropCanvasObj.height);
    
    cropCtxObj.fillStyle = 'rgba(0,0,0,0.6)';
    cropCtxObj.fillRect(0, 0, cropCanvasObj.width, cropCanvasObj.height);
    
    cropCtxObj.save();
    cropCtxObj.beginPath();
    cropCtxObj.arc(cropBox.x + cropBox.size/2, cropBox.y + cropBox.size/2, cropBox.size/2, 0, Math.PI * 2);
    cropCtxObj.clip();
    cropCtxObj.drawImage(cropSourceImage, 0, 0, cropCanvasObj.width, cropCanvasObj.height);
    cropCtxObj.restore();

    cropCtxObj.beginPath();
    cropCtxObj.arc(cropBox.x + cropBox.size/2, cropBox.y + cropBox.size/2, cropBox.size/2, 0, Math.PI * 2);
    cropCtxObj.strokeStyle = '#3b82f6';
    cropCtxObj.lineWidth = 3;
    cropCtxObj.stroke();
}

function startCropDrag(x, y) {
    isDraggingCrop = true;
    dragStartX = x - cropBox.x;
    dragStartY = y - cropBox.y;
}

function moveCropDrag(x, y) {
    if(!isDraggingCrop) return;
    cropBox.x = Math.max(0, Math.min(cropCanvasObj.width - cropBox.size, x - dragStartX));
    cropBox.y = Math.max(0, Math.min(cropCanvasObj.height - cropBox.size, y - dragStartY));
    drawCropCanvas();
}

function endCropDrag() {
    isDraggingCrop = false;
}
function executeCropAndSave() {
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = 300;
    tempCanvas.height = 300;
    let tempCtx = tempCanvas.getContext('2d');
    
    let scale = cropSourceImage.width / cropCanvasObj.width;
    tempCtx.drawImage(
        cropSourceImage,
        cropBox.x * scale, cropBox.y * scale, cropBox.size * scale, cropBox.size * scale,
        0, 0, 300, 300
    );
    
    let croppedDataUrl = tempCanvas.toDataURL('image/jpeg', 0.9);
    closeCropModal();

    if(cropTargetType === 'player' && currentActivePlayerForPhoto) {
        currentActivePlayerForPhoto.img = croppedDataUrl;
        document.getElementById('modal-player-avatar').src = croppedDataUrl;
        saveDataToCloud('playersData', playersData);
        alert('تم قص وحفظ الصورة الشخصية للاعب بنجاح وحفظها في السحابة!');
        if(currentGroupKey) renderPlayersCards(currentGroupKey);
    } else if(cropTargetType === 'coach' && activeCoachKeyForAvatar) {
        staffCredentials[activeCoachKeyForAvatar].img = croppedDataUrl;
        renderCoachesImages();
        updateHeaderUserAvatarUI();
        
        let staffImgsMap = {};
        for(let k in staffCredentials) {
            staffImgsMap[k] = { img: staffCredentials[k].img };
        }
        saveDataToCloud('staffCredentials', staffImgsMap);

        alert('تم قص وحفظ صورتك الشخصية كمدرب وحفظها في السحابة بنجاح!');
    } else if(cropTargetType === 'parent') {
        document.getElementById('parent-avatar').src = croppedDataUrl;
        if(currentLoggedInParentObj) {
            currentLoggedInParentObj.avatar = croppedDataUrl;
            let parentKey = currentLoggedInParentObj.son.name.toLowerCase();
            if(parentsAccounts[parentKey]) {
                parentsAccounts[parentKey].avatar = croppedDataUrl;
                saveDataToCloud('parentsAccounts', parentsAccounts);
            }
        }
     } else if(cropTargetType === 'gallery' && currentGallerySlotId) {
        let found = artisticGalleryImages.find(img => img.id === currentGallerySlotId);
        if(found) {
            found.url = croppedDataUrl;
            renderArtisticGallery();
            saveDataToCloud('artisticGalleryImages', artisticGalleryImages);
            alert('تم إضافة الصورة المقصوصة للمعرض وحفظها في السحابة بنجاح!');
        }
    } else if(cropTargetType === 'potm') {
        playerOfTheMonth.img = croppedDataUrl;
        updatePotmUI();
        saveDataToCloud('playerOfTheMonth', playerOfTheMonth);
        alert('تم تحديث صورة لاعب الشهر وحفظها في السحابة!');
    } else if(cropTargetType === 'potw') {
        playerOfTheWeek.img = croppedDataUrl;
        updatePotwUI();
        saveDataToCloud('playerOfTheWeek', playerOfTheWeek);
        alert('تم تحديث صورة لاعب الأسبوع وحفظها في السحابة!');
    } else if(cropTargetType === 'legend') {
        const monthIdx = document.getElementById('admin-legend-month-select').value;
        academyLegendsData[monthIdx].img = croppedDataUrl;
        renderAcademyLegends();
        saveDataToCloud('academyLegendsData', academyLegendsData);
        alert('تم حفظ بطاقة POTM الشهرية وحفظها في السحابة!');
    } else if(cropTargetType === 'news') {
        window.tempNewsCroppedImg = croppedDataUrl;
        alert('تم اقتصاص صورة الخبر بنجاح!');
    } else if(cropTargetType === 'newPlayer') {
        window.tempNewPlayerCroppedImg = croppedDataUrl;
        alert('تم اقتصاص صورة اللاعب الجديد بنجاح!');
    }
}

function addNewCoachNote() {
    const input = document.getElementById('coachNewNoteInput');
    const text = input.value.trim();
    if(!text) { alert('اكتب نص الملاحظة أولاً'); return; }
    const now = new Date();
    coachNotebookEntries.unshift({
        text: text,
        dateTime: `${now.toLocaleDateString('ar-EG')} ${now.toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}`,
        author: loggedInStaffName || 'مشرف النادي'
    });
    input.value = '';
    renderCoachNotebookList();
    saveDataToCloud('coachNotebookEntries', coachNotebookEntries);
    alert('تم حفظ الملاحظة وحفظها في السحابة بنجاح!');
}

function renderCoachNotebookList() {
    const container = document.getElementById('coachNotebookListContainer');
    if(!container) return;
    if(coachNotebookEntries.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem; text-align:center;">لا توجد ملاحظات مسجلة حالياً.</p>`;
        return;
    }
    container.innerHTML = '';
    coachNotebookEntries.forEach((note) => {
        container.innerHTML += `
            <div style="background:var(--card-bg); border:1px solid var(--accent); border-radius:10px; padding:12px 15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; font-size:0.8rem; color:var(--accent);">
                    <span><i class="fa-solid fa-user-pen"></i> ${note.author}</span>
                    <span><i class="fa-solid fa-clock"></i> ${note.dateTime}</span>
                </div>
                <div style="color:var(--text); font-size:1rem; line-height:1.5;">${note.text}</div>
            </div>
        `;
    });
}

function addNewNewsArticle() {
    const title = document.getElementById('admin-news-title').value.trim();
    const content = document.getElementById('admin-news-content').value.trim();
    const imgUrl = window.tempNewsCroppedImg || '';
    if(!title || !content) { alert('أدخل عنوان ومحتوى الخبر'); return; }

    const now = new Date();
    newsArticles.unshift({
        id: Date.now(),
        title: title,
        content: content,
        img: imgUrl,
        date: now.toLocaleDateString('ar-EG')
    });
    document.getElementById('admin-news-title').value = '';
    document.getElementById('admin-news-content').value = '';
    window.tempNewsCroppedImg = '';
    
    renderNewsTickers();
    renderNewsFullList();
    renderCoachDashboardNewsList();
    
    saveDataToCloud('newsArticles', newsArticles);
    alert('تم نشر الخبر وحفظه في السحابة بنجاح!');
}

// دالة حذف الخبر للمدرب
function deleteNewsArticle(newsId) {
    if(!isStaffLoggedIn) { alert('هذا الإجراء متاح للمدربين فقط'); return; }
    if(!confirm('هل أنت متأكد من رغبتك في حذف هذا الخبر نهائياً؟')) return;

    newsArticles = newsArticles.filter(item => item.id !== newsId);
    
    renderNewsTickers();
    renderNewsFullList();
    renderCoachDashboardNewsList();
    
    saveDataToCloud('newsArticles', newsArticles);
    alert('تم حذف الخبر بنجاح وتحديث السحابة!');
}

function renderCoachDashboardNewsList() {
    const container = document.getElementById('coachDashboardNewsListContainer');
    if(!container) return;
    if(newsArticles.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem;">لا توجد أخبار منشورة حالياً.</p>`;
        return;
    }
    container.innerHTML = '';
    newsArticles.forEach(news => {
        container.innerHTML += `
            <div style="background:var(--card-bg); border:1px solid var(--accent); border-radius:10px; padding:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h5 style="color:var(--text); margin-bottom:3px;">${news.title}</h5>
                    <span style="font-size:0.75rem; color:var(--text-muted);"><i class="fa-solid fa-calendar"></i> ${news.date}</span>
                </div>
                <button class="btn-primary-custom" style="background:#dc2626; border-color:#dc2626; color:#fff; padding:6px 12px; font-size:0.8rem;" onclick="deleteNewsArticle(${news.id})">
                    <i class="fa-solid fa-trash-can"></i> حذف
                </button>
            </div>
        `;
    });
}

function renderNewsTickers() {
    const container = document.getElementById('homeNewsTickerContainer');
    if(!container) return;
    container.innerHTML = '';
    if(newsArticles.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted);">لا توجد أخبار جديدة حالياً.</p>`;
        return;
    }
    newsArticles.forEach(news => {
        let imgTag = news.img ? `<img src="${news.img}" style="width:100%; max-height:250px; object-fit:cover; border-radius:12px; margin-bottom:12px; border:2px solid var(--accent);" alt="News Image">` : '';
        container.innerHTML += `
            <div class="news-neon-strip" onclick="this.classList.toggle('expanded')">
                <div class="news-strip-header">
                    <span><i class="fa-solid fa-bolt" style="color:var(--accent); margin-left:8px;"></i> ${news.title}</span>
                    <span style="font-size:0.8rem; color:var(--text-muted);">${news.date} <i class="fa-solid fa-chevron-down" style="margin-right:5px;"></i></span>
                </div>
                <div class="news-strip-body">
                    ${imgTag}
                    <p>${news.content}</p>
                </div>
            </div>
        `;
    });
}

function renderNewsFullList() {
    const container = document.getElementById('newsSectionFullList');
    if(!container) return;
    container.innerHTML = '';
    newsArticles.forEach(news => {
        let imgTag = news.img ? `<img src="${news.img}" style="width:100%; max-height:300px; object-fit:cover; border-radius:12px; margin-bottom:15px; border:2px solid var(--accent);" alt="News Full">` : '';
        container.innerHTML += `
            <div style="background:var(--card-bg); backdrop-filter:blur(14px); border:2px solid var(--accent); border-radius:18px; padding:25px; box-shadow:0 0 30px var(--accent-glow);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:0.85rem; color:var(--accent);">
                    <span><i class="fa-solid fa-calendar"></i> ${news.date}</span>
                    <span>إعلان رسمي</span>
                </div>
                <h3 style="color:var(--text); font-size:1.4rem; margin-bottom:12px; text-shadow:0 0 10px var(--accent-glow);">${news.title}</h3>
                ${imgTag}
                <p style="color:var(--text-muted); line-height:1.8; font-size:1.05rem;">${news.content}</p>
            </div>
        `;
    });
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fa-solid fa-moon';
    }
}

function changeLanguage(lang) {
    document.documentElement.setAttribute('dir', lang === 'en' || lang === 'ka' ? 'ltr' : 'rtl');
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
    renderAcademyLegends();
    updateHeaderUserAvatarUI();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

function toggleSubmenu(id) { document.getElementById(id).classList.toggle('active'); }
function switchSection(sectionId) {
    document.querySelectorAll('.section-view').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleAccordion(header) {
    const item = header.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.accordion-item').forEach(acc => acc.classList.remove('active'));
    if (!isActive) { item.classList.add('active'); }
}

function togglePreviewMode() { document.body.classList.toggle('preview-mode'); }
function toggleLoginMenu() { document.getElementById('loginMenuBox').classList.toggle('active'); }

function openLoginModal(type) {
    document.getElementById('loginMenuBox').classList.remove('active');
    const body = document.getElementById('authModalBody');
    if(type === 'player') {
        body.innerHTML = `
            <h3 style="text-align:center; margin-bottom:15px; color:var(--accent);">تسجيل دخول اللاعب</h3>
            <div class="form-group"><label>اسم اللاعب</label><input type="text" id="auth-p-name" class="eval-input" placeholder="اسمك"></div>
            <div class="form-group"><label>كلمة المرور</label><input type="password" id="auth-p-pass" class="eval-input" placeholder="كلمة المرور"></div>
            <div style="text-align:left; margin-bottom:15px;"><a href="#" onclick="openForgotPasswordModal('player')" style="color:var(--accent); font-size:0.85rem; text-decoration:none;">نسيت كلمة المرور؟</a></div>
            <button class="btn-primary-custom" style="width:100%;" onclick="submitPlayerAuthLogin()">دخول اللاعب</button>
        `;
    } else if(type === 'parent') {
        switchSection('parents-sec');
        closeAuthModal();
        return;
    } else if(type === 'coach') {
        body.innerHTML = `
            <h3 style="text-align:center; margin-bottom:15px; color:var(--accent);">تسجيل دخول المدرب / محلل الأداء</h3>
            <div class="form-group"><label>اسم المستخدم (مثال: khalil)</label><input type="text" id="auth-c-user" class="eval-input" placeholder="أدخل اسم المستخدم"></div>
            <div class="form-group"><label>كلمة المرور</label><input type="password" id="auth-c-pass" class="eval-input" placeholder="كلمة المرور"></div>
            <div style="display: flex; align-items: center; gap: 8px; margin: 15px 0;">
                <input type="checkbox" id="coach-remember-me" style="width:auto; cursor:pointer;">
                <label for="coach-remember-me" style="margin:0; cursor:pointer; font-weight:700;">تذكرني (Remember Me)</label>
            </div>
            <button class="btn-primary-custom" style="width:100%; margin-top:5px;" onclick="submitCoachAuthLogin()">دخول للوحة التحكم</button>
        `;
    }
    document.getElementById('auth-modal').classList.add('active');
}
function closeAuthModal() { document.getElementById('auth-modal').classList.remove('active'); }

function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('active');
    
    // إذا أصبحت القائمة مفتوحة، نقوم بتصفير العداد الأحمر فوراً
    if(dropdown.classList.contains('active')) {
        const badge = document.getElementById('notifBadge');
        if(badge) badge.innerText = "0";
    }
}

async function addSystemNotification(msg, recipientRole) {
    systemNotifications.unshift({ msg, time: new Date().toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'}), recipient: recipientRole });
    updateNotificationsUI();
    await saveDataToCloud('systemNotifications', systemNotifications);
}

function updateNotificationsUI() {
    const badge = document.getElementById('notifBadge');
    const list = document.getElementById('notificationList');
    badge.innerText = systemNotifications.length;
    if(systemNotifications.length === 0) {
        list.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem; text-align:center;" data-translate="no_notifications">لا توجد إشعارات جديدة حالياً.</p>`;
        return;
    }
    list.innerHTML = '';
    systemNotifications.forEach((n) => {
        list.innerHTML += `
            <div class="notif-item">
                <div style="font-weight:700; color:var(--accent); margin-bottom:3px;">إشعار نادي Maven Hub</div>
                <div>${n.msg}</div>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px; text-align:left;">${n.time}</div>
            </div>
        `;
    });
}

function openForgotPasswordModal(role) {
    closeAuthModal();
    document.getElementById('forgot-pass-modal').classList.add('active');
}
function closeForgotPasswordModal() { document.getElementById('forgot-pass-modal').classList.remove('active'); }

async function submitForgotPasswordRequest() {
    const name = document.getElementById('forgotInputName').value.trim();
    if(!name) { alert('أدخل الاسم من فضلك'); return; }
    pendingForgotRequests.push({ name, time: new Date().toLocaleString() });
    await addSystemNotification(`طلب استعادة كلمة المرور مقدم من: ${name}.`, 'coach');
    alert('تم إرسال طلب استعادة كلمة المرور للمدربين بنجاح.');
    closeForgotPasswordModal();
}

// دالة تسجيل ولي الأمر وحفظ الطلب سحابياً لكي يظهر عند المدرب من أي جهاز
async function parentRegisterWhatsApp() {
    const sonName = document.getElementById('parent-reg-sonname').value.trim();
    const fullName = document.getElementById('parent-reg-fullname').value.trim();
    const phone = document.getElementById('parent-reg-phone').value.trim();
    const pass = document.getElementById('parent-reg-pass').value.trim();

    if(!sonName || !fullName || !phone || !pass) { alert('يرجى إكمال جميع الحانات المطلوبة'); return; }

    let foundPlayer = null;
    for(let g in playersData) {
        const match = playersData[g].find(p => p.name.toLowerCase() === sonName.toLowerCase());
        if(match) foundPlayer = match;
    }
    if(!foundPlayer) {
        alert('خطأ: اسم الابن اللاعب غير مسجل بالنادي.');
        return;
    }

    const avatarUrl = document.getElementById('parent-avatar').src || '';
    
    const newRequest = {
        id: Date.now(),
        parentName: fullName,
        sonName: foundPlayer.name,
        phone: phone,
        pass: pass,
        avatar: avatarUrl,
        sonObj: foundPlayer
    };

    pendingParentRequests.push(newRequest);
    await saveDataToCloud('pendingParentRequests', pendingParentRequests);

    await addSystemNotification(`طلب حساب ولي أمر جديد لـ (${fullName}) خاص بالابن (${foundPlayer.name}).`, 'coach');
    
    const waMessage = encodeURIComponent(`مرحباً إدارة نادي Maven Hub، أود طلب تفعيل حساب ولي الأمر.\nاسم ولي الأمر: ${fullName}\nاسم الابن اللاعب: ${foundPlayer.name}\nرقم الهاتف: ${phone}`);
    window.open(`https://wa.me/201009955294?text=${waMessage}`, '_blank');

    alert('تم إرسال طلب انضمامك بنجاح وجاري توجيهك لواتساب النادي لإتمام التفعيل مع المدربين.');
    switchParentTab('login');
}

function parentLogin() {
    const nameInput = document.getElementById('parent-login-name');
    const passInput = document.getElementById('parent-login-pass');
    const name = nameInput.value.trim().toLowerCase();
    const pass = passInput.value.trim();

    if(!parentsAccounts[name] || parentsAccounts[name].pass !== pass) {
        alert('خطأ في اسم الابن أو كلمة المرور، أو أن حسابك لم يعتمده المدرب بعد.');
        return;
    }

    let parentDataObj = parentsAccounts[name];
    let foundPlayer = parentDataObj.sonObj;

    loggedInUserType = 'parent';
    currentLoggedInParentObj = { name: parentDataObj.parentName, son: foundPlayer, avatar: parentDataObj.avatar };
    updateHeaderUserAvatarUI();

    document.getElementById('parent-auth-box').style.display = 'none';
    document.getElementById('parent-dashboard').style.display = 'block';
    document.getElementById('welcome-parent-name').innerText = 'ولي الأمر / ' + parentDataObj.parentName;
    document.getElementById('parent-avatar').src = parentDataObj.avatar || '';

    const warningBox = document.getElementById('parent-warning-box');
    const warningsList = document.getElementById('parent-warnings-list');
    if(foundPlayer.warnings && foundPlayer.warnings.length > 0) {
        warningBox.style.display = 'block';
        warningsList.innerHTML = '';
        foundPlayer.warnings.forEach(w => {
            warningsList.innerHTML += `
                <div style="background:rgba(239, 68, 68, 0.1); border:1px solid #ef4444; border-radius:8px; padding:10px 12px;">
                    <div style="font-size:0.75rem; color:#fca5a5; margin-bottom:3px;"><i class="fa-solid fa-clock"></i> ${w.date}</div>
                    <div style="color:var(--text); font-size:1rem;">${w.text}</div>
                </div>
            `;
        });
    } else {
        warningBox.style.display = 'none';
    }

    const sonCardContainer = document.getElementById('son-card-container');
    sonCardContainer.innerHTML = `
        <div class="player-card" onclick="triggerParentSonFlipAndDetails(${foundPlayer.id})">
            <img src="${foundPlayer.img}" alt="${foundPlayer.name}">
            <h3 style="color:var(--text);">${foundPlayer.name} (الابن)</h3>
            <p style="color:var(--accent); font-weight:bold; margin:5px 0;">${foundPlayer.pos}</p>
            <p style="font-size:0.95rem; color:var(--accent); margin-top:5px;">انقر لعرض الاستمارة التفصيلية الكاملة</p>
        </div>
        <div class="player-card">
            <h4 style="color:var(--text);">إجمالي الحصص</h4>
            <p style="font-size: 1.8rem; font-weight:bold; color:var(--accent); margin-top:10px;">8 حصص</p>
        </div>
        <div class="player-card">
            <h4 style="color:var(--text);">حالة الاشتراك</h4>
            <p style="font-size: 1.5rem; font-weight:bold; color: ${foundPlayer.status === 'Paid' ? '#22c55e' : '#ef4444'}; margin-top:10px;">${foundPlayer.status}</p>
        </div>
    `;
    renderParentCompactSchedule(foundPlayer);

    let attendedCount = (foundPlayer.schedule || []).filter(s => s.attended).length;
    document.getElementById('parent-son-evaluation-view').innerHTML = `
        <p style="margin-bottom:10px; color:var(--text);"><b>1. الالتزام بالمواعيد:</b> ${foundPlayer.eval.commitment} / 5</p>
        <p style="margin-bottom:10px; color:var(--text);"><b>2. احترام المدرب:</b> ${foundPlayer.eval.respect} / 5</p>
        <p style="margin-bottom:10px; color:var(--text);"><b>3. الشغف للتطور:</b> ${foundPlayer.eval.passion} / 5</p>
        <p style="margin-bottom:10px; color:var(--text);"><b>سجل حضور الحصص:</b> تم حضور <span style="color:#22c55e; font-weight:bold;">${attendedCount}</span> حصة من أصل 8 حصص.</p>
        <p style="margin-top:15px; color:var(--accent);"><b>القرار النهائي:</b> ${foundPlayer.eval.finalDecision}</p>
    `;
}

function triggerParentAvatarUpload() { document.getElementById('parent-avatar-upload-input').click(); }

function submitPlayerAuthLogin() {
    const name = document.getElementById('auth-p-name').value.trim();
    const pass = document.getElementById('auth-p-pass').value.trim();
    let foundPlayer = null;
    for(let g in playersData) {
        const match = playersData[g].find(p => p.name.toLowerCase() === name.toLowerCase() && p.pass === pass);
        if(match) foundPlayer = match;
    }
    if(foundPlayer) {
        loggedInUserType = 'player';
        currentLoggedInPlayer = foundPlayer;
        updateHeaderUserAvatarUI();
        closeAuthModal();
        renderPlayerDetailsModal(foundPlayer, true, false);
    } else {
        alert('خطأ في اسم اللاعب أو كلمة المرور.');
    }
}

function submitCoachAuthLogin() {
    const user = document.getElementById('auth-c-user').value.trim().toLowerCase();
    const pass = document.getElementById('auth-c-pass').value.trim();
    const rememberMe = document.getElementById('coach-remember-me').checked;

    if(staffCredentials[user] && staffCredentials[user].pass === pass) {
        isStaffLoggedIn = true;
        loggedInStaffKey = user;
        loggedInStaffName = staffCredentials[user].name;
        loggedInUserType = 'staff';
        
        if(rememberMe) {
            localStorage.setItem('maven_saved_coach_key', user);
        } else {
            localStorage.removeItem('maven_saved_coach_key');
        }

        updateHeaderUserAvatarUI();
        closeAuthModal();
        openCoachDashboard();
        alert('تم تسجيل الدخول بنجاح كـ ' + loggedInStaffName);
    } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
}

function updateHeaderUserAvatarUI() {
    const avatarArea = document.getElementById('headerUserAvatarArea');
    const userImg = document.getElementById('headerUserImg');
    const userName = document.getElementById('headerUserName');
    const loginBtn = document.getElementById('unifiedLoginBtn');
    const notifBellArea = document.querySelector('.notification-bell-area');

    if (loggedInUserType === 'player' || loggedInUserType === 'parent' || loggedInUserType === 'staff') {
        avatarArea.style.display = 'flex';
        if (notifBellArea) notifBellArea.style.display = 'inline-block';
        
        if (loggedInUserType === 'player' && currentLoggedInPlayer) {
            userImg.src = currentLoggedInPlayer.img;
            userName.innerText = currentLoggedInPlayer.name;
        } else if (loggedInUserType === 'parent' && currentLoggedInParentObj) {
            userImg.src = currentLoggedInParentObj.avatar;
            userName.innerText = currentLoggedInParentObj.name;
        } else if (loggedInUserType === 'staff') {
            userImg.src = staffCredentials[loggedInStaffKey]?.img || '';
            userName.innerText = loggedInStaffName;
        }

        loginBtn.style.display = 'none';

        if (window.innerWidth <= 900) {
            avatarArea.classList.add('moved-to-top-logo');
        }
    } else {
        avatarArea.style.display = 'none';
        loginBtn.style.display = 'block';
        avatarArea.classList.remove('moved-to-top-logo');
        if (notifBellArea) notifBellArea.style.display = 'none';
    }
}

function globalLogout() {
    loggedInUserType = null;
    isStaffLoggedIn = false;
    loggedInStaffKey = '';
    loggedInStaffName = '';
    currentLoggedInPlayer = null;
    currentLoggedInParentObj = null;
    localStorage.removeItem('maven_saved_coach_key');
    updateHeaderUserAvatarUI();
    closePlayerModal();
    document.getElementById('parent-dashboard').style.display = 'none';
    document.getElementById('parent-auth-box').style.display = 'block';
    document.getElementById('staffDropdownMenu').classList.remove('active');
    alert('تم تسجيل الخروج بنجاح.');
    switchSection('home-section');
}

function openPlayersGroup(groupKey) {
    currentGroupKey = groupKey;
    document.getElementById('group-title-label').innerText = 'اللاعبون - مواليد ' + groupKey;
    renderPlayersCards(groupKey);
    switchSection('players-list-view');
}

function renderPlayersCards(groupKey) {
    const container = document.getElementById('players-cards-container');
    container.innerHTML = '';
    if(playersData[groupKey].length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align:center; padding:50px; background:var(--card-bg); border-radius:20px; border:2px dashed var(--accent);">
                <i class="fa-solid fa-users-slash fa-3x" style="color:var(--accent); margin-bottom:15px;"></i>
                <h3 style="color:var(--text); margin-bottom:10px;">لا توجد ملفات لاعبين حالياً في هذه الفئة</h3>
            </div>
        `;
        return;
    }
    playersData[groupKey].forEach(player => {
        container.innerHTML += `
            <div class="player-card" onclick="triggerCinematicFlipAndProfile(${player.id})">
                <img src="${player.img}" alt="${player.name}">
                <h3 style="color:var(--text);">${player.name}</h3>
                <p style="color:var(--accent); font-weight:bold; margin:5px 0;">${player.pos}</p>
                <p style="color:var(--text-muted);">${player.birth}</p>
            </div>
        `;
    });
}

function triggerCinematicFlipAndProfile(playerId) {
    let player = null;
    for (let g in playersData) {
        const found = playersData[g].find(p => p.id === playerId);
        if (found) player = found;
    }
    if(!player) return;

    document.getElementById('flipCardFront').innerHTML = `
        <img src="${player.img}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--accent); margin-bottom:12px; background:#112233;" alt="Flip Player">
        <h3 style="color:var(--text);">${player.name}</h3>
        <p style="color:var(--accent); font-weight:bold; font-size:0.95rem; margin-top:5px;">${player.pos}</p>
    `;

    const overlay = document.getElementById('flipOverlay');
    const container = document.getElementById('flippingCardContainer');
    overlay.classList.add('active');
    setTimeout(() => { container.classList.add('flip'); }, 100);

    setTimeout(() => {
        let isOwner = (loggedInUserType === 'player' && currentLoggedInPlayer && currentLoggedInPlayer.id === player.id);
        let isCoach = isStaffLoggedIn;
        renderPlayerDetailsModal(player, isOwner || isCoach, true);
        container.classList.remove('flip');
        setTimeout(() => { overlay.classList.remove('active'); }, 600);
    }, 1400);
}

function triggerCoachFlipAndBio(coachKey) {
    let bioData = coachesBios.ar[coachKey] || coachesBios.ar.khalil;
    let imgUrl = staffCredentials[coachKey]?.img || '';
    activeCoachKeyForBio = coachKey;

    document.getElementById('flipCardFront').innerHTML = `
        <img src="${imgUrl}" style="width:110px; height:110px; border-radius:50%; object-fit:cover; border:3px solid var(--accent); margin-bottom:12px; background:#112233;" alt="Coach Flip">
        <h3 style="color:var(--text);">${bioData.name}</h3>
        <p style="color:var(--accent); font-weight:bold; font-size:0.95rem; margin-top:5px;">${bioData.role}</p>
    `;
    const overlay = document.getElementById('flipOverlay');
    const container = document.getElementById('flippingCardContainer');
    overlay.classList.add('active');
    setTimeout(() => { container.classList.add('flip'); }, 100);

    setTimeout(() => {
        openCoachBio(coachKey);
        container.classList.remove('flip');
        setTimeout(() => { overlay.classList.remove('active'); }, 600);
    }, 1400);
}

function closePlayerModal() { document.getElementById('player-modal').classList.remove('active'); }

function generateAutomaticSchedule(playerSessionsCount = 8) {
    let sessions = [];
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let startDate = new Date(year, month, 1);
    
    let currentDate = new Date(startDate);
    while (currentDate.getDay() !== 0 && currentDate.getDay() !== 4) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    for(let i = 0; i < playerSessionsCount; i++) {
        let dayName = currentDate.getDay() === 0 ? "الأحد" : "الخميس";
        let dateStr = currentDate.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
        sessions.push({ day: dayName, date: dateStr, attended: false });
        
        if(currentDate.getDay() === 0) {
            currentDate.setDate(currentDate.getDate() + 4);
        } else {
            currentDate.setDate(currentDate.getDate() + 3);
        }
    }
    return sessions;
}

function checkAndResetScheduleIfCompleted(player) {
    if(!player.schedule || player.schedule.length === 0) return;
    let allAttended = player.schedule.every(s => s.attended);
    if(allAttended) {
        player.schedule = generateAutomaticSchedule(8);
        player.monthCycle = (player.monthCycle || 1) + 1;
    }
}

function toggleBubbleAttendance(playerId, sessionIdx) {
    if(!isStaffLoggedIn) { alert('للمدربين فقط'); return; }
    let player = null;
    for (let g in playersData) {
        const found = playersData[g].find(p => p.id === playerId);
        if (found) player = found;
    }
    if(!player) return;
    if(!player.schedule) player.schedule = generateAutomaticSchedule(8);
    
    player.schedule[sessionIdx].attended = !player.schedule[sessionIdx].attended;
    checkAndResetScheduleIfCompleted(player);
    saveDataToCloud('playersData', playersData);
    renderPlayerDetailsModal(player, true, true);
}

function renderParentCompactSchedule(player) {
    if(!player.schedule) player.schedule = generateAutomaticSchedule(8);
    let attendedCount = player.schedule.filter(s => s.attended).length;
    document.getElementById('parent-attendance-ratio-label').innerText = `تم حضور ${attendedCount} من 8 حصص (الدورة ${player.monthCycle || 1})`;
    document.getElementById('parent-schedule-title-label').innerText = `سجل الحصص التدريبية (الدورة الشهرية رقم ${player.monthCycle || 1})`;
    
    let compactHtml = `<div class="bubble-sheet-container" style="padding:5px 0;">`;
    player.schedule.forEach((s) => {
        let attendedClass = s.attended ? 'attended' : '';
        let statusIcon = s.attended ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-clock"></i>';
        compactHtml += `
            <div class="bubble-item ${attendedClass}" style="min-width:70px; padding:6px 4px;">
                <div class="bubble-day" style="font-size:0.7rem;">${s.day}</div>
                <div class="bubble-date" style="font-size:0.8rem;">${s.date}</div>
                <div class="bubble-status-icon" style="font-size:0.85rem;">${statusIcon}</div>
            </div>
        `;
    });
    compactHtml += `</div>`;
    document.getElementById('parent-compact-bubble-container').innerHTML = compactHtml;
}

function renderPlayerDetailsModal(player, hasFullAccess, isVisitorView) {
    currentActivePlayerForPhoto = player;
    const modalBody = document.getElementById('player-modal-body');
    if(!player.schedule) player.schedule = generateAutomaticSchedule(8);
    
    let canStaffEdit = (isStaffLoggedIn && hasFullAccess);
    let photoTitleAttr = canStaffEdit ? 'onclick="triggerPhotoUpload()" title="انقر لتغيير الصورة"' : '';
    let photoCursorStyle = canStaffEdit ? 'cursor:pointer;' : 'cursor:default;';

    let bubbleHtml = `<div class="bubble-sheet-container">`;
    player.schedule.forEach((s, idx) => {
        let attendedClass = s.attended ? 'attended' : '';
        let statusIcon = s.attended ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-clock"></i>';
        let clickAction = canStaffEdit ? `onclick="toggleBubbleAttendance(${player.id}, ${idx})"` : '';
        bubbleHtml += `
            <div class="bubble-item ${attendedClass}" ${clickAction}>
                <div class="bubble-day">${s.day}</div>
                <div class="bubble-date">${s.date}</div>
                <div class="bubble-status-icon">${statusIcon}</div>
            </div>
        `;
    });
    bubbleHtml += `</div>`;

    let deletePlayerBtnHtml = canStaffEdit ? `
        <div style="margin-top:20px; text-align:center;">
            <button class="btn-primary-custom" style="background:#dc2626; border-color:#dc2626; color:#fff; width:100%;" onclick="deletePlayerPermanently(${player.id})">
                <i class="fa-solid fa-trash-can"></i> حذف اللاعب نهائياً من النادي
            </button>
        </div>
    ` : '';

    let editStaffControls = canStaffEdit ? `
        <div style="background:var(--card-bg); backdrop-filter:blur(10px); border:2px dashed var(--accent); border-radius:12px; padding:20px; margin-bottom:25px; text-align:right;">
            <h4 style="color:var(--accent); margin-bottom:15px;"><i class="fa-solid fa-user-pen"></i> استمارة التقييم الاحترافية وتعديل اللاعب</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:15px;">
                <div class="form-group" style="margin:0;"><label>الاسم</label><input type="text" id="edit-p-name" class="eval-input" value="${player.name}"></div>
                <div class="form-group" style="margin:0;"><label>تاريخ الميلاد والسن</label><input type="text" id="edit-p-birth" class="eval-input" value="${player.birth}"></div>
                <div class="form-group" style="margin:0;"><label>القدم المفضلة</label><input type="text" id="edit-p-foot" class="eval-input" value="${player.preferredFoot || 'يمنى'}"></div>
                <div class="form-group" style="margin:0;"><label>الطول والوزن</label><input type="text" id="edit-p-hw" class="eval-input" value="${player.heightWeight || '150 سم / 45 كجم'}"></div>
                <div class="form-group" style="margin:0;"><label>المركز الأساسي</label><input type="text" id="edit-p-pos" class="eval-input" value="${player.pos}"></div>
                <div class="form-group" style="margin:0;"><label>المركز البديل</label><input type="text" id="edit-p-altpos" class="eval-input" value="${player.altPos || 'جناح أيمن'}"></div>
                <div class="form-group" style="margin:0;"><label>حالة الاشتراك</label><select id="edit-p-status" class="eval-input"><option value="Paid" ${player.status=='Paid'?'selected':''}>Paid</option><option value="Unpaid" ${player.status=='Unpaid'?'selected':''}>Unpaid</option></select></div>
            </div>

            <div style="background:rgba(59,130,246,0.1); padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid var(--accent);">
                <label style="color:var(--accent); font-weight:bold; margin-bottom:8px; display:block;"><i class="fa-solid fa-triangle-exclamation"></i> إضافة إنذار جديد لولي الأمر (تراكمي بالتاريخ)</label>
                <input type="text" id="new-warning-input" class="eval-input" placeholder="اكتب نص الإنذار الجديد هنا..." style="margin-bottom:8px;">
                <button class="btn-primary-custom" style="padding:6px 15px; font-size:0.85rem;" onclick="addPlayerWarning(${player.id})">إرسال الإنذار وتوثيقه</button>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h5 style="color:#fbbf24; margin:0;">التقييمات الرقمية (من 1 إلى 5):</h5>
                <button class="ctrl-btn" style="background:#dc2626; border-color:#dc2626; color:#fff; font-size:0.8rem; padding:4px 10px;" onclick="resetPlayerStats(${player.id})"><i class="fa-solid fa-rotate-left"></i> زرار Reset (تصفير التقييمات)</button>
            </div>

            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;">
                ${['commitment','respect','passion','tackling','positioning','interceptions','clearing','explosive','ballspeed','recovery','stamina','onevone','dribbletac','smartsf','shield','shotchoice','shotacc','weakfoot','finishing','breakingpass','firsttouch','scanning','pressingtrig'].map(k => `
                    <div class="form-group">
                        <label style="font-size:0.8rem;">${k}</label>
                        <select id="edit-${k}" class="eval-input">
                            <option value="-" ${player.eval[k] === '-' ? 'selected' : ''}>- من 5</option>
                            ${[1,2,3,4,5].map(n => `<option value="${n}" ${player.eval[k] == n ? 'selected' : ''}>${n}</option>`).join('')}
                        </select>
                    </div>
                `).join('')}
            </div>
            
            <div class="form-group" style="margin-top:10px;"><label>القرار النهائي والتوصيات</label><input type="text" id="edit-decision" class="eval-input" value="${player.eval.finalDecision}"></div>
            <button class="btn-primary-custom" style="width:100%; margin-top:15px;" onclick="savePlayerEdits(${player.id})">حفظ الاستمارة الشاملة</button>
        </div>
    ` : '';

    let html = `
        <div style="text-align:center; margin-bottom:20px;">
            <img id="modal-player-avatar" src="${player.img}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--accent); background:#112233; ${photoCursorStyle}" ${photoTitleAttr} alt="Modal Avatar">
            <h2 style="color:var(--text);">${player.name}</h2>
            <p style="color:var(--accent); font-weight:bold;">${player.pos} | ${player.birth}</p>
    `;

    if(hasFullAccess) {
        html += `
            <p style="margin-top:5px; font-size:0.95rem; color:var(--text);">الاشتراك: <span style="font-weight:bold; color:${player.status === 'Paid' ? '#22c55e' : '#ef4444'};">${player.status}</span></p>
            <div style="margin-top:20px; text-align:right; background:var(--card-bg); border:2px solid var(--accent); border-radius:12px; padding:15px;">
                <h4 style="color:var(--accent); margin-bottom:10px;"><i class="fa-solid fa-calendar-days"></i> سجل الحصص التدريبية (8 حصص)</h4>
                ${bubbleHtml}
            </div>
        </div>
        ${editStaffControls}
        ${deletePlayerBtnHtml}
        <div class="eval-sheet">
        `;
    } else {
        html += `
            <p style="margin-top:10px; color:var(--text-muted); font-size:0.9rem;">(بروفايل زميل - عرض البيانات الأساسية)</p>
        </div>
        <div class="eval-sheet">
        `;
    }

    let formatVal = (v) => v === '-' ? '- من 5' : (v + ' / 5');
    let sections = [];
    if(hasFullAccess) {
        sections = [
            { title: 'أولاً: البيانات الأساسية للاعب', fields: [{label: 'الاسم', val: player.name}, {label: 'تاريخ الميلاد والسن', val: player.birth}, {label: 'القدم المفضلة', val: player.preferredFoot || 'يمنى'}, {label: 'الطول والوزن', val: player.heightWeight || '150 سم / 45 كجم'}, {label: 'المركز الأساسي', val: player.pos}, {label: 'المركز البديل', val: player.altPos || 'جناح أيمن'}] },
            { title: 'ثانياً: الجانب السلوكي والالتزام', fields: [{label: 'الالتزام بالمواعيد', val: formatVal(player.eval.commitment)}, {label: 'احترام المدرب والزملاء', val: formatVal(player.eval.respect)}, {label: 'الشغف للتطور', val: formatVal(player.eval.passion)}] },
            { title: 'ثالثاً: النقاط الدفاعية', fields: [{label: 'الضغط والافكاك (Tackling)', val: formatVal(player.eval.tackling)}, {label: 'التمركز الدفاعي (Positioning)', val: formatVal(player.eval.positioning)}, {label: 'قراءة اللعب (Interceptions)', val: formatVal(player.eval.interceptions)}, {label: 'السلامة في التشتيت (Clearing)', val: formatVal(player.eval.clearing)}] },
            { title: 'رابعاً: السرعة والجانب البدني', fields: [{label: 'السرعة الانفجارية', val: formatVal(player.eval.explosive)}, {label: 'السرعة بالكرة', val: formatVal(player.eval.ballspeed)}, {label: 'سرعة الارتداد (Recovery)', val: formatVal(player.eval.recovery)}, {label: 'التحمل السريع', val: formatVal(player.eval.stamina)}] },
            { title: 'خامساً: المراوغة واللعب الفردي', fields: [{label: 'نجاح المواجهات (1v1)', val: formatVal(player.eval.onevone)}, {label: 'التوظيف التكتيكي', val: formatVal(player.eval.dribbletac)}, {label: 'كسب الأخطاء الذكية', val: formatVal(player.eval.smartsf)}, {label: 'حماية الكرة (Shielding)', val: formatVal(player.eval.shield)}] },
            { title: 'سادساً: التسديد وإنهاء الهجمات', fields: [{label: 'جودة اختيار التسديد', val: formatVal(player.eval.shotchoice)}, {label: 'دقة وقوة التسديد', val: formatVal(player.eval.shotacc)}, {label: 'استخدام القدم الضعيفة', val: formatVal(player.eval.weakfoot)}, {label: 'الإنهاء في الانفرادات', val: formatVal(player.eval.finishing)}] },
            { title: 'سابعاً: التمرير والوعي التكتيكي', fields: [{label: 'التمريرات الكاسرة', val: formatVal(player.eval.breakingpass)}, {label: 'كفاءة اللمسة الأولى', val: formatVal(player.eval.firsttouch)}, {label: 'مسح الملعب (Scanning)', val: formatVal(player.eval.scanning)}, {label: 'محفزات الضغط', val: formatVal(player.eval.pressingtrig)}] },
            { title: 'ثامناً: الخلاصة والتوصيات النهائية للجهاز الفني', fields: [{label: 'حضور الدورة الشهرية', val: `الدورة رقم ${player.monthCycle || 1}`}, {label: 'القرار النهائي', val: player.eval.finalDecision}] }
        ];
    } else {
        sections = [
            { title: 'البيانات الأساسية للاعب', fields: [
                {label: 'الاسم', val: player.name},
                {label: 'السن وتاريخ الميلاد', val: player.birth},
                {label: 'المركز الأساسي', val: player.pos},
                {label: 'المركز البديل', val: player.altPos || 'جناح أيمن'},
                {label: 'الطول والوزن', val: player.heightWeight || '150 سم / 45 كجم'},
                {label: 'القدم المفضلة', val: player.preferredFoot || 'يمنى'}
            ]}
        ];
    }

    sections.forEach(sec => {
        html += `<div class="eval-section"><h4>${sec.title}</h4>`;
        sec.fields.forEach(f => {
            html += `<div class="eval-row"><span>${f.label}:</span><span style="font-weight:bold; color:var(--accent);">${f.val}</span></div>`;
        });
        html += `</div>`;
    });
    html += `</div>`;
    modalBody.innerHTML = html;
    document.getElementById('player-modal').classList.add('active');
}

function deletePlayerPermanently(playerId) {
    if(!isStaffLoggedIn) { alert('هذا الإجراء متاح للمدربين فقط'); return; }
    if(!confirm('هل أنت متأكد من رغبتك في حذف هذا اللاعب نهائياً من النادي؟ لا يمكن التراجع عن هذا الإجراء.')) return;

    let foundGroupKey = '';
    for(let g in playersData) {
        let index = playersData[g].findIndex(p => p.id === playerId);
        if(index !== -1) {
            playersData[g].splice(index, 1);
            foundGroupKey = g;
            break;
        }
    }

    closePlayerModal();
    saveDataToCloud('playersData', playersData);
    alert('تم حذف اللاعب نهائياً من سجلات النادي وحفظ التغييرات في السحابة.');
    if(foundGroupKey) {
        renderPlayersCards(foundGroupKey);
    }
    if(document.getElementById('coach-dashboard-modal').classList.contains('active')) {
        renderCoachDashboardData();
    }
}

function addPlayerWarning(playerId) {
    let player = null;
    for (let g in playersData) {
        const found = playersData[g].find(p => p.id === playerId);
        if (found) player = found;
    }
    if(!player) return;
    const text = document.getElementById('new-warning-input').value.trim();
    if(!text) { alert('اكتب نص الإنذار أولاً'); return; }

    const now = new Date();
    const dateStr = `${now.toLocaleDateString('ar-EG')} - ${now.toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}`;
    
    if(!player.warnings) player.warnings = [];
    player.warnings.push({ text: text, date: dateStr });
    document.getElementById('new-warning-input').value = '';
    
    saveDataToCloud('playersData', playersData);
    alert('تم إرسال الإنذار وتوثيقه وحفظه في السحابة بنجاح!');
    renderPlayerDetailsModal(player, true, false);
}

function resetPlayerStats(playerId) {
    let player = null;
    for (let g in playersData) {
        const found = playersData[g].find(p => p.id === playerId);
        if (found) player = found;
    }
    if(!player) return;
    ['commitment','respect','passion','tackling','positioning','interceptions','clearing','explosive','ballspeed','recovery','stamina','onevone','dribbletac','smartsf','shield','shotchoice','shotacc','weakfoot','finishing','breakingpass','firsttouch','scanning','pressingtrig'].forEach(k => {
        player.eval[k] = '-';
    });
    saveDataToCloud('playersData', playersData);
    alert('تم تصفير التقييمات وحفظ التغييرات في السحابة!');
    renderPlayerDetailsModal(player, true, false);
}

function savePlayerEdits(playerId) {
    let player = null;
    for (let g in playersData) {
        const found = playersData[g].find(p => p.id === playerId);
        if (found) player = found;
    }
    if(!player) return;
    player.name = document.getElementById('edit-p-name').value.trim();
    player.birth = document.getElementById('edit-p-birth').value.trim();
    player.preferredFoot = document.getElementById('edit-p-foot').value.trim();
    player.heightWeight = document.getElementById('edit-p-hw').value.trim();
    player.pos = document.getElementById('edit-p-pos').value.trim();
    player.altPos = document.getElementById('edit-p-altpos').value.trim();
    player.status = document.getElementById('edit-p-status').value;
    
    ['commitment','respect','passion','tackling','positioning','interceptions','clearing','explosive','ballspeed','recovery','stamina','onevone','dribbletac','smartsf','shield','shotchoice','shotacc','weakfoot','finishing','breakingpass','firsttouch','scanning','pressingtrig'].forEach(k => {
        let val = document.getElementById(`edit-${k}`).value;
        player.eval[k] = val === '-' ? '-' : parseInt(val);
    });
    player.eval.finalDecision = document.getElementById('edit-decision').value.trim();

    saveDataToCloud('playersData', playersData);
    alert('تم تحديث استمارة التقييم وحفظها في فايربيز بنجاح!');
    renderPlayerDetailsModal(player, true, false);
    if(currentGroupKey) renderPlayersCards(currentGroupKey);
}

function triggerPhotoUpload() { document.getElementById('photo-upload-input').click(); }

function switchParentTab(tab) {
    if(tab === 'login') {
        document.getElementById('parent-login-form').style.display = 'block';
        document.getElementById('parent-register-form').style.display = 'none';
        document.getElementById('tab-login-btn').style.borderColor = 'var(--accent)';
        document.getElementById('tab-reg-btn').style.borderColor = 'var(--border)';
    } else {
        document.getElementById('parent-login-form').style.display = 'none';
        document.getElementById('parent-register-form').style.display = 'block';
        document.getElementById('tab-login-btn').style.borderColor = 'var(--border)';
        document.getElementById('tab-reg-btn').style.borderColor = 'var(--accent)';
    }
}

function triggerParentSonFlipAndDetails(playerId) {
    let foundPlayer = null;
    for (let g in playersData) {
        const match = playersData[g].find(p => p.id === playerId);
        if (match) foundPlayer = match;
    }
    if(!foundPlayer) return;
    renderPlayerDetailsModal(foundPlayer, true, false);
}

function openCoachDashboard() {
    if(!isStaffLoggedIn) { openLoginModal('coach'); return; }
    document.getElementById('staffDropdownMenu').classList.remove('active');
    renderCoachDashboardData();
    document.getElementById('coach-dashboard-modal').classList.add('active');
}
function closeCoachDashboard() { document.getElementById('coach-dashboard-modal').classList.remove('active'); }

function switchCoachTab(tab) {
    document.getElementById('coachTabMgmtContent').style.display = tab === 'mgmt' ? 'block' : 'none';
    document.getElementById('coachTabAcademyContent').style.display = tab === 'academy' ? 'block' : 'none';
    document.getElementById('coachTabNotesContent').style.display = tab === 'notes' ? 'block' : 'none';
    document.getElementById('coachTabNewsContent').style.display = tab === 'news' ? 'block' : 'none';

    document.getElementById('tabMgmt').style.borderColor = tab === 'mgmt' ? 'var(--accent)' : 'var(--border)';
    document.getElementById('tabAcademy').style.borderColor = tab === 'academy' ? 'var(--accent)' : 'var(--border)';
    document.getElementById('tabNotes').style.borderColor = tab === 'notes' ? 'var(--accent)' : 'var(--border)';
    document.getElementById('tabNews').style.borderColor = tab === 'news' ? 'var(--accent)' : 'var(--border)';

    if(tab === 'news') {
        renderCoachDashboardNewsList();
    }
}

function renderCoachDashboardData() {
    const reqContainer = document.getElementById('parentRequestsContainer');
    if(pendingParentRequests.length === 0) {
        reqContainer.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem;">لا توجد طلبات معلقة حالياً.</p>`;
    } else {
        reqContainer.innerHTML = '';
        pendingParentRequests.forEach((req, idx) => {
            reqContainer.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:var(--card-bg); padding:10px; border-radius:8px; margin-bottom:8px;">
                    <div> ولي الأمر: <b>${req.parentName}</b> | الابن: <b>${req.sonName}</b></div>
                    <button class="btn-primary-custom" style="padding:5px 15px; font-size:0.85rem;" onclick="approveParentRequest(${idx})">موافقة وتفعيل</button>
                </div>
            `;
        });
    }

    const dbView = document.getElementById('academyGlobalDatabaseView');
    dbView.innerHTML = '';
    for(let g in playersData) {
        playersData[g].forEach(p => {
            dbView.innerHTML += `
                <div style="background:var(--card-bg); border:2px solid var(--accent); border-radius:12px; padding:15px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; gap:15px; align-items:center;">
                        <img src="${p.img}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid var(--accent); background:#112233;" alt="Player Dash">
                        <div><h4 style="color:var(--text);">${p.name} (${g})</h4><p style="color:var(--text-muted); font-size:0.85rem;">المركز: ${p.pos}</p></div>
                    </div>
                    <button class="ctrl-btn" onclick="triggerCinematicFlipAndProfile(${p.id})">تعديل الاستمارة الاحترافية</button>
                </div>
            `;
        });
    }
    renderCoachNotebookList();
}

async function approveParentRequest(idx) {
    const req = pendingParentRequests[idx];
    parentsAccounts[req.sonName.toLowerCase()] = { parentName: req.parentName, pass: req.pass, avatar: req.avatar, sonObj: req.sonObj };
    
    pendingParentRequests.splice(idx, 1);
    
    await saveDataToCloud('parentsAccounts', parentsAccounts);
    await saveDataToCloud('pendingParentRequests', pendingParentRequests);

    await addSystemNotification(`تمت الموافقة على حساب ولي الأمر لـ (${req.parentName}).`, 'parent');

    alert('تم اعتماد ولي الأمر وحفظ الحساب في السحابة!');
    renderCoachDashboardData();
}

function updatePotmSettingsDevice() {
    const name = document.getElementById('admin-potm-name').value.trim();
    if(name) playerOfTheMonth.name = name;
    updatePotmUI();
    saveDataToCloud('playerOfTheMonth', playerOfTheMonth);
    alert('تم تحديث لاعب الشهر وحفظه في السحابة بنجاح!');
}

function updatePotmUI() {
    document.getElementById('homePotmImg').src = playerOfTheMonth.img;
    document.getElementById('homePotmName').innerText = playerOfTheMonth.name || '--';
}

function updatePotwSettingsDevice() {
    const name = document.getElementById('admin-potw-name').value.trim();
    if(name) playerOfTheWeek.name = name;
    updatePotwUI();
    saveDataToCloud('playerOfTheWeek', playerOfTheWeek);
    alert('تم تحديث لاعب الأسبوع وحفظه في السحابة بنجاح!');
}

function updatePotwUI() {
    document.getElementById('homePotwImg').src = playerOfTheWeek.img;
    document.getElementById('homePotwName').innerText = playerOfTheWeek.name || '--';
}

function loadLegendMonthData() {
    const monthIdx = document.getElementById('admin-legend-month-select').value;
    const legend = academyLegendsData[monthIdx];
    if(legend) document.getElementById('admin-legend-name').value = legend.nameAr;
}

function saveAcademyLegendEditDevice() {
    const monthIdx = document.getElementById('admin-legend-month-select').value;
    const newName = document.getElementById('admin-legend-name').value.trim();
    if(academyLegendsData[monthIdx]) {
        if(newName) {
            academyLegendsData[monthIdx].nameAr = newName;
            academyLegendsData[monthIdx].nameEn = newName;
            academyLegendsData[monthIdx].nameKa = newName;
        }
        renderAcademyLegends();
        saveDataToCloud('academyLegendsData', academyLegendsData);
        alert('تم حفظ بطاقة POTM الشهرية وحفظها في السحابة بنجاح!');
    }
}

function renderAcademyLegends() {
    const grid = document.getElementById('academy-legends-grid');
    if(!grid) return;
    grid.innerHTML = '';
    academyLegendsData.forEach((legend) => {
        let displayName = legend.nameAr || 'غير محدد بعد';
        grid.innerHTML += `
            <div class="player-card" style="border: 2px solid var(--accent); position:relative;">
                <span style="position:absolute; top:12px; left:12px; background:rgba(59,130,246,0.2); border:1px solid var(--accent); color:var(--accent); font-size:0.75rem; padding:3px 8px; border-radius:10px; font-weight:bold;">${legend.monthLabel}</span>
                <div class="royal-ring-frame" style="margin: 15px auto 10px auto;">
                    <img src="${legend.img}" alt="${displayName}">
                </div>
                <h3 style="color:var(--text);">${displayName}</h3>
                <p style="color:var(--accent); font-weight:bold; margin-top:5px;">أسطورة POTM</p>
            </div>
        `;
    });
}

function addNewPlayerByStaffDevice() {
    const name = document.getElementById('new-p-name').value.trim();
    const pass = document.getElementById('new-p-pass').value.trim();
    const group = document.getElementById('new-p-group').value;
    const imgUrl = window.tempNewPlayerCroppedImg || '';
    if(!name || !pass) { alert('أدخل اسم وباسورد اللاعب'); return; }

    const newPlayerObj = {
        id: Date.now(),
        name: name,
        pass: pass,
        birth: '2012 / 14 سنة',
        preferredFoot: 'يمنى',
        heightWeight: '150 سم / 45 كجم',
        pos: 'خط وسط',
        altPos: 'جناح أيمن',
        img: imgUrl,
        sessions: 8,
        status: 'Paid',
        warnings: [],
        monthCycle: 1,
        schedule: generateAutomaticSchedule(8),
        eval: { commitment: '-', respect: '-', passion: '-', tackling: '-', positioning: '-', interceptions: '-', clearing: '-', explosive: '-', ballspeed: '-', recovery: '-', stamina: '-', onevone: '-', dribbletac: '-', smartsf: '-', shield: '-', shotchoice: '-', shotacc: '-', weakfoot: '-', finishing: '-', breakingpass: '-', firsttouch: '-', scanning: '-', pressingtrig: '-', finalDecision: 'تحت المتابعة' }
    };
    playersData[group].push(newPlayerObj);
    window.tempNewPlayerCroppedImg = '';
    
    saveDataToCloud('playersData', playersData);
    alert('تم إنشاء بروفايل اللاعب وحفظه في فايربيز بنجاح!');
    closeCoachDashboard();
    if(currentGroupKey === group) renderPlayersCards(group);
}

function openCoachBio(coachKey) {
    const currentLang = document.documentElement.getAttribute('lang') || 'ar';
    let bioData = coachesBios[currentLang]?.[coachKey] || coachesBios.ar[coachKey];
    let imgUrl = staffCredentials[coachKey]?.img || '';

    document.getElementById('coach-bio-name').innerText = bioData.name;
    document.getElementById('coach-bio-role').innerText = bioData.role;
    document.getElementById('coach-bio-desc').innerText = bioData.desc;
    document.getElementById('coach-bio-img').src = imgUrl;

    targetCoachForDirectMsg = bioData.name;
    if(loggedInUserType === 'player' || loggedInUserType === 'parent') {
        document.getElementById('coach-messaging-box').style.display = 'block';
    } else {
        document.getElementById('coach-messaging-box').style.display = 'none';
    }
    document.getElementById('coach-bio-modal').classList.add('active');
}
function closeCoachBio() { document.getElementById('coach-bio-modal').classList.remove('active'); }

async function sendDirectMessageToCoach() {
    const msg = document.getElementById('directCoachMsgInput').value.trim();
    if(!msg) { alert('اكتب الرسالة أولاً'); return; }
    let senderName = loggedInUserType === 'player' ? currentLoggedInPlayer.name : currentLoggedInParentObj.name;
    let senderTypeLabel = loggedInUserType === 'player' ? 'اللاعب' : 'ولي أمر اللاعب';
    await addSystemNotification(`رسالة جديدة للمدرب (${targetCoachForDirectMsg}) من ${senderTypeLabel}: (${senderName}). النص: ${msg}`, 'coach');
    alert('تم إرسال رسالتك للمدرب كإشعار فوري بنجاح!');
    document.getElementById('directCoachMsgInput').value = '';
    closeCoachBio();
}

function renderArtisticGallery() {
    const galleryContainer = document.getElementById('artistic-gallery-container');
    if(!galleryContainer) return;
    galleryContainer.innerHTML = '';
    artisticGalleryImages.forEach((item) => {
        galleryContainer.innerHTML += `
            <div class="art-slot ${item.span}" onclick="triggerGallerySlotUpload(${item.id})" title="انقر لتكبير الصورة أو تعديلها">
                <img id="gallery-img-${item.id}" src="${item.url}" alt="Gallery Slot ${item.id}">
            </div>
        `;
    });
}

function triggerGallerySlotUpload(slotId) {
    let found = artisticGalleryImages.find(img => img.id === slotId);
    if(isStaffLoggedIn && loggedInStaffKey === 'medany') {
        currentGallerySlotId = slotId;
        document.getElementById('gallery-slot-upload-input').click();
    } else {
        if(found && found.url) {
            openLightbox(found.url);
        } else {
            alert('هذه الخانة فارغة حالياً.');
        }
    }
}

function openLightbox(imgUrl) {
    document.getElementById('lightbox-img').src = imgUrl;
    document.getElementById('lightbox-modal').classList.add('active');
}
function closeLightbox() {
    document.getElementById('lightbox-modal').classList.remove('active');
}
