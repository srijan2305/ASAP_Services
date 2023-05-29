const form = document.querySelector("form");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const addressInput = document.getElementById("address");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const date = dateInput.value;
  const time = timeInput.value;
  const address = addressInput.value;

  // Validate input fields
  if (date === "?" || time === "?" || address === "?") {
    alert("YOUR BOOKING IS CONFIRMED");
    return;
  }

  // Process form data
  console.log("Date:", date);
  console.log("Time:", time);
  console.log("Address:", address);

  // Clear form
  form.reset();

  let navLinks = document.getElementById("navLinks");
  function showMenu() {
    navLinks.style.right = "0";
  }
  function hideMenu() {
    navLinks.style.right = "-200px";
  }
});
