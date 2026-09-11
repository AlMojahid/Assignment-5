"use strict";

//    API

const API_BASE =
    "https://phi-lab-server.vercel.app/api/v1/lab";

//    LOGIN PROTECTION

if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("./index.html");
}

//    APPLICATION STATE

const state = {
    allIssues: [],
    visibleIssues: [],
    activeTab: "all",
    searchText: "",
    loading: false
};

//    DOM ELEMENTS

const issuesGrid =
    document.getElementById("issuesGrid");

const loading =
    document.getElementById("loading");

const emptyState =
    document.getElementById("emptyState");

const issueCount =
    document.getElementById("issueCount");

const sectionSubtitle =
    document.getElementById("sectionSubtitle");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const logoutButton =
    document.getElementById("logoutButton");

const newIssueButton =
    document.getElementById("newIssueButton");

const tabs = [
    ...document.querySelectorAll(".tab-button")
];

const modalBackdrop =
    document.getElementById("modalBackdrop");

const closeModal =
    document.getElementById("closeModal");

const modalStatus =
    document.getElementById("modalStatus");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById("modalDescription");

const modalMeta =
    document.getElementById("modalMeta");

const modalLabels =
    document.getElementById("modalLabels");

const newIssueBackdrop =
    document.getElementById("newIssueBackdrop");

const closeNewIssueModal =
    document.getElementById("closeNewIssueModal");

const newIssueOkay =
    document.getElementById("newIssueOkay");

//    HELPER FUNCTIONS

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

//    SAFE TEXT

function safeText(value, fallback = "Unknown") {
    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return fallback;
    }

    return String(value);
}

function formatDate(dateString) {

    if (!dateString) {
        return "Unknown";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return String(dateString);
    }

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}

function normalize(value) {
    return safeText(value, "")
        .toLowerCase()
        .trim();
}
//    LOADING

function setLoading(isLoading) {

    state.loading = isLoading;

    if (!loading) {
        return;
    }

    loading.style.display =
        isLoading ? "flex" : "none";

    if (isLoading) {

        issuesGrid.innerHTML = "";

        emptyState.style.display = "none";
    }
}
//    STATUS BADGE

function statusBadge(status) {

    const isOpen =
        normalize(status) === "open";

    const background =
        isOpen ? "#dcfce7" : "#ede9fe";

    const color =
        isOpen ? "#15803d" : "#6d28d9";

    const label =
        isOpen ? "Open" : "Closed";

    return `
        <span
            style="
                display:inline-flex;
                align-items:center;
                gap:5px;
                padding:5px 8px;
                border-radius:999px;
                background-color:${background};
                color:${color};
                font-size:10px;
                font-weight:700;
            "
        >
            <span
                style="
                    width:6px;
                    height:6px;
                    border-radius:50%;
                    background-color:${color};
                    display:inline-block;
                "
            ></span>

            ${label}
        </span>
    `;
}
//   LABELS

function labelHtml(labels = []) {

    if (!Array.isArray(labels)) {
        return "";
    }

    return labels
        .filter(
            label =>
                label !== null &&
                label !== undefined &&
                String(label).trim() !== ""
        )
        .map(
            label => `
                <span
                    style="
                        display:inline-flex;
                        align-items:center;
                        padding:4px 7px;
                        border-radius:5px;
                        background-color:#f1f5f9;
                        color:#475569;
                        font-size:10px;
                        font-weight:600;
                    "
                >
                    ${escapeHtml(label)}
                </span>
            `
        )
        .join("");
}