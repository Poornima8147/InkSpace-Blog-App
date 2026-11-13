
const API = "";

let currentUser = JSON.parse(localStorage.getItem("inkspaceUser")) || null;

const blogContainer = document.getElementById("blogContainer");
const authModal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");
const blogForm = document.getElementById("blogForm");

// SHOW LOGIN / REGISTER
function openAuth(type = "login") {
    document.getElementById("authTitle").textContent =
        type === "login" ? "Welcome Back" : "Create Account";

    document.getElementById("authName").style.display =
        type === "register" ? "block" : "none";

    document.getElementById("authSubmit").textContent =
        type === "login" ? "Login" : "Register";

    document.getElementById("authMode").value = type;
    authModal.style.display = "flex";
}

function closeAuth() {
    authModal.style.display = "none";
}

// REGISTER / LOGIN
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mode = document.getElementById("authMode").value;

    const data = {
        email: document.getElementById("authEmail").value,
        password: document.getElementById("authPassword").value
    };

    if (mode === "register") {
        data.name = document.getElementById("authName").value;
    }

    try {
        const response = await fetch(`/api/auth/${mode}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Something went wrong");
            return;
        }

        if (mode === "register") {
            alert("Registration successful! Please log in.");
            authForm.reset();
            openAuth("login");
            return;
        }

        currentUser = result.user;
        localStorage.setItem("inkspaceUser", JSON.stringify(currentUser));

        closeAuth();
        authForm.reset();
        updateUserInterface();
        alert(`Welcome, ${currentUser.name}!`);
    } catch (error) {
        alert("Unable to connect to the server.");
    }
});

// UPDATE NAVIGATION
function updateUserInterface() {
    const authButtons = document.getElementById("authButtons");
    const userActions = document.getElementById("userActions");

    if (currentUser) {
        authButtons.style.display = "none";
        userActions.style.display = "flex";
        document.getElementById("welcomeUser").textContent =
            `Hi, ${currentUser.name}`;
    } else {
        authButtons.style.display = "flex";
        userActions.style.display = "none";
    }
}

// LOAD ALL BLOGS
async function loadBlogs() {
    try {
        const response = await fetch("/api/blogs");
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        displayBlogs(result.blogs);
    } catch (error) {
        blogContainer.innerHTML =
            "<p>Unable to load blogs. Please refresh the page.</p>";
    }
}

// DISPLAY BLOGS
function displayBlogs(blogs) {
    if (!blogs || blogs.length === 0) {
        blogContainer.innerHTML = "<p>No blogs published yet.</p>";
        return;
    }

    blogContainer.innerHTML = blogs.map(blog => `
        <article class="blog-card">
            <div class="blog-card-content">
                <span class="blog-author">By ${escapeHTML(blog.author)}</span>
                <h3>${escapeHTML(blog.title)}</h3>
                <p>${escapeHTML(blog.content)}</p>
                <small>${new Date(blog.created_at).toLocaleDateString()}</small>
            </div>
        </article>
    `).join("");
}

// PREVENT HTML INJECTION
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

// OPEN BLOG EDITOR
function openBlogEditor() {
    if (!currentUser) {
        openAuth("login");
        return;
    }

    document.getElementById("blogEditor").style.display = "block";
    document.getElementById("blogEditor").scrollIntoView({
        behavior: "smooth"
    });
}

// CREATE BLOG
blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentUser) {
        alert("Please log in first.");
        return;
    }

    const data = {
        user_id: currentUser.id,
        title: document.getElementById("blogTitle").value,
        content: document.getElementById("blogContent").value
    };

    try {
        const response = await fetch("/api/blogs/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Blog creation failed");
            return;
        }

        alert("Your blog has been published!");
        blogForm.reset();
        document.getElementById("blogEditor").style.display = "none";
        await loadBlogs();
    } catch (error) {
        alert("Unable to connect to the server.");
    }
});

// LOGOUT
function logout() {
    localStorage.removeItem("inkspaceUser");
    currentUser = null;
    updateUserInterface();
    alert("Logged out successfully.");
}

// INITIALIZE
document.addEventListener("DOMContentLoaded", () => {
    updateUserInterface();
    loadBlogs();
});
