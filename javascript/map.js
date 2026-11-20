
const CAMPUS_CENTER = [31.25492, 75.70462];

const campusPlaces = [
    { name: "Main Gate (Gate 1 — NH-44)", category: "Admin", icon: "🚪", detail: "Main campus entrance.", search: "Main Gate Gate 1 NH44" },
    { name: "Uni-Mall (Block 15)", category: "Food", icon: "🛍️", detail: "Shopping and student convenience facilities.", search: "Uni Mall Block 15" },
    { name: "Shanti Devi Mittal Auditorium", category: "Admin", icon: "🎭", detail: "University auditorium.", search: "Shanti Devi Mittal Auditorium" },
    { name: "Block 32 — DSW & Admin", category: "Admin", icon: "🏛️", detail: "Administrative block label from your supplied map.", search: "Block 32 DSW Admin" },
    { name: "Uni-Hospital (Block 10)", category: "Medical", icon: "🏥", detail: "On-campus hospital.", search: "Uni Hospital Block 10" },
    { name: "Block 33", category: "Academic", icon: "🏫", detail: "Academic block.", search: "Block 33" },
    { name: "Block 34 — Computer Science (CSE)", category: "Academic", icon: "💻", detail: "Computer Science block label.", search: "Block 34 CSE" },
    { name: "Central Library (Block 37)", category: "Library", icon: "📚", detail: "Central Library — Block 37.", search: "Central Library Block 37" },
    { name: "Block 29 & 30", category: "Academic", icon: "🏢", detail: "Academic blocks.", search: "Block 29 Block 30" },
    { name: "Girls Hostels (GH 1–GH 4)", category: "Hostels", icon: "🏠", detail: "Girls hostel group.", search: "Girls Hostels GH1 GH4" },
    { name: "Girls Hostels (GH 5–GH 6)", category: "Hostels", icon: "🏠", detail: "Girls hostel group.", search: "Girls Hostels GH5 GH6" },
    { name: "Block 38", category: "Academic", icon: "🏢", detail: "Academic block.", search: "Block 38" },
    { name: "Central Food Court (Block 34/38)", category: "Food", icon: "🍽️", detail: "Central food court.", search: "Central Food Court Block 34 38" },
    { name: "Indoor Sports Complex & Grounds", category: "Sports", icon: "🏟️", detail: "Indoor sports and grounds.", search: "Indoor Sports Complex Grounds" },
    { name: "Boys Hostels (BH 1–BH 4)", category: "Hostels", icon: "🏠", detail: "Boys hostel group.", search: "Boys Hostels BH1 BH4" },
    { name: "Boys Hostels (BH 5–BH 8)", category: "Hostels", icon: "🏠", detail: "Boys hostel group.", search: "Boys Hostels BH5 BH8" },
    { name: "Blocks 55–57", category: "Academic", icon: "🏢", detail: "Academic block group.", search: "Blocks 55 56 57" },

    { name: "Google Lab", category: "Labs", icon: "🧪", detail: "Laboratory; exact building position needs verification.", search: "Google Lab LPU" },
    { name: "I-MAC Lab", category: "Labs", icon: "🧪", detail: "Laboratory; exact building position needs verification.", search: "I-MAC Lab LPU" },
    { name: "E-Cell Logic Room", category: "Labs", icon: "💡", detail: "Facility; exact building position needs verification.", search: "E-Cell Logic Room LPU" },
    { name: "Structural Analysis Lab", category: "Labs", icon: "🔬", detail: "Laboratory; exact building position needs verification.", search: "Structural Analysis Lab LPU" },
    { name: "Advanced Machining Lab", category: "Labs", icon: "⚙️", detail: "Laboratory; exact building position needs verification.", search: "Advanced Machining Lab LPU" },
    { name: "Central Instrumentation Facility", category: "Labs", icon: "🔬", detail: "Facility; exact building position needs verification.", search: "Central Instrumentation Facility LPU" },
    { name: "Innovation Studio", category: "Labs", icon: "💡", detail: "Facility; exact building position needs verification.", search: "Innovation Studio LPU" },
    { name: "Space Centre", category: "Labs", icon: "🚀", detail: "Facility; exact building position needs verification.", search: "Space Centre LPU" },

    { name: "Hostel Mess", category: "Food", icon: "🍴", detail: "Residential dining facility.", search: "Hostel Mess LPU" },
    { name: "Cafe Coffee Day", category: "Food", icon: "☕", detail: "Cafe outlet; exact position needs verification.", search: "Cafe Coffee Day LPU" },
    { name: "Lovely Sweets Outlet", category: "Food", icon: "🍰", detail: "Food outlet; exact position needs verification.", search: "Lovely Sweets LPU" },
    { name: "Uni-Polis", category: "Sports", icon: "🎟️", detail: "Campus facility; exact position needs verification.", search: "Uni Polis LPU" },
    { name: "Utility Centre", category: "Admin", icon: "🧾", detail: "Campus service facility.", search: "Utility Centre LPU" },
    { name: "Banking Services & ATMs", category: "Admin", icon: "🏧", detail: "Banking services and ATMs.", search: "Bank ATM LPU" }
];

