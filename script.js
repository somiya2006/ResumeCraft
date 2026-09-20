"use strict";

/* =========================================================
   RESUMECRAFT - COMPLETE SCRIPT
   Works with the HTML provided by you
========================================================= */

const STORAGE_KEY = "resumeCraftData";
const TEMPLATE_KEY = "resumeCraftTemplate";
const THEME_KEY = "resumeCraftTheme";
const PHOTO_KEY = "resumeCraftPhoto";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =========================================================
   HELPERS
========================================================= */

function clean(value) {
    return value == null ? "" : String(value).trim();
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function splitList(value) {
    return clean(value)
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
}

function normalizeUrl(value) {
    const text = clean(value);

    if (!text) return "";

    if (
        text.startsWith("http://") ||
        text.startsWith("https://")
    ) {
        return text;
    }

    return "https://" + text;
}

/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(message, icon = "✓") {
    const notification = $("#notification");
    const text = $("#notificationText");
    const iconBox = $("#notificationIcon");

    if (!notification) return;

    if (text) text.textContent = message;
    if (iconBox) iconBox.textContent = icon;

    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}

/* =========================================================
   FORCE ENABLE ALL FORM FIELDS
========================================================= */

function enableAllFormFields() {
    $$("input, textarea, select").forEach(field => {
        field.removeAttribute("readonly");
        field.removeAttribute("disabled");

        field.disabled = false;
        field.readOnly = false;

        field.style.pointerEvents = "auto";
        field.style.userSelect = "text";
    });
}

/* =========================================================
   DYNAMIC CARD HTML
========================================================= */

function getEducationHTML(data = {}) {
    return `
        <div class="dynamic-card education-card">

            <div class="dynamic-card-header">
                <strong>Education</strong>
                <button type="button" class="delete-card">
                    Delete
                </button>
            </div>

            <div class="form-grid">

                <div class="field">
                    <label>Degree / Course</label>
                    <input
                        type="text"
                        class="edu-degree"
                        placeholder="e.g. BSc Computer Science"
                        value="${escapeHTML(data.degree || "")}"
                    >
                </div>

                <div class="field">
                    <label>College / University</label>
                    <input
                        type="text"
                        class="edu-school"
                        placeholder="e.g. ABC College"
                        value="${escapeHTML(data.school || "")}"
                    >
                </div>

                <div class="field">
                    <label>Year</label>
                    <input
                        type="text"
                        class="edu-year"
                        placeholder="e.g. 2024 - 2027"
                        value="${escapeHTML(data.year || "")}"
                    >
                </div>

                <div class="field">
                    <label>CGPA / Percentage</label>
                    <input
                        type="text"
                        class="edu-score"
                        placeholder="e.g. 8.5 CGPA"
                        value="${escapeHTML(data.score || "")}"
                    >
                </div>

            </div>
        </div>
    `;
}

function getExperienceHTML(data = {}) {
    return `
        <div class="dynamic-card experience-card">

            <div class="dynamic-card-header">
                <strong>Experience / Internship</strong>
                <button type="button" class="delete-card">
                    Delete
                </button>
            </div>

            <div class="form-grid">

                <div class="field">
                    <label>Job Role</label>
                    <input
                        type="text"
                        class="exp-role"
                        placeholder="e.g. Web Development Intern"
                        value="${escapeHTML(data.role || "")}"
                    >
                </div>

                <div class="field">
                    <label>Company / Organization</label>
                    <input
                        type="text"
                        class="exp-company"
                        placeholder="e.g. InAmigos Foundation"
                        value="${escapeHTML(data.company || "")}"
                    >
                </div>

                <div class="field">
                    <label>Duration</label>
                    <input
                        type="text"
                        class="exp-duration"
                        placeholder="e.g. June 2026 - August 2026"
                        value="${escapeHTML(data.duration || "")}"
                    >
                </div>

                <div class="field full">
                    <label>Description / Responsibilities</label>
                    <textarea
                        class="exp-description"
                        rows="4"
                        placeholder="Describe your work, responsibilities and achievements..."
                    >${escapeHTML(data.description || "")}</textarea>
                </div>

            </div>
        </div>
    `;
}

function getProjectHTML(data = {}) {
    return `
        <div class="dynamic-card project-card">

            <div class="dynamic-card-header">
                <strong>Project</strong>
                <button type="button" class="delete-card">
                    Delete
                </button>
            </div>

            <div class="form-grid">

                <div class="field">
                    <label>Project Name</label>
                    <input
                        type="text"
                        class="project-name"
                        placeholder="e.g. Flipklart E-Commerce Website"
                        value="${escapeHTML(data.name || "")}"
                    >
                </div>

                <div class="field">
                    <label>Technologies</label>
                    <input
                        type="text"
                        class="project-tech"
                        placeholder="e.g. HTML, CSS, JavaScript"
                        value="${escapeHTML(data.tech || "")}"
                    >
                </div>

                <div class="field full">
                    <label>Project Description</label>
                    <textarea
                        class="project-description"
                        rows="4"
                        placeholder="Explain what you built and what problem it solves..."
                    >${escapeHTML(data.description || "")}</textarea>
                </div>

                <div class="field full">
                    <label>Project Link</label>
                    <input
                        type="text"
                        class="project-link"
                        placeholder="github.com/yourname/project"
                        value="${escapeHTML(data.link || "")}"
                    >
                </div>

            </div>
        </div>
    `;
}

function getCertificationHTML(data = {}) {
    return `
        <div class="dynamic-card certification-card">

            <div class="dynamic-card-header">
                <strong>Certification</strong>
                <button type="button" class="delete-card">
                    Delete
                </button>
            </div>

            <div class="form-grid">

                <div class="field">
                    <label>Certificate Name</label>
                    <input
                        type="text"
                        class="cert-name"
                        placeholder="e.g. Web Development Certificate"
                        value="${escapeHTML(data.name || "")}"
                    >
                </div>

                <div class="field">
                    <label>Issuing Organization</label>
                    <input
                        type="text"
                        class="cert-issuer"
                        placeholder="e.g. Coursera"
                        value="${escapeHTML(data.issuer || "")}"
                    >
                </div>

                <div class="field">
                    <label>Date</label>
                    <input
                        type="text"
                        class="cert-date"
                        placeholder="e.g. August 2026"
                        value="${escapeHTML(data.date || "")}"
                    >
                </div>

                <div class="field">
                    <label>Credential ID</label>
                    <input
                        type="text"
                        class="cert-id"
                        placeholder="Optional"
                        value="${escapeHTML(data.id || "")}"
                    >
                </div>

            </div>
        </div>
    `;
}

/* =========================================================
   ADD DYNAMIC CARD
========================================================= */

function addCard(type, data = {}, update = true) {

    let container;
    let html;

    if (type === "education") {
        container = $("#educationContainer");
        html = getEducationHTML(data);
    }

    if (type === "experience") {
        container = $("#experienceContainer");
        html = getExperienceHTML(data);
    }

    if (type === "project") {
        container = $("#projectsContainer");
        html = getProjectHTML(data);
    }

    if (type === "certification") {
        container = $("#certificationsContainer");
        html = getCertificationHTML(data);
    }

    if (!container) {
        console.error("Container not found for:", type);
        return;
    }

    container.insertAdjacentHTML("beforeend", html);

    const card = container.lastElementChild;

    attachCardEvents(card);

    enableAllFormFields();

    if (update) {
        updatePreview();
        autoSave();
    }
}

/* =========================================================
   CARD EVENTS
========================================================= */

function attachCardEvents(card) {

    if (!card) return;

    /* DELETE */
    const deleteButton = card.querySelector(".delete-card");

    if (deleteButton) {
        deleteButton.addEventListener("click", function () {

            card.remove();

            updatePreview();
            autoSave();

            showNotification("Section removed", "✓");
        });
    }

    /* LIVE UPDATE */
    card.querySelectorAll("input, textarea, select").forEach(field => {

        field.removeAttribute("readonly");
        field.removeAttribute("disabled");

        field.disabled = false;
        field.readOnly = false;

        field.addEventListener("input", function () {
            updatePreview();
            autoSave();
        });

        field.addEventListener("change", function () {
            updatePreview();
            autoSave();
        });
    });
}

/* =========================================================
   CREATE DEFAULT CARDS
========================================================= */

function createInitialCards() {

    if (
        $("#educationContainer") &&
        $("#educationContainer").children.length === 0
    ) {
        addCard("education", {}, false);
    }

    if (
        $("#experienceContainer") &&
        $("#experienceContainer").children.length === 0
    ) {
        addCard("experience", {}, false);
    }

    if (
        $("#projectsContainer") &&
        $("#projectsContainer").children.length === 0
    ) {
        addCard("project", {}, false);
    }

    if (
        $("#certificationsContainer") &&
        $("#certificationsContainer").children.length === 0
    ) {
        addCard("certification", {}, false);
    }

    enableAllFormFields();
}

/* =========================================================
   COLLECT DATA
========================================================= */

function collectData() {

    const getValue = id => {
        const element = document.getElementById(id);
        return element ? element.value : "";
    };

    const education = [];

    $$("#educationContainer .education-card").forEach(card => {

        education.push({
            degree: card.querySelector(".edu-degree")?.value || "",
            school: card.querySelector(".edu-school")?.value || "",
            year: card.querySelector(".edu-year")?.value || "",
            score: card.querySelector(".edu-score")?.value || ""
        });
    });

    const experience = [];

    $$("#experienceContainer .experience-card").forEach(card => {

        experience.push({
            role: card.querySelector(".exp-role")?.value || "",
            company: card.querySelector(".exp-company")?.value || "",
            duration: card.querySelector(".exp-duration")?.value || "",
            description: card.querySelector(".exp-description")?.value || ""
        });
    });

    const projects = [];

    $$("#projectsContainer .project-card").forEach(card => {

        projects.push({
            name: card.querySelector(".project-name")?.value || "",
            tech: card.querySelector(".project-tech")?.value || "",
            description: card.querySelector(".project-description")?.value || "",
            link: card.querySelector(".project-link")?.value || ""
        });
    });

    const certifications = [];

    $$("#certificationsContainer .certification-card").forEach(card => {

        certifications.push({
            name: card.querySelector(".cert-name")?.value || "",
            issuer: card.querySelector(".cert-issuer")?.value || "",
            date: card.querySelector(".cert-date")?.value || "",
            id: card.querySelector(".cert-id")?.value || ""
        });
    });

    return {

        personal: {
            fullName: getValue("fullName"),
            jobTitle: getValue("jobTitle"),
            email: getValue("email"),
            phone: getValue("phone"),
            location: getValue("location"),
            linkedin: getValue("linkedin"),
            github: getValue("github"),
            portfolio: getValue("portfolio"),
            summary: getValue("summary")
        },

        education,
        experience,
        projects,
        certifications,

        skills: getValue("skills"),
        achievements: getValue("achievements"),
        languages: getValue("languages"),
        interests: getValue("interests")
    };
}

/* =========================================================
   SAVE
========================================================= */

function saveResume() {

    try {

        const data = collectData();

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );

        showNotification("Resume saved successfully!", "✓");

    } catch (error) {

        console.error(error);

        showNotification(
            "Could not save resume",
            "!"
        );
    }
}

