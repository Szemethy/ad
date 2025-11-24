let zipData = [];

// JSON betöltése
async function loadZipData() {
    const response = await fetch("zipcodes.json");
    zipData = await response.json();
}

window.onload = loadZipData;


// AUTOCOMPLETE gépelés közben
document.getElementById("zipInput").addEventListener("input", function () {
    const value = this.value.toLowerCase();
    const suggestionBox = document.getElementById("suggestions");

    if (value.length === 0) {
        suggestionBox.style.display = "none";
        return;
    }

    const filtered = zipData.filter(entry =>
        entry.zipcode.startsWith(value) ||
        entry.city.toLowerCase().includes(value)
    );

    if (filtered.length === 0) {
        suggestionBox.style.display = "none";
        return;
    }

    suggestionBox.innerHTML = "";

    filtered.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.textContent = `${item.zipcode} – ${item.city}`;

        div.addEventListener("click", () => {

            // Ha nem számmal kezdett gépelni → város került az inputba
            if (isNaN(this.value[0])) {
                document.getElementById("zipInput").value = item.city;
            } else {
                document.getElementById("zipInput").value = item.zipcode;
            }

            suggestionBox.style.display = "none";
        });

        suggestionBox.appendChild(div);
    });

    suggestionBox.style.display = "block";
});


// 🔍 Keresés gomb
document.getElementById("searchBtn").addEventListener("click", () => {
    const input = document.getElementById("zipInput").value.trim();
    const resultEl = document.getElementById("result");

    if (!input) {
        resultEl.textContent = "Adj meg egy irányítószámot vagy várost!";
        return;
    }

    let found;
    let searchType; // "code" vagy "city"

    if (!isNaN(input)) {
        // Számmal keres → irányítószám
        found = zipData.find(entry => entry.zipcode === input);
        searchType = "code";
    } else {
        // Szöveggel keres → város
        found = zipData.find(entry => entry.city.toLowerCase() === input.toLowerCase());
        searchType = "city";
    }

    if (!found) {
        resultEl.textContent = "Nincs találat.";
        return;
    }

    // 🔥 Eredmény formázás
    if (searchType === "code") {
        resultEl.textContent = `${found.zipcode} – ${found.city}`;
    } else {
        resultEl.textContent = `${found.city} – ${found.zipcode}`;
    }
});
