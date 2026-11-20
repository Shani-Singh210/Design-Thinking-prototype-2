
function searchCampus() {
    const input = document.getElementById("homeSearch");
    const query = input.value.trim();
    if (!query) {
        alert("Please enter a campus location.");
        return;
    }
    localStorage.setItem("campusSearch", query);
    window.location.href = "pages/search.html";
}

const locations = [
    { name: "Central Library", icon: "📚", category: "Study" },
    { name: "Academic Blocks", icon: "🏫", category: "Education" },
    { name: "Hostels", icon: "🏠", category: "Stay" },
    { name: "Uni-Hospital", icon: "🏥", category: "Health" },
    { name: "Food Courts", icon: "🍽️", category: "Food" },
    { name: "Sports Facilities", icon: "🏟️", category: "Sports" }
];

function findLocation() {
    const input = document.getElementById("locationSearch");
    const results = document.getElementById("searchResults");
    if (!input || !results) return;

    const query = input.value.trim().toLowerCase();
    results.innerHTML = "";

    const found = locations.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    if (!query || found.length === 0) {
        results.innerHTML = "<p>No matching location found. Try another search.</p>";
        return;
    }

    found.forEach(p => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `<div class="card-icon">${p.icon}</div>
      <h3>${p.name}</h3><p>${p.category}</p>`;
        results.appendChild(card);
    });
}

function getDirections() {
    const input = document.getElementById("destination");
    const message = document.getElementById("routeMessage");
    if (!input || !message) return;

    const destination = input.value.trim();
    if (!destination) {
        message.textContent = "Please enter a destination.";
        return;
    }

    message.textContent = "Selected destination: " + destination;
    localStorage.setItem("campusDestination", destination);

    const url = "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(destination + ", Lovely Professional University, Phagwara, Punjab");
    window.open(url, "_blank");
}

function showMyLocation() {
    const message = document.getElementById("mapMessage");
    if (!message) return;

    if (!navigator.geolocation) {
        message.textContent = "Location is not supported by this browser.";
        return;
    }

    message.textContent = "Requesting location permission...";

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            message.textContent = "Your location: " + lat.toFixed(5) + ", " + lon.toFixed(5);
            if (window.campusMap) {
                window.campusMap.setView([lat, lon], 17);
                if (window.userMarker) window.userMarker.setLatLng([lat, lon]);
                else window.userMarker = L.marker([lat, lon]).addTo(window.campusMap).bindPopup("Your current location").openPopup();
            }
        },
        () => {
            message.textContent = "Location permission denied or location unavailable.";
        },
        { enableHighAccuracy: true, timeout: 15000 }
    );
}

// Initialize map only on the Campus Map page
const mapElement = document.getElementById("campusMap");
if (mapElement && typeof L !== "undefined") {
    const campus = [31.25492, 75.70462];
    window.campusMap = L.map("campusMap").setView(campus, 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(window.campusMap);

    L.marker(campus).addTo(window.campusMap)
        .bindPopup("LPU campus reference point")
        .openPopup();
}