/* =========================================================
   AUTO SAVE
========================================================= */

function autoSave() {

    try {

        const data = collectData();

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );

    } catch (error) {
        console.error("Auto save error:", error);
    }
}

/* =========================================================
   LOAD RESUME
========================================================= */

function loadResume() {

    let saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        createInitialCards();
        return;
    }

    try {

        const data = JSON.parse(saved);

        const personal = data.personal || {};

        Object.keys(personal).forEach(key => {

            const element = document.getElementById(key);

            if (element) {
                element.value = personal[key] || "";
            }
        });

        /* Clear old dynamic cards */
        $("#educationContainer").innerHTML = "";
        $("#experienceContainer").innerHTML = "";
        $("#projectsContainer").innerHTML = "";
        $("#certificationsContainer").innerHTML = "";

        /* EDUCATION */
        if (
            Array.isArray(data.education) &&
            data.education.length > 0
        ) {

            data.education.forEach(item => {
                addCard("education", item, false);
            });

        } else {

            addCard("education", {}, false);
        }

        /* EXPERIENCE */
        if (
            Array.isArray(data.experience) &&
            data.experience.length > 0
        ) {

            data.experience.forEach(item => {
                addCard("experience", item, false);
            });

        } else {

            addCard("experience", {}, false);
        }

        /* PROJECTS */
        if (
            Array.isArray(data.projects) &&
            data.projects.length > 0
        ) {

            data.projects.forEach(item => {
                addCard("project", item, false);
            });

        } else {

            addCard("project", {}, false);
        }

        /* CERTIFICATIONS */
        if (
            Array.isArray(data.certifications) &&
            data.certifications.length > 0
        ) {

            data.certifications.forEach(item => {
                addCard("certification", item, false);
            });

        } else {

            addCard("certification", {}, false);
        }

        $("#skills").value = data.skills || "";
        $("#achievements").value = data.achievements || "";
        $("#languages").value = data.languages || "";
        $("#interests").value = data.interests || "";

        enableAllFormFields();

    } catch (error) {

        console.error("Load error:", error);

        createInitialCards();
    }
}

