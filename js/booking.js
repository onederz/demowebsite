// Hotel data and booking URLs
const hotelData = {
    "siem-reap": {
        name: "Onederz Siem Reap",
        image: "../../mobile-image/go-to-siemreap-square.webp",
        description: "Awarded as the '2nd best large hostel in the world' by HostelWorld, our Siem Reap hostel is just a 4-minute walk from Pub Street. We offer three swimming pools, a cozy cafe and bar, and a large common area to meet fellow travelers.",
        features: [
            "<i class='fas fa-wifi'></i> Free High-Speed WiFi",
            "<i class='fas fa-swimming-pool'></i> 4 Swimming Pools (including a rooftop pool)",
            "<i class='fas fa-utensils'></i> Restaurant & Bar",
            "<i class='fas fa-car'></i> Tour & Travel Desk",
            "<i class='fas fa-walking'></i> 4-minute walk to Pub Street"
        ]
    },
    "phnom-penh": {
        name: "Onederz Phnom Penh",
        image: "../../mobile-image/go-to-phnom-penh-square.webp",
        description: "Located right on the riverside, our hostel features a stunning rooftop infinity pool with amazing views of the Mekong River. Enjoy great dining at our rooftop restaurant and easily walk to countless restaurants and bars.",
        features: [
            "<i class='fas fa-wifi'></i> Free High-Speed WiFi",
            "<i class='fas fa-swimming-pool'></i> Rooftop Infinity Pool",
            "<i class='fas fa-utensils'></i> Rooftop Restaurant & Bar",
            "<i class='fas fa-map-marker-alt'></i> Central Riverside Location",
            "<i class='fas fa-car'></i> Tour & Travel Desk"
        ]
    },
    "kampot": {
        name: "Onederz Kampot",
        image: "../../mobile-image/go-to-kampot-square.webp",
        description: "Our newest hostel features a massive infinity pool surrounded by a beautiful garden. The perfect place to relax, meet fellow travelers, and enjoy delicious food and drinks at our poolside restaurant.",
        features: [
            "<i class='fas fa-wifi'></i> Free High-Speed WiFi",
            "<i class='fas fa-swimming-pool'></i> Large Infinity Pool",
            "<i class='fas fa-utensils'></i> Poolside Restaurant & Bar",
            "<i class='fas fa-bicycle'></i> Bicycle Rental",
            "<i class='fas fa-car'></i> On-site Parking"
        ]
    },
    "sihanoukville": {
        name: "Onederz Sihanoukville",
        image: "../../mobile-image/IMG_3447.webp",
        description: "Nestled on a scenic hill with stunning ocean views, our hostel is a peaceful retreat just a 10-minute walk from the pier. The perfect spot to relax by the pool or enjoy drinks at our restaurant with a beautiful garden view.",
        features: [
            "<i class='fas fa-wifi'></i> Free High-Speed WiFi",
            "<i class='fas fa-swimming-pool'></i> Outdoor Pool Complex",
            "<i class='fas fa-utensils'></i> Restaurant & Bar",
            "<i class='fas fa-walking'></i> 10-minute walk to the pier",
            "<i class='fas fa-bus-alt'></i> Bus Ticket Services"
        ]
    },
    "koh-rong-sanloem": {
        name: "Onederz Koh Rong Sanloem",
        image: "../../mobile-image/go-to-koh-rong-sanloem-square.webp",
        description: "Our beachfront hostel is located on the pristine shores of Saracen Bay. Enjoy the vibrant island atmosphere, comfortable rooms, and a rooftop with stunning sea and mountain views.",
        features: [
            "<i class='fas fa-wifi'></i> Free WiFi",
            "<i class='fas fa-umbrella-beach'></i> Direct Beach Access",
            "<i class='fas fa-utensils'></i> Beachfront Restaurant & Bar",
            "<i class='fas fa-moon'></i> Movie Nights & Bonfires",
            "<i class='fas fa-bus-alt'></i> Bus Ticket Services"
        ]
    },
    "koh-rong": {
        name: "Onederz Koh Rong",
        image: "../../koh-rong/koh-rong-img/kohrong-top-page.webp",
        description: "Experience the famous Long Beach from our hostel, just a 3-minute walk from the pier. We offer a perfect balance of a vibrant atmosphere and a tranquil beach, with great food, friendly staff, and bioluminescent plankton tours.",
        features: [
            "<i class='fas fa-wifi'></i> Free WiFi",
            "<i class='fas fa-umbrella-beach'></i> Direct Beach Access",
            "<i class='fas fa-utensils'></i> Beachfront Restaurant & Bar",
            "<i class='fas fa-dice'></i> Pool & Table Tennis",
            "<i class='fas fa-bus-alt'></i> Tour & Bus Ticket Services"
        ]
    }
};