let campusMap;
let userMarker;
let campusMarker;
let userCoordinates = null;
let selectedPlace = null;
let activeCategory = "All";
let isPickingOrigin = false;

function setStatus(message) {
    const el = document.getElementById("status");
    if (el) el.textContent = message;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[ch]);
}

function renderPlaces(searchText = "") {
    const list = document.getElementById("placeResults");
    const count = document.getElementById("resultCount");
    if (!list) return;

    const query = searchText.toLowerCase().trim();

    const matches = campusPlaces.filter(place => {
        const categoryMatch =
            activeCategory === "All" || place.category === activeCategory;

        const textMatch =
            !query ||
            `${place.name} ${place.category} ${place.detail} ${place.search}`
                .toLowerCase().includes(query);

        return categoryMatch && textMatch;
    });

    list.innerHTML = "";
    count.textContent = `${matches.length} places`;

    if (!matches.length) {
        list.innerHTML =
            '<article class="place"><strong>No matching place found</strong><p>Try another name or block number.</p></article>';
        return;
    }

    matches.forEach(place => {
        const card = document.createElement("article");

        card.className =
            "place" +
            (selectedPlace?.name === place.name ? " selected" : "");

        card.innerHTML = `
      <div class="place-top">
        <div class="place-icon">${place.icon}</div>
        <div class="place-name">${escapeHTML(place.name)}</div>
        <span class="tag">${escapeHTML(place.category)}</span>
      </div>
      <p>${escapeHTML(place.detail)}</p>
    `;

        card.addEventListener("click", () => selectPlace(place));
        list.appendChild(card);
    });
}

function selectPlace(place) {
    selectedPlace = place;

    document.getElementById("destinationSearch").value = place.name;

    renderPlaces(place.name);

    setStatus(
        `${place.name} selected. Click Get Walking Directions to open route guidance.`
    );
}


function detectMyLocation() {
    if (!navigator.geolocation) {
        setStatus("Your browser does not support location services.");
        return;
    }

    setStatus("Detecting your current location...");

    navigator.geolocation.getCurrentPosition(
        position => {
            userCoordinates = [
                position.coords.latitude,
                position.coords.longitude
            ];

            document.getElementById("origin").value = "My GPS Location";

            if (userMarker) {
                userMarker.setLatLng(userCoordinates);
            } else {
                userMarker = L.marker(userCoordinates).addTo(campusMap);
            }

            userMarker.bindPopup("Your Current Location").openPopup();

            campusMap.setView(userCoordinates, 18);

            setStatus("GPS location selected successfully!");
        },
        error => {
            setStatus("Location unavailable. Choose a point on the map or enter a place manually.");
        },
        {
            enableHighAccuracy: true,
            timeout: 15000
        }
    );
}

function chooseOriginOnMap() {
    isPickingOrigin = true;

    setStatus("Now click on the map to select your starting location.");

    campusMap.getContainer().style.cursor = "crosshair";
}

function setManualOrigin(latlng) {
    userCoordinates = [
        latlng.lat,
        latlng.lng
    ];

    document.getElementById("origin").value =
        `Selected map location (${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)})`;

    if (userMarker) {
        userMarker.setLatLng(latlng);
    } else {
        userMarker = L.marker(latlng).addTo(campusMap);
    }

    userMarker.bindPopup("Your Selected Starting Point").openPopup();

    setStatus("Starting location selected! Now choose your destination.");

    isPickingOrigin = false;
    campusMap.getContainer().style.cursor = "";
}



