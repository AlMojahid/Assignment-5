// Login Form Elements

const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("username");

const passwordInput = document.getElementById("password");

const loginError = document.getElementById("loginError");

// Admin Credentials

const ADMIN_USERNAME = "admin";

const ADMIN_PASSWORD = "admin123";

// Check Existing Login

const isLoggedIn = sessionStorage.getItem("isLoggedIn");

console.log("isLogedIn:", isLoggedIn);

if (isLoggedIn === "true") {
    window.location.replace("./issues.html");
}

// Login Form Submit

loginForm.addEventListener("submit", function (event) {

    // Prevent page reload

    event.preventDefault();

    // Get values

    const username = usernameInput.value.trim();

    const password = passwordInput.value;

    // Clear previous error

    loginError.textContent = "";

    // Empty Validation
    if (!username || !password) {

        loginError.textContent = "Please enter username and password.";

        return;
    }

    // Check Credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

        // Save login state
        sessionStorage.setItem("isLoggedIn", "true");

        // Redirect
        window.location.replace("./issues.html");

    } else {

        // Wrong credentials
        loginError.textContent = "Invalid username or password.";

    }

});