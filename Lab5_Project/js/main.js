/* Author: Munisaxon Yusupaliyeva | CSIT248 Lab Work 5 | Registan Travel */
// ===== Registan Travel: booking page logic (Part B) =====

// Tour data: the keys match the <option value="..."> in booking.html
const TOURS =
{
    tashkent:  { name: "Old Tashkent Walk",     price: 35 },
    samarkand: { name: "Registan & Gur-e-Amir", price: 120 },
    khiva:     { name: "Khiva Itchan Kala",     price: 210 }
};
const DISCOUNT_FROM = 5;     // groups of 5 or more
const DISCOUNT_RATE = 0.10;  // 10% off

const form = document.getElementById("booking-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const tourSelect = document.getElementById("tour");
const travellersInput = document.getElementById("travellers");
const dateInput = document.getElementById("date");
const totalBox = document.getElementById("total");
const messageBox = document.getElementById("message");

// Number without useless decimals: 540 or 539.5
function fmt(n)
{
    return String(Number(n.toFixed(2)));
}

// Returns the price details, or null if the number of travellers is not valid
function calculate()
{
    const people = Number(travellersInput.value);
    if (!Number.isInteger(people) || people < 1 || people > 12)
    {
        return null;
    }
    const tour = TOURS[tourSelect.value];
    const subtotal = people * tour.price;
    const hasDiscount = people >= DISCOUNT_FROM;
    const total = hasDiscount ? subtotal * (1 - DISCOUNT_RATE) : subtotal;
    return { tour, people, subtotal, hasDiscount, total };
}

// Text like "Total: 3 × 120 USD = 360 USD"
function totalText(c)
{
    let text = "Total: " + c.people + " × " + c.tour.price + " USD = " + fmt(c.subtotal) + " USD";
    if (c.hasDiscount)
    {
        text += " − 10% group discount = " + fmt(c.total) + " USD";
    }
    return text;
}

// Live price: runs every time the tour or the number of travellers changes
function updateTotal()
{
    const c = calculate();
    totalBox.textContent = c ? totalText(c) : "Total: enter 1 to 12 travellers";
}

tourSelect.addEventListener("change", updateTotal);
travellersInput.addEventListener("input", updateTotal);
travellersInput.addEventListener("change", updateTotal);

// Helpers for errors
function showError(input, text)
{
    input.classList.add("invalid");
    document.getElementById(input.id + "-error").textContent = text;
}

function clearErrors()
{
    [nameInput, emailInput, travellersInput].forEach(function (input)
    {
        input.classList.remove("invalid");
        document.getElementById(input.id + "-error").textContent = "";
    });
    messageBox.textContent = "";
    messageBox.className = "";
}

// Validation on submit (no page reload)
form.addEventListener("submit", function (event)
{
    event.preventDefault();   // stop the page reload
    clearErrors();

    let valid = true;
    if (nameInput.value.trim() === "")
    {
        showError(nameInput, "Please enter your name.");
        valid = false;
    }
    if (!emailInput.value.includes("@"))
    {
        showError(emailInput, "Email must contain @.");
        valid = false;
    }
    const c = calculate();
    if (!c)
    {
        showError(travellersInput, "Choose between 1 and 12 travellers.");
        valid = false;
    }

    if (!valid)
    {
        messageBox.className = "error";
        messageBox.textContent = "Please fix the highlighted fields.";
        return;
    }

    messageBox.className = "success";
    // textContent (not innerHTML) so the typed name cannot inject HTML
    messageBox.textContent = "Thank you, " + nameInput.value.trim() +
        "! Your request for " + c.tour.name + " is received. " + totalText(c) + ".";
});

// Start: show the price at once, and block past dates in the date picker
dateInput.min = new Date().toISOString().split("T")[0];
updateTotal();