function getWalkingDirections() {
    const originInput = document.getElementById("origin");
    const destinationInput = document.getElementById("destinationSearch");

    const originText = originInput.value.trim();
    const destinationText = destinationInput.value.trim();

    if (!originText) {
        setStatus("Please select your starting location.");
        return;
    }

    if (!destinationText) {
        setStatus("Please select your destination.");
        return;
    }

    const place = campusPlaces.find(
        p => p.name.toLowerCase() === destinationText.toLowerCase()
    );

    const destination = place ? place.search : destinationText;

    const destinationAddress =
        destination + ", Lovely Professional University, Phagwara, Punjab, India";

    let originAddress;

    if (userCoordinates) {
        originAddress =
            `${userCoordinates[0]},${userCoordinates[1]}`;
    } else {
        originAddress =
            originText + ", Lovely Professional University, Phagwara, Punjab, India";
    }

    const url =
        "https://www.google.com/maps/dir/?api=1" +
        "&origin=" + encodeURIComponent(originAddress) +
        "&destination=" + encodeURIComponent(destinationAddress) +
        "&travelmode=walking";

    setStatus("Opening walking directions. Verify your route before following it.");

    window.open(url, "_blank", "noopener");
}


function setMyBlock() {
    const previous = localStorage.getItem("lpuMyBlock") || "";

    const value = prompt(
        "Enter your hostel or academic block:",
        previous
    );

    if (value === null) return;

    const block = value.trim();

    if (!block) {
        setStatus("Please enter a valid block name.");
        return;
    }

    localStorage.setItem("lpuMyBlock", block);

    setStatus(`Your block "${block}" has been saved on this device.`);
}

function clearPlanner() {
    selectedPlace = null;

    document.getElementById("destinationSearch").value = "";

    renderPlaces();

    setStatus("Destination cleared. Select another place.");
}

function initializeCampusMap() {
    const mapElement = document.getElementById("campusMap");

    if (!mapElement || typeof L === "undefined") return;

    campusMap = L.map("campusMap").setView(CAMPUS_CENTER, 16);
    campusMap.on("click", function (event) {
        if (isPickingOrigin) {
            setManualOrigin(event.latlng);
        }
    });

    window.campusMap = campusMap;

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 20,
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(campusMap);

    campusMarker = L.marker(CAMPUS_CENTER)
        .addTo(campusMap)
        .bindPopup("LPU campus reference area");

    const datalist = document.getElementById("campusPlaces");

    campusPlaces.forEach(place => {
        const option = document.createElement("option");
        option.value = place.name;
        datalist.appendChild(option);
    });

    renderPlaces();

    document.getElementById("locateBtn")
        .addEventListener("click", detectMyLocation);

    document.getElementById("pickOriginBtn")
        .addEventListener("click", chooseOriginOnMap);

    document.getElementById("origin")
        .addEventListener("input", function () {
            userCoordinates = null;
            isPickingOrigin = false;

            if (userMarker) {
                campusMap.removeLayer(userMarker);
                userMarker = null;
            }

            setStatus("Manual starting point entered. It will be used for directions.");
        });


    document.getElementById("navigateBtn")
        .addEventListener("click", getWalkingDirections);

    document.getElementById("setBlockBtn")
        .addEventListener("click", setMyBlock);

    document.getElementById("clearBtn")
        .addEventListener("click", clearPlanner);

    document.getElementById("destinationSearch")
        .addEventListener("input", event => {
            renderPlaces(event.target.value);
        });

    document.getElementById("filters")
        .addEventListener("click", event => {
            const button = event.target.closest("[data-category]");
            if (!button) return;

            activeCategory = button.dataset.category;

            document.querySelectorAll(".chip").forEach(chip => {
                chip.classList.toggle("active", chip === button);
            });

            renderPlaces(
                document.getElementById("destinationSearch").value
            );
        });

    document.getElementById("themeBtn")
        .addEventListener("click", () => {
            document.body.classList.toggle("dark");

            const dark = document.body.classList.contains("dark");

            document.getElementById("themeBtn").textContent =
                dark ? "☀️ Day Mode" : "🌙 Night Mode";
        });

    document.getElementById("fullscreenBtn")
        .addEventListener("click", () => {
            const area = document.querySelector(".map-area");

            if (!document.fullscreenElement) {
                area.requestFullscreen?.();
            } else {
                document.exitFullscreen?.();
            }

            setTimeout(() => campusMap.invalidateSize(), 300);
        });

    document.getElementById("nearbyBtn")
        .addEventListener("click", () => {
            if (!userCoordinates) {
                setStatus("Click Locate first to find your current position.");
                return;
            }

            campusMap.setView(userCoordinates, 18);

            setStatus("Map centred on your current location.");
        });

    setStatus("Campus directory loaded. Select a destination to continue.");
}

document.addEventListener(
    "DOMContentLoaded",
    initializeCampusMap
);