/* =========================================================
   CLEAR RESUME
========================================================= */

function clearResume() {

    const confirmed = confirm(
        "Are you sure you want to clear the entire resume?"
    );

    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PHOTO_KEY);

    $$(
        "input:not([type='file']), textarea"
    ).forEach(field => {
        field.value = "";
    });

    $("#educationContainer").innerHTML = "";
    $("#experienceContainer").innerHTML = "";
    $("#projectsContainer").innerHTML = "";
    $("#certificationsContainer").innerHTML = "";

    createInitialCards();

    removePhoto();

    updatePreview();

    showNotification(
        "Resume cleared",
        "✓"
    );
}

/* =========================================================
   PHOTO
========================================================= */

function displayPhoto(src) {

    const uploadPreview = $("#photoPreview");
    const placeholder = $("#photoPlaceholder");

    const resumePhoto = $("#previewPhoto");
    const resumePlaceholder = $("#previewPhotoPlaceholder");

    if (src) {

        if (uploadPreview) {
            uploadPreview.src = src;
            uploadPreview.style.display = "block";
        }

        if (placeholder) {
            placeholder.style.display = "none";
        }

        if (resumePhoto) {
            resumePhoto.src = src;
            resumePhoto.style.display = "block";
        }

        if (resumePlaceholder) {
            resumePlaceholder.style.display = "none";
        }

    } else {

        if (uploadPreview) {
            uploadPreview.src = "";
            uploadPreview.style.display = "none";
        }

        if (placeholder) {
            placeholder.style.display = "flex";
        }

        if (resumePhoto) {
            resumePhoto.src = "";
            resumePhoto.style.display = "none";
        }

        if (resumePlaceholder) {
            resumePlaceholder.style.display = "flex";
        }
    }
}

