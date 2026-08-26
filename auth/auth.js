// Handles user authentication, registration, login sessions, and navbar state.
// localStorage keys used: tableCoUsers, tableCoCurrentUser, tableCoReturnUrl.

// --- Storage Helpers ---

// Reads all registered users from localStorage.
function getUsers() {
    var data = localStorage.getItem("tableCoUsers");
    return data ? JSON.parse(data) : [];
}

// Saves all registered users to localStorage.
function saveUsers(usersArray) {
    localStorage.setItem("tableCoUsers", JSON.stringify(usersArray));
}

// Reads the currently logged-in user from localStorage.
function getCurrentUser() {
    var data = localStorage.getItem("tableCoCurrentUser");
    return data ? JSON.parse(data) : null;
}

// Checks if a user is currently logged in.
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Logs out the current user by removing the session key.
function logoutUser() {
    localStorage.removeItem("tableCoCurrentUser");
}

// Saves session user data and redirects to return URL or homepage.
function completeAuthentication(userObject) {
    // Never store passwords in the active session
    var sessionUser = {
        id:    userObject.id,
        name:  userObject.name,
        email: userObject.email,
        phone: userObject.phone
    };
    localStorage.setItem("tableCoCurrentUser", JSON.stringify(sessionUser));

    // Redirect to checkout or stored return page if available
    var returnUrl = localStorage.getItem("tableCoReturnUrl");
    if (returnUrl) {
        localStorage.removeItem("tableCoReturnUrl");
        window.location.href = returnUrl;
    } else {
        window.location.href = "../index.html";
    }
}

// --- Form Validation Helpers ---

// Validates email format using regex.
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Displays an inline error message and highlights the input field.
function showError(errorId, message, inputId) {
    var errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message;

    var inputEl = document.getElementById(inputId);
    if (inputEl) inputEl.classList.add("input-error");
}

// Clears error message and removes input highlight for a field.
function clearError(errorId, inputId) {
    var errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = "";

    var inputEl = document.getElementById(inputId);
    if (inputEl) inputEl.classList.remove("input-error");
}

// Resets all error messages and highlights across the form.
function clearAllErrors() {
    document.querySelectorAll(".error-msg").forEach(function (span) { span.textContent = ""; });
    document.querySelectorAll(".input-error").forEach(function (el) { el.classList.remove("input-error"); });
    document.querySelectorAll(".form-error-global").forEach(function (el) {
        el.textContent = "";
        el.classList.remove("active");
    });
}

// Toggles password input visibility between hidden and text.
function togglePassword(inputId, buttonEl) {
    var inputEl = document.getElementById(inputId);
    if (!inputEl) return;

    if (inputEl.type === "password") {
        inputEl.type = "text";
        if (buttonEl) buttonEl.textContent = "Hide";
    } else {
        inputEl.type = "password";
        if (buttonEl) buttonEl.textContent = "Show";
    }
}

// --- User Registration ---

// Validates registration form inputs and creates a new user account.
function handleRegistration(event) {
    if (event) event.preventDefault();
    clearAllErrors();

    var name            = document.getElementById("register-name").value.trim();
    var email           = document.getElementById("register-email").value.trim();
    var phone           = document.getElementById("register-phone").value.trim();
    var password        = document.getElementById("register-password").value;
    var confirmPassword = document.getElementById("register-confirm-password").value;

    var isValid = true;

    // Validate all fields to display all inline errors simultaneously
    if (!name || name.length < 2) {
        showError("register-name-error", name ? "Full name must be at least 2 characters." : "Full name is required.", "register-name");
        isValid = false;
    }

    if (!email) {
        showError("register-email-error", "Email is required.", "register-email");
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError("register-email-error", "Please enter a valid email address.", "register-email");
        isValid = false;
    }

    if (!phone) {
        showError("register-phone-error", "Phone number is required.", "register-phone");
        isValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
        showError("register-phone-error", "Phone number must be exactly 10 digits.", "register-phone");
        isValid = false;
    }

    if (!password || password.length < 6) {
        showError("register-password-error", password ? "Password must be at least 6 characters." : "Password is required.", "register-password");
        isValid = false;
    }

    if (!confirmPassword) {
        showError("register-confirm-password-error", "Please confirm your password.", "register-confirm-password");
        isValid = false;
    } else if (password !== confirmPassword) {
        showError("register-confirm-password-error", "Passwords do not match.", "register-confirm-password");
        isValid = false;
    }

    if (!isValid) return;

    var users = getUsers();
    var emailTaken = users.some(function (u) { return u.email.toLowerCase() === email.toLowerCase(); });
    if (emailTaken) {
        showError("register-email-error", "An account with this email already exists.", "register-email");
        return;
    }

    var newUser = {
        id:       users.length > 0 ? users[users.length - 1].id + 1 : 1,
        name:     name,
        email:    email,
        phone:    phone,
        password: password
    };

    users.push(newUser);
    saveUsers(users);
    completeAuthentication(newUser);
}

// --- User Login ---

