const srnInput = document.getElementById("srn-inp");
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    const srnRegex = /^pes[12]ug(20|21|22|23)(cs|am|ec)(00[1-9]|0[1-9][0-9]|[1-6][0-9][0-9]|700)$/i;
    const prnRegex = /PES[12](2022|2023|2024)\d{5}/i;


    if (!srnRegex.test(srnInput.value) || !prnRegex.test(srnInput.value)) {
        e.preventDefault();
        alert("Please enter a valid SRN");
    }
})