function removePhoto() {

    localStorage.removeItem(PHOTO_KEY);

    const input = $("#profilePhoto");

    if (input) {
        input.value = "";
    }

    displayPhoto("");

    updatePreview();
}

function setupPhoto() {

    const input = $("#profilePhoto");
    const removeButton = $("#removePhotoBtn");

    if (input) {

        input.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {

                showNotification(
                    "Please select an image",
                    "!"
                );

                return;
            }

            if (file.size > 2 * 1024 * 1024) {

                showNotification(
                    "Photo must be below 2MB",
                    "!"
                );

                this.value = "";
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {

                const src = event.target.result;

                try {

                    localStorage.setItem(
                        PHOTO_KEY,
                        src
                    );

                    displayPhoto(src);

                    showNotification(
                        "Photo uploaded",
                        "✓"
                    );

                } catch (error) {

                    console.error(error);

                    showNotification(
                        "Photo is too large for storage",
                        "!"
                    );
                }
            };

            reader.readAsDataURL(file);
        });
    }

    if (removeButton) {

        removeButton.addEventListener(
            "click",
            removePhoto
        );
    }

    const savedPhoto = localStorage.getItem(PHOTO_KEY);

    if (savedPhoto) {
        displayPhoto(savedPhoto);
    } else {
        displayPhoto("");
    }
}

/* =========================================================
   PREVIEW HELPERS
========================================================= */

function setText(id, value, fallback = "") {

    const element = document.getElementById(id);

    if (!element) return;

    element.textContent =
        clean(value) || fallback;
}

function showSection(id, show) {

    const section = document.getElementById(id);

    if (!section) return;

    section.style.display = show ? "" : "none";
}

/* =========================================================
   SUMMARY
========================================================= */

function renderSummary(data) {

    const summary = clean(data.personal.summary);

    setText(
        "previewSummary",
        summary,
        "Your professional summary will appear here."
    );

    showSection(
        "summarySection",
        Boolean(summary)
    );
}

/* =========================================================
   EDUCATION PREVIEW
========================================================= */