// Validates login credentials and starts a user session.
function handleLogin(event) {
    if (event) event.preventDefault();
    clearAllErrors();

    var email    = document.getElementById("login-email").value.trim();
    var password = document.getElementById("login-password").value;

    var isValid = true;

    if (!email) {
        showError("login-email-error", "Email is required.", "login-email");
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError("login-email-error", "Please enter a valid email address.", "login-email");
        isValid = false;
    }

    if (!password) {
        showError("login-password-error", "Password is required.", "login-password");
        isValid = false;
    }

    if (!isValid) return;

    var users = getUsers();
    var matchedUser = users.find(function (u) {
        return u.email.toLowerCase() === email.toLowerCase() && u.password === password;
    });

    if (!matchedUser) {
        showError("login-password-error", "Invalid email or password.", "login-password");
        var globalError = document.getElementById("login-global-error");
        if (globalError) {
            globalError.textContent = "Invalid email or password.";
            globalError.classList.add("active");
        }
        return;
    }

    completeAuthentication(matchedUser);
}

// --- Navbar Profile Controls ---

// Updates navbar to show user profile dropdown or log in button based on authentication status.
function updateAuthNavbar() {
    var authWrapper = document.getElementById("nav-auth-wrapper") || document.querySelector(".nav-login-wrapper");
    if (!authWrapper) return;

    // Subpages are one folder deep so they need "../" to reach auth/login.html
    var path = window.location.pathname;
    var isSubpage = path.includes("/menu/") || path.includes("/pizza-menu/") ||
                    path.includes("/coffee-menu/") || path.includes("/checkout/") ||
                    path.includes("/order-success/");
    var loginUrl = isSubpage ? "../auth/login.html" : "auth/login.html";

    var currentUser = getCurrentUser();

    if (currentUser) {
        authWrapper.innerHTML =
            '<div class="user-profile-menu" id="user-profile-menu">'
          +   '<button type="button" class="btn-profile-toggle" id="btn-profile-toggle" aria-expanded="false" aria-haspopup="true">'
          +     '<span class="user-icon">👤</span>'
          +     '<span class="user-name">' + currentUser.name + '</span>'
          +     '<span class="dropdown-arrow">▾</span>'
          +   '</button>'
          +   '<div class="profile-dropdown hidden" id="profile-dropdown">'
          +     '<div class="profile-header">'
          +       '<div class="profile-name">'  + currentUser.name  + '</div>'
          +       '<div class="profile-email">' + currentUser.email + '</div>'
          +     '</div>'
          +     '<div class="profile-divider"></div>'
          +     '<button type="button" class="btn-logout" id="btn-logout">Logout</button>'
          +   '</div>'
          + '</div>';

        var toggleBtn = document.getElementById("btn-profile-toggle");
        var dropdown  = document.getElementById("profile-dropdown");

        toggleBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            if (dropdown.classList.contains("hidden")) {
                dropdown.classList.remove("hidden");
                toggleBtn.setAttribute("aria-expanded", "true");
            } else {
                dropdown.classList.add("hidden");
                toggleBtn.setAttribute("aria-expanded", "false");
            }
        });

        document.getElementById("btn-logout").addEventListener("click", function (e) {
            e.stopPropagation();
            logoutUser();
            updateAuthNavbar();
        });

    } else {
        authWrapper.innerHTML = '<button type="button" class="btn-login" id="btn-login-nav">Log In</button>';
        document.getElementById("btn-login-nav").addEventListener("click", function () {
            window.location.href = loginUrl;
        });
    }
}

// Close profile dropdown when clicking outside
document.addEventListener("click", function (e) {
    var dropdown   = document.getElementById("profile-dropdown");
    var profileMenu = document.getElementById("user-profile-menu");
    if (dropdown && profileMenu && !profileMenu.contains(e.target)) {
        dropdown.classList.add("hidden");
        var toggleBtn = document.getElementById("btn-profile-toggle");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
    }
});

// Initialization of event listeners and form switching
document.addEventListener("DOMContentLoaded", function () {

    var loginSection    = document.getElementById("login-section");
    var registerSection = document.getElementById("register-section");
    var toRegisterBtn   = document.getElementById("switch-to-register");
    var toLoginBtn      = document.getElementById("switch-to-login");

    if (toRegisterBtn && loginSection && registerSection) {
        toRegisterBtn.addEventListener("click", function (e) {
            e.preventDefault();
            clearAllErrors();
            loginSection.classList.add("hidden");
            registerSection.classList.remove("hidden");
        });
    }

    if (toLoginBtn && loginSection && registerSection) {
        toLoginBtn.addEventListener("click", function (e) {
            e.preventDefault();
            clearAllErrors();
            registerSection.classList.add("hidden");
            loginSection.classList.remove("hidden");
        });
    }

    document.querySelectorAll(".btn-toggle-password").forEach(function (btn) {
        btn.addEventListener("click", function () {
            togglePassword(btn.getAttribute("data-target"), btn);
        });
    });

    document.querySelectorAll("input").forEach(function (input) {
        input.addEventListener("input", function () {
            clearError(input.id + "-error", input.id);
            var globalLoginError = document.getElementById("login-global-error");
            if (globalLoginError) { globalLoginError.textContent = ""; globalLoginError.classList.remove("active"); }
            var globalRegisterError = document.getElementById("register-global-error");
            if (globalRegisterError) { globalRegisterError.textContent = ""; globalRegisterError.classList.remove("active"); }
        });
    });

    var loginForm    = document.getElementById("login-form");
    var registerForm = document.getElementById("register-form");
    if (loginForm)    loginForm.addEventListener("submit", handleLogin);
    if (registerForm) registerForm.addEventListener("submit", handleRegistration);

    updateAuthNavbar();
});