const propertyUrls = {
    'siem-reap': 'https://hotels.cloudbeds.com/en/reservation/rmVKYa/?currency=usd',
    'phnom-penh': 'https://hotels.cloudbeds.com/en/reservation/PeZXom?currency=usd',
    'kampot': 'https://hotels.cloudbeds.com/en/reservation/CFTvLu?currency=usd',
    'sihanoukville': 'https://hotels.cloudbeds.com/en/reservation/ZyjPPV?currency=usd',
    'koh-rong-sanloem': 'https://hotels.cloudbeds.com/en/reservation/VUxg0w?currency=usd',
    'koh-rong': 'https://hotels.cloudbeds.com/en/reservation/XS8E0S?currency=usd'
};

document.addEventListener('DOMContentLoaded', function() {
    // Desktop functionality (dropdown and book button)
    const dropdownHeader = document.querySelector('.dropdown-header');
    const dropdownOptions = document.querySelector('.dropdown-options');
    const desktopBookBtn = document.querySelector('.desktop-book-btn');

    // Hotel info elements
    const hotelImage = document.getElementById('hotel-image');
    const hotelName = document.getElementById('hotel-name');
    const hotelDescription = document.getElementById('hotel-description');
    const hotelFeatures = document.getElementById('hotel-features');
    const hotelInfoContainer = document.querySelector('.hotel-info');

    // Helper function to update hotel info on the page
    function updateHotelInfo(destination) {
        hotelInfoContainer.classList.add('fade-out');
        setTimeout(() => {
            const hotel = hotelData[destination];
            if (hotel) {
                hotelImage.src = hotel.image;
                hotelImage.alt = hotel.name;
                hotelName.textContent = hotel.name;
                hotelDescription.textContent = hotel.description;
                hotelFeatures.innerHTML = '';
                hotel.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.innerHTML = feature;
                    hotelFeatures.appendChild(li);
                });
            }
            hotelInfoContainer.classList.remove('fade-out');
        }, 300);
    }

    // Toggle dropdown
    dropdownHeader.addEventListener('click', function() {
        dropdownOptions.parentElement.classList.toggle('open');
    });

    // Select dropdown option and update hotel info
    document.querySelectorAll('.dropdown-options li').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.dropdown-options li').forEach(li => {
                li.classList.remove('selected');
            });
            this.classList.add('selected');
            const selectedValue = this.getAttribute('data-value');
            dropdownHeader.querySelector('.selected-text').textContent = this.textContent;
            dropdownOptions.parentElement.classList.remove('open');
            updateHotelInfo(selectedValue);
            
            // Set the value of the mobile select element for form submission
            document.getElementById('destination-mobile').value = selectedValue;

            checkFormValidity();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdownHeader.contains(e.target) && !dropdownOptions.contains(e.target)) {
            dropdownOptions.parentElement.classList.remove('open');
        }
    });

    // Desktop book button handler
    desktopBookBtn.addEventListener('click', function() {
    const selectedDestination = document.getElementById('destination-mobile').value;

    if (selectedDestination && propertyUrls[selectedDestination]) {
        // Get formatted check-in and check-out dates
        const checkin = checkinDate ? formatDateForUrl(checkinDate) : null;
        const checkout = checkoutDate ? formatDateForUrl(checkoutDate) : null;

        if (!checkin || !checkout) {
            alert('Please select both check-in and check-out dates.');
            return;
        }

        const finalUrl = `${propertyUrls[selectedDestination]}&checkin=${checkin}&checkout=${checkout}`;
        window.location.href = finalUrl;
    } else {
        alert('Please select a destination first.');
    }
});


    // --- Mobile Booking Pop-up and Form Logic ---
    const bookNowTriggers = document.querySelectorAll('.book-now-trigger');
    
    const bookingPopupContainer = document.getElementById('bookingPopupContainer');
    const bookingOverlay = document.getElementById('bookingOverlay');
    const mobileBackBtn = document.getElementById('mobileBackBtn');
    const destinationSelect = document.getElementById('destination-mobile');
    const dateInputMobile = document.getElementById('checkin-checkout-mobile');
    const submitBtnMobile = document.getElementById('submitBtnMobile');
    const searchFormMobile = document.getElementById('searchFormMobile');

    // Calendar elements
    const calendarContainerMobile = document.getElementById('calendarContainerMobile');
    const currentMonthDays = document.getElementById('calendar-current-days-mobile');
    const nextMonthDays = document.getElementById('calendar-next-days-mobile');
    const currentMonthTitle = document.getElementById('current-month-title-mobile');
    const nextMonthTitle = document.getElementById('next-month-title-mobile');
    const prevMonthBtn = document.getElementById('prev-month-mobile');
    const nextMonthBtn = document.getElementById('next-month-mobile');

    // Month/Year selector elements
    const monthYearSelector = document.querySelector('.month-year-selector');
    const monthSelect = document.querySelector('.month-select');
    const yearSelect = document.querySelector('.year-select');
    const confirmBtn = document.querySelector('.confirm-month-year');

    // Calendar state
    let currentDate = new Date();
    let checkinDate = null;
    let checkoutDate = null;
    let selectingCheckin = true;

    // Initial setup
    dateInputMobile.value = "";
    dateInputMobile.placeholder = "Select stay date ↓";
    submitBtnMobile.disabled = true;

    // Open/close popup functions
    function openPopup() {
        bookingPopupContainer.classList.add('is-active');
        bookingOverlay.classList.add('is-active');
        document.body.classList.add('no-scroll');
        document.documentElement.classList.add('no-scroll');
        renderCalendars();
    }

    function closePopup() {
        bookingPopupContainer.classList.remove('is-active');
        bookingOverlay.classList.remove('is-active');
        document.body.classList.remove('no-scroll');
        document.documentElement.classList.remove('no-scroll');
        // Hide calendar on close
        calendarContainerMobile.classList.add('is-hidden');
    }

    // Check form validity to enable/disable submit button
    function checkFormValidity() {
        const isDestinationSelected = destinationSelect.value !== "";
        const areDatesSelected = checkinDate !== null && checkoutDate !== null;
        submitBtnMobile.disabled = !(isDestinationSelected && areDatesSelected);
    }

    // Date parsing for URL formatting
    function formatDateForUrl(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Update date input field
    function updateDateInput() {
        if (checkinDate && checkoutDate) {
            const startStr = formatDate(checkinDate);
            const endStr = formatDate(checkoutDate);
            dateInputMobile.value = `${startStr}      |      ${endStr}`;
        }
    }

    // Format date for display
    function formatDate(date) {
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    }

    // Render calendars
    function renderCalendars() {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        renderCalendar(currentMonthDays, currentMonthTitle, currentYear, currentMonth);
        
        let nextMonth = currentMonth + 1;
        let nextYear = currentYear;
        if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
        }
        
        renderCalendar(nextMonthDays, nextMonthTitle, nextYear, nextMonth);
        updateNavButtons();
    }

    // Update navigation buttons
    function updateNavButtons() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const isCurrentMonth = currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth();
        
        prevMonthBtn.disabled = isCurrentMonth;
    }

    // Render single calendar month
    function renderCalendar(container, titleElement, year, month) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        titleElement.textContent = `${firstDay.toLocaleString('default', { month: 'short' })} ${year}`;
        container.innerHTML = '';
        
        for (let i = 0; i < startingDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day disabled';
            dayElement.textContent = '';
            container.appendChild(dayElement);
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(year, month, i);
            dayDate.setHours(0, 0, 0, 0);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = i;
            
            if (dayDate.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            }
            
            if (dayDate < today) {
                dayElement.classList.add('disabled');
            } else {
                if (checkinDate && dayDate.getTime() === checkinDate.getTime()) {
                    dayElement.classList.add('selected');
                } else if (checkoutDate && dayDate.getTime() === checkoutDate.getTime()) {
                    dayElement.classList.add('selected');
                } else if (checkinDate && checkoutDate && dayDate > checkinDate && dayDate < checkoutDate) {
                    dayElement.classList.add('in-range');
                }
                
                dayElement.addEventListener('click', function() {
                    selectDate(dayDate);
                });
            }
            container.appendChild(dayElement);
        }
    }

    // Select date
    function selectDate(date) {
        if (selectingCheckin) {
            checkinDate = date;
            checkoutDate = null;
            selectingCheckin = false;
            dateInputMobile.placeholder = "Select check-out date";
        } else {
            if (date > checkinDate) {
                checkoutDate = date;
                selectingCheckin = true;
                updateDateInput();
                // This is the key change to hide the calendar when dates are selected
                calendarContainerMobile.classList.add('is-hidden');
            } else {
                checkinDate = date;
                checkoutDate = null;
                dateInputMobile.placeholder = "Select check-out date";
            }
        }
        renderCalendars();
        checkFormValidity();
    }

    // Event Listeners
    bookNowTriggers.forEach(button => {
        button.addEventListener('click', openPopup);
    });

    bookingOverlay.addEventListener('click', closePopup);
    mobileBackBtn.addEventListener('click', closePopup);

    dateInputMobile.addEventListener('click', function (e) {
        e.stopPropagation();
        
        const isMobile = window.innerWidth < 1199;
        
        if (isMobile) {
            // Use classList.toggle for clean state management
            calendarContainerMobile.classList.toggle('is-hidden');
            renderCalendars();
        }
    });

    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendars();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendars();
    });

    // Month/Year Selector Logic
    function populateYearSelect() {
        const currentYear = new Date().getFullYear();
        yearSelect.innerHTML = '';
        for (let i = currentYear; i <= currentYear + 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === currentYear) {
                option.selected = true;
            }
            yearSelect.appendChild(option);
        }
    }

    function updateMonthSelect() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const selectedYear = parseInt(yearSelect.value);

        for (let i = 0; i < monthSelect.options.length; i++) {
            const option = monthSelect.options[i];
            const optionMonth = parseInt(option.value);

            if (selectedYear === currentYear && optionMonth < currentMonth) {
                option.disabled = true;
                option.style.display = 'none';
            } else {
                option.disabled = false;
                option.style.display = 'block';
            }
        }
        
        if (selectedYear === currentYear && parseInt(monthSelect.value) < currentMonth) {
            monthSelect.value = currentMonth;
        }
    }

    function toggleMonthYearSelector(titleElement, month, year) {
        if (monthYearSelector.style.display === 'flex') {
            monthYearSelector.style.display = 'none';
        } else {
            monthYearSelector.style.display = 'flex';
            monthSelect.value = month;
            yearSelect.value = year;
            updateMonthSelect();
        }
    }

    currentMonthTitle.addEventListener('click', function() {
        toggleMonthYearSelector(this, currentDate.getMonth(), currentDate.getFullYear());
    });

    nextMonthTitle.addEventListener('click', function() {
        let nextMonth = currentDate.getMonth() + 1;
        let nextYear = currentDate.getFullYear();
        if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
        }
        toggleMonthYearSelector(this, nextMonth, nextYear);
    });

    yearSelect.addEventListener('change', updateMonthSelect);

    confirmBtn.addEventListener('click', function() {
        const selectedMonth = parseInt(monthSelect.value);
        const selectedYear = parseInt(yearSelect.value);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
            currentDate = new Date(currentYear, currentMonth, 1);
            alert("You can't select a month that has already passed. Showing the current month instead.");
        } else {
            currentDate = new Date(selectedYear, selectedMonth, 1);
        }

        renderCalendars();
        monthYearSelector.style.display = 'none';
    });

    // Form Submission Logic
    searchFormMobile.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectedDestination = destinationSelect.value;
        const checkin = formatDateForUrl(checkinDate);
        const checkout = formatDateForUrl(checkoutDate);
        
        const bookingUrl = propertyUrls[selectedDestination];

        if (bookingUrl) {
            const finalUrl = `${bookingUrl}&checkin=${checkin}&checkout=${checkout}`;
            window.location.href = finalUrl;
        } else {
            alert('No booking link found for this destination.');
        }
    });

    // Initial function calls
    checkFormValidity();
    populateYearSelect();
    updateMonthSelect();
    
    // Add the class initially to ensure it's hidden on load
    calendarContainerMobile.classList.add('is-hidden');
});