function renderEducation(items) {

    const container = $("#previewEducationList");

    if (!container) return;

    container.innerHTML = "";

    const validItems = (items || []).filter(item =>
        clean(item.degree) ||
        clean(item.school) ||
        clean(item.year) ||
        clean(item.score)
    );

    validItems.forEach(item => {

        const div = document.createElement("div");

        div.className = "preview-item";

        div.innerHTML = `
            <div class="preview-item-top">
                <strong>${escapeHTML(item.degree)}</strong>
                <span>${escapeHTML(item.year)}</span>
            </div>

            <div class="preview-item-sub">
                ${escapeHTML(item.school)}
            </div>

            ${
                clean(item.score)
                    ? `<div class="preview-item-meta">
                        ${escapeHTML(item.score)}
                       </div>`
                    : ""
            }
        `;

        container.appendChild(div);
    });

    showSection(
        "educationSection",
        validItems.length > 0
    );
}

/* =========================================================
   EXPERIENCE PREVIEW
========================================================= */

function renderExperience(items) {

    const container = $("#previewExperienceList");

    if (!container) return;

    container.innerHTML = "";

    const validItems = (items || []).filter(item =>
        clean(item.role) ||
        clean(item.company) ||
        clean(item.duration) ||
        clean(item.description)
    );

    validItems.forEach(item => {

        const div = document.createElement("div");

        div.className = "preview-item";

        div.innerHTML = `
            <div class="preview-item-top">
                <strong>${escapeHTML(item.role)}</strong>
                <span>${escapeHTML(item.duration)}</span>
            </div>

            <div class="preview-item-sub">
                ${escapeHTML(item.company)}
            </div>

            ${
                clean(item.description)
                    ? `<p>${escapeHTML(item.description)}</p>`
                    : ""
            }
        `;

        container.appendChild(div);
    });

    showSection(
        "experienceSection",
        validItems.length > 0
    );
}

/* =========================================================
   PROJECT PREVIEW
========================================================= */

function renderProjects(items) {

    const container = $("#previewProjectsList");

    if (!container) return;

    container.innerHTML = "";

    const validItems = (items || []).filter(item =>
        clean(item.name) ||
        clean(item.tech) ||
        clean(item.description) ||
        clean(item.link)
    );

    validItems.forEach(item => {

        const div = document.createElement("div");

        div.className = "preview-item";

        let linkHTML = "";

        if (clean(item.link)) {

            const url = normalizeUrl(item.link);

            linkHTML = `
                <a
                    href="${escapeHTML(url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View Project
                </a>
            `;
        }

        div.innerHTML = `
            <div class="preview-item-top">
                <strong>${escapeHTML(item.name)}</strong>
                ${linkHTML}
            </div>

            ${
                clean(item.tech)
                    ? `<div class="preview-item-sub">
                        ${escapeHTML(item.tech)}
                       </div>`
                    : ""
            }

            ${
                clean(item.description)
                    ? `<p>${escapeHTML(item.description)}</p>`
                    : ""
            }
        `;

        container.appendChild(div);
    });

    showSection(
        "projectsSection",
        validItems.length > 0
    );
}

/* =========================================================
   CERTIFICATIONS
========================================================= */

function renderCertifications(items) {

    const container = $("#previewCertifications");

    if (!container) return;

    container.innerHTML = "";

    const validItems = (items || []).filter(item =>
        clean(item.name) ||
        clean(item.issuer) ||
        clean(item.date) ||
        clean(item.id)
    );

    validItems.forEach(item => {

        const div = document.createElement("div");

        div.className = "preview-item";

        div.innerHTML = `
            <div class="preview-item-top">
                <strong>${escapeHTML(item.name)}</strong>
                <span>${escapeHTML(item.date)}</span>
            </div>

            <div class="preview-item-sub">
                ${escapeHTML(item.issuer)}
            </div>

            ${
                clean(item.id)
                    ? `<div class="preview-item-meta">
                        Credential ID: ${escapeHTML(item.id)}
                       </div>`
                    : ""
            }
        `;

        container.appendChild(div);
    });

    showSection(
        "certificationsSection",
        validItems.length > 0
    );
}

/* =========================================================
   TAGS
========================================================= */

function renderTags(id, value) {

    const container = $("#" + id);

    if (!container) return;

    container.innerHTML = "";

    const items = splitList(value);

    items.forEach(item => {

        const span = document.createElement("span");

        span.className = "skill-tag";
        span.textContent = item;

        container.appendChild(span);
    });

    return items.length;
}

/* =========================================================
   LIST
========================================================= */

function renderList(id, value) {

    const container = $("#" + id);

    if (!container) return;

    container.innerHTML = "";

    const items = splitList(value);

    items.forEach(item => {

        const span = document.createElement("span");

        span.textContent = item;

        container.appendChild(span);
    });

    return items.length;
}

/* =========================================================
   MAIN PREVIEW
========================================================= */

function updatePreview() {

    const data = collectData();

    const personal = data.personal;

    setText(
        "previewName",
        personal.fullName,
        "Your Name"
    );

    setText(
        "previewJob",
        personal.jobTitle,
        "Professional Title"
    );

    setText(
        "previewEmail",
        personal.email,
        "email@example.com"
    );

    setText(
        "previewPhone",
        personal.phone
    );

    setText(
        "previewLocation",
        personal.location
    );

    const linkedin = $("#previewLinkedin");

    if (linkedin) {

        linkedin.innerHTML = "";

        if (clean(personal.linkedin)) {

            const a = document.createElement("a");

            a.href = normalizeUrl(personal.linkedin);
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = "LinkedIn";

            linkedin.appendChild(a);
        }
    }

    const github = $("#previewGithub");

    if (github) {

        github.innerHTML = "";

        if (clean(personal.github)) {

            const a = document.createElement("a");

            a.href = normalizeUrl(personal.github);
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = "GitHub";

            github.appendChild(a);
        }
    }

    const portfolio = $("#previewPortfolio");

    if (portfolio) {

        portfolio.innerHTML = "";

        if (clean(personal.portfolio)) {

            const a = document.createElement("a");

            a.href = normalizeUrl(personal.portfolio);
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = "Portfolio";

            portfolio.appendChild(a);
        }
    }

    renderSummary(data);

    renderEducation(data.education);

    renderExperience(data.experience);

    renderProjects(data.projects);

    renderCertifications(data.certifications);

    const skillCount = renderTags(
        "previewSkills",
        data.skills
    );

    showSection(
        "skillsSection",
        skillCount > 0
    );

    setText(
        "previewAchievements",
        data.achievements
    );

    showSection(
        "achievementsSection",
        Boolean(clean(data.achievements))
    );

    const languageCount = renderList(
        "previewLanguages",
        data.languages
    );

    showSection(
        "languagesSection",
        languageCount > 0
    );

    const interestCount = renderList(
        "previewInterests",
        data.interests
    );

    showSection(
        "interestsSection",
        interestCount > 0
    );

    const savedPhoto =
        localStorage.getItem(PHOTO_KEY);

    if (savedPhoto) {
        displayPhoto(savedPhoto);
    }
}

/* =========================================================
   TEMPLATES
========================================================= */

function setupTemplates() {

    const buttons = $$("[data-template]");
    const paper = $("#resumePaper");

    if (!paper) return;

    let savedTemplate =
        localStorage.getItem(TEMPLATE_KEY) ||
        "classic";

    applyTemplate(savedTemplate);

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const template =
                    this.dataset.template;

                applyTemplate(template);

                showNotification(
                    template.charAt(0).toUpperCase() +
                    template.slice(1) +
                    " template selected",
                    "✓"
                );
            }
        );
    });
}

function applyTemplate(template) {

    const paper = $("#resumePaper");

    if (!paper) return;

    paper.classList.remove(
        "classic",
        "modern",
        "minimal"
    );

    paper.classList.add(template);

    $$("[data-template]").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.template === template
        );
    });

    localStorage.setItem(
        TEMPLATE_KEY,
        template
    );
}

/* =========================================================
   DARK / LIGHT MODE
========================================================= */

function setupTheme() {

    const button = $("#themeBtn");

    const savedTheme =
        localStorage.getItem(THEME_KEY);

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");

        if (button) {
            button.textContent = "☀️";
        }
    }

    if (!button) return;

    button.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );

            const dark =
                document.body.classList.contains(
                    "dark-mode"
                );

            localStorage.setItem(
                THEME_KEY,
                dark ? "dark" : "light"
            );

            this.textContent =
                dark ? "☀️" : "🌙";
        }
    );
}

/* =========================================================
   PRINT / SAVE PDF
========================================================= */

function setupPrint() {

    const button = $("#downloadBtn");

    if (!button) return;

    button.addEventListener(
        "click",
        printResume
    );
}

function printResume() {

    updatePreview();

    const resume = $("#resumePaper");

    if (!resume) {
        showNotification(
            "Resume preview not found",
            "!"
        );
        return;
    }

    const printWindow = window.open(
        "",
        "_blank",
        "width=1000,height=1200"
    );

    if (!printWindow) {

        showNotification(
            "Please allow pop-ups for PDF printing",
            "!"
        );

        return;
    }

    const styles =
        Array.from(
            document.querySelectorAll(
                "link[rel='stylesheet'], style"
            )
        )
        .map(element => element.outerHTML)
        .join("\n");

    const clonedResume =
        resume.cloneNode(true);

    /* Remove interactive elements */
    clonedResume
        .querySelectorAll(
            "button, input, textarea, select"
        )
        .forEach(element => element.remove());

    printWindow.document.open();

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>

            <meta charset="UTF-8">

            <title>
                ${escapeHTML(
                    $("#fullName")?.value ||
                    "Professional Resume"
                )}
            </title>

            ${styles}

            <style>

                @page {
                    size: A4 portrait;
                    margin: 0;
                }

                html,
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                    width: 210mm;
                    min-height: 297mm;
                }

                body {
                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif !important;
                }

                #resumePaper {
                    width: 210mm !important;
                    min-height: 297mm !important;
                    margin: 0 !important;
                    padding: 15mm !important;
                    box-sizing: border-box !important;
                    box-shadow: none !important;
                    border: none !important;
                    background: white !important;
                    color: #111 !important;
                }

                .resume-paper {
                    transform: none !important;
                }

                .resume-paper *,
                .resume-paper *::before,
                .resume-paper *::after {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                a {
                    color: inherit !important;
                    text-decoration: none !important;
                }

                img {
                    max-width: 100%;
                }

            </style>

        </head>

        <body>

            ${clonedResume.outerHTML}

            <script>

                window.onload = function() {

                    setTimeout(function() {
                        window.print();
                    }, 700);

                };

            <\/script>

        </body>
        </html>
    `);

    printWindow.document.close();
}

/* =========================================================
   ANALYZER
========================================================= */

function setupAnalyzer() {

    const button = $("#analyzeBtn");

    if (!button) return;

    button.addEventListener(
        "click",
        analyzeSkills
    );
}

function analyzeSkills() {

    const role =
        $("#jobRole")?.value || "frontend";

    const skillText =
        $("#skills")?.value || "";

    const userSkills =
        splitList(skillText)
            .map(skill =>
                skill.toLowerCase()
            );

    const roleSkills = {

        frontend: [
            "html",
            "css",
            "javascript",
            "responsive design",
            "git",
            "github",
            "react"
        ],

        backend: [
            "java",
            "python",
            "node.js",
            "sql",
            "api",
            "git",
            "database"
        ],

        fullstack: [
            "html",
            "css",
            "javascript",
            "react",
            "node.js",
            "sql",
            "git",
            "github"
        ],

        python: [
            "python",
            "sql",
            "django",
            "flask",
            "git",
            "api"
        ],

        data: [
            "python",
            "sql",
            "excel",
            "statistics",
            "power bi",
            "data analysis"
        ],

        software: [
            "java",
            "python",
            "c++",
            "sql",
            "git",
            "data structures",
            "algorithms"
        ]
    };

    const required =
        roleSkills[role] ||
        roleSkills.frontend;

    const matching =
        required.filter(skill =>
            userSkills.some(userSkill =>
                userSkill.includes(skill) ||
                skill.includes(userSkill)
            )
        );

    const missing =
        required.filter(
            skill =>
                !matching.includes(skill)
        );

    const score =
        required.length
            ? Math.round(
                (matching.length /
                    required.length) *
                100
            )
            : 0;

    setText(
        "score",
        score + "%"
    );

    setText(
        "analysisTitle",
        score >= 75
            ? "Strong Skill Match"
            : score >= 50
                ? "Good Starting Point"
                : "Skills Can Be Improved"
    );

    setText(
        "analysisMessage",
        score >= 75
            ? "Your listed skills match many common requirements for this role."
            : score >= 50
                ? "You have several relevant skills. Consider adding the missing ones."
                : "Add more relevant technical skills to improve the match."
    );

    const matchingContainer =
        $("#matchingSkills");

    const missingContainer =
        $("#missingSkills");

    if (matchingContainer) {

        matchingContainer.innerHTML = "";

        if (matching.length === 0) {

            matchingContainer.innerHTML =
                `<span class="empty-tag">
                    No matching skills
                </span>`;

        } else {

            matching.forEach(skill => {

                const span =
                    document.createElement("span");

                span.textContent = skill;
                span.className = "analysis-tag";

                matchingContainer.appendChild(span);
            });
        }
    }

    if (missingContainer) {

        missingContainer.innerHTML = "";

        if (missing.length === 0) {

            missingContainer.innerHTML =
                `<span class="empty-tag">
                    All common skills covered
                </span>`;

        } else {

            missing.forEach(skill => {

                const span =
                    document.createElement("span");

                span.textContent = skill;
                span.className = "analysis-tag";

                missingContainer.appendChild(span);
            });
        }
    }
}

/* =========================================================
   ADD BUTTONS
========================================================= */

function setupAddButtons() {

    const educationButton =
        $("#addEducationBtn");

    const experienceButton =
        $("#addExperienceBtn");

    const projectButton =
        $("#addProjectBtn");

    const certificationButton =
        $("#addCertificationBtn");

    if (educationButton) {

        educationButton.addEventListener(
            "click",
            function () {

                addCard("education");

                setTimeout(() => {

                    const container =
                        $("#educationContainer");

                    const last =
                        container?.lastElementChild;

                    last?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    last
                        ?.querySelector("input")
                        ?.focus();

                }, 100);
            }
        );
    }

    if (experienceButton) {

        experienceButton.addEventListener(
            "click",
            function () {

                addCard("experience");

                setTimeout(() => {

                    const container =
                        $("#experienceContainer");

                    const last =
                        container?.lastElementChild;

                    last?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    last
                        ?.querySelector("input")
                        ?.focus();

                }, 100);
            }
        );
    }

    if (projectButton) {

        projectButton.addEventListener(
            "click",
            function () {

                addCard("project");

                setTimeout(() => {

                    const container =
                        $("#projectsContainer");

                    const last =
                        container?.lastElementChild;

                    last?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    last
                        ?.querySelector("input")
                        ?.focus();

                }, 100);
            }
        );
    }

    if (certificationButton) {

        certificationButton.addEventListener(
            "click",
            function () {

                addCard("certification");

                setTimeout(() => {

                    const container =
                        $("#certificationsContainer");

                    const last =
                        container?.lastElementChild;

                    last?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    last
                        ?.querySelector("input")
                        ?.focus();

                }, 100);
            }
        );
    }
}

/* =========================================================
   SAVE / CLEAR BUTTONS
========================================================= */

function setupSaveClear() {

    const saveButton = $("#saveBtn");
    const clearButton = $("#clearBtn");

    if (saveButton) {
        saveButton.addEventListener(
            "click",
            saveResume
        );
    }

    if (clearButton) {
        clearButton.addEventListener(
            "click",
            clearResume
        );
    }
}

/* =========================================================
   LIVE UPDATE FOR NORMAL FIELDS
========================================================= */

function setupLiveUpdate() {

    $$(
        "#fullName, #jobTitle, #email, #phone, #location, " +
        "#linkedin, #github, #portfolio, #summary, #skills, " +
        "#achievements, #languages, #interests"
    ).forEach(field => {

        field.addEventListener(
            "input",
            function () {

                updatePreview();
                autoSave();
            }
        );

        field.addEventListener(
            "change",
            function () {

                updatePreview();
                autoSave();
            }
        );
    });
}

/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "s"
            ) {

                event.preventDefault();

                saveResume();
            }

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "p"
            ) {

                event.preventDefault();

                printResume();
            }
        }
    );
}

/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "ResumeCraft JavaScript loaded successfully."
        );

        enableAllFormFields();

        loadResume();

        setupTemplates();

        setupTheme();

        setupPhoto();

        setupPrint();

        setupAnalyzer();

        setupAddButtons();

        setupSaveClear();

        setupLiveUpdate();

        setupKeyboard();

        enableAllFormFields();

        updatePreview();

        console.log(
            "ResumeCraft initialized successfully."
        );
    }
);