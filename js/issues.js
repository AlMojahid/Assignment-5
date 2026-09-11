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

//    ISSUE CARD

function cardHtml(issue) {

    const isOpen =
        normalize(issue.status) === "open";

    const borderColor =
        isOpen ? "#22c55e" : "#8b5cf6";

    const issueId =
        safeText(issue.id, "");

    const title =
        safeText(issue.title, "Untitled issue");

    const description =
        safeText(
            issue.description,
            "No description available."
        );

    const author =
        safeText(issue.author, "Unknown");

    const priority =
        safeText(issue.priority, "Unknown");

    return `
        <article
            data-id="${escapeHtml(issueId)}"
            class="issue-card"
            tabindex="0"
            role="button"
            aria-label="Open issue ${escapeHtml(title)}"
            style="
                background-color:#ffffff;
                border:1px solid #e5e7eb;
                border-top:3px solid ${borderColor};
                border-radius:9px;
                padding:16px;
                cursor:pointer;
                min-width:0;
            "
        >

            <!-- Top -->

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:8px;
                    margin-bottom:11px;
                "
            >

                ${statusBadge(issue.status)}

                <span
                    style="
                        font-size:10px;
                        color:#94a3b8;
                    "
                >
                    #${escapeHtml(issueId)}
                </span>

            </div>


            <!-- Title -->

            <h3
                style="
                    margin:0 0 8px;
                    font-size:14px;
                    line-height:1.45;
                    color:#1e293b;
                    font-weight:700;
                "
            >
                ${escapeHtml(title)}
            </h3>


            <!-- Description -->

            <p
                style="
                    margin:0 0 14px;
                    font-size:12px;
                    line-height:1.55;
                    color:#64748b;
                    display:-webkit-box;
                    -webkit-line-clamp:3;
                    -webkit-box-orient:vertical;
                    overflow:hidden;
                "
            >
                ${escapeHtml(description)}
            </p>


            <!-- Labels -->

            <div
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:6px;
                    min-height:20px;
                    margin-bottom:14px;
                "
            >
                ${labelHtml(issue.labels)}
            </div>

                        <!-- Information -->

            <div
                style="
                    border-top:1px solid #f1f5f9;
                    padding-top:12px;
                    display:flex;
                    flex-direction:column;
                    gap:7px;
                "
            >

                <!-- Author -->

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        gap:8px;
                        font-size:11px;
                    "
                >

                    <span
                        style="color:#94a3b8;"
                    >
                        Author
                    </span>

                    <strong
                        title="${escapeHtml(author)}"
                        style="
                            color:#475569;
                            font-weight:600;
                            overflow:hidden;
                            text-overflow:ellipsis;
                            white-space:nowrap;
                        "
                    >
                        ${escapeHtml(author)}
                    </strong>

                </div>


                <!-- Priority -->

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        gap:8px;
                        font-size:11px;
                    "
                >

                    <span
                        style="color:#94a3b8;"
                    >
                        Priority
                    </span>

                    <strong
                        style="
                            color:#475569;
                            font-weight:600;
                            text-transform:capitalize;
                        "
                    >
                        ${escapeHtml(priority)}
                    </strong>

                </div>


                <!-- Created -->

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        gap:8px;
                        font-size:11px;
                    "
                >

                    <span
                        style="color:#94a3b8;"
                    >
                        Created
                    </span>

                    <strong
                        style="
                            color:#475569;
                            font-weight:600;
                        "
                    >
                        ${formatDate(issue.createdAt)}
                    </strong>

                </div>

            </div>

        </article>
    `;
}

//   TAB STYLES

function updateTabStyles() {

    tabs.forEach(button => {

        const active =
            button.dataset.tab === state.activeTab;

        button.style.background =
            active ? "#4f46e5" : "transparent";

        button.style.color =
            active ? "#ffffff" : "#64748b";

        button.setAttribute(
            "aria-selected",
            active ? "true" : "false"
        );
    });
}
//   RENDER ISSUES

function renderIssues() {

    updateTabStyles();

    const issues =
        Array.isArray(state.visibleIssues)
            ? state.visibleIssues
            : [];

    issuesGrid.innerHTML =
        issues.map(cardHtml).join("");

    const hasIssues =
        issues.length > 0;

    emptyState.style.display =
        hasIssues ? "none" : "block";

    issueCount.textContent =
        `${issues.length} ${issues.length === 1
            ? "Issue"
            : "Issues"
        }`;

    const subtitles = {
        all: "Track and manage your project issuesr",
        open: "Currently open issues",
        closed: "Resolved and closed issues"
    };

    sectionSubtitle.textContent =
        state.searchText
            ? `Search results for "${state.searchText}"`
            : subtitles[state.activeTab];


    // Card Events

    document
        .querySelectorAll(".issue-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {
                    openIssueModal(
                        card.dataset.id
                    );
                }
            );


            card.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        openIssueModal(
                            card.dataset.id
                        );
                    }
                }
            );
        });
}









//   FILTER ISSUES

function filterIssues() {

    let result = [
        ...state.allIssues
    ];

    // Tab filter

    if (
        state.activeTab !== "all"
    ) {

        result =
            result.filter(
                issue =>
                    normalize(issue.status) ===
                    state.activeTab
            );
    }

    // Search filter 

    if (state.searchText) {

        const query =
            normalize(state.searchText);

        result =
            result.filter(issue => {

                const labels =
                    Array.isArray(issue.labels)
                        ? issue.labels
                        : [];

                const searchable = [
                    issue.title,
                    issue.description,
                    issue.author,
                    issue.priority,
                    issue.assignee,
                    issue.id,
                    ...labels
                ]
                    .map(value =>
                        normalize(value)
                    )
                    .join(" ");

                return searchable.includes(query);
            });
    }

    state.visibleIssues = result;

    renderIssues();
}

//   LOAD ALL ISSUES

async function loadAllIssues() {

    setLoading(true);

    try {

        const response =
            await fetch(
                `${API_BASE}/issues`
            );

        if (!response.ok) {

            throw new Error(
                `Failed to fetch issues. (${response.status})`
            );
        }

        const result =
            await response.json();

        state.allIssues =
            Array.isArray(result.data)
                ? result.data
                : [];

        filterIssues();

    } catch (error) {

        state.allIssues = [];
        state.visibleIssues = [];

        renderError(
            error.message ||
            "Unable to load issues."
        );

    } finally {

        setLoading(false);
    }
}

//    ERROR UI

function renderError(message) {

    issueCount.textContent =
        "0 Issues";

    sectionSubtitle.textContent =
        "Unable to load issues";

    emptyState.style.display =
        "none";

    issuesGrid.innerHTML = `
        <div
            style="
                grid-column:1 / -1;
                padding:50px 20px;
                text-align:center;
                color:#dc2626;
                font-size:13px;
            "
        >

            <div
                style="
                    margin-bottom:8px;
                    font-weight:700;
                "
            >
                Something went wrong
            </div>

            <div
                style="
                    margin-bottom:14px;
                    color:#64748b;
                "
            >
                ${escapeHtml(message)}
            </div>

            <button
                id="retryButton"
                type="button"
                style="
                    padding:8px 14px;
                    border:1px solid #fecaca;
                    border-radius:6px;
                    background:#ffffff;
                    color:#b91c1c;
                    cursor:pointer;
                    font-weight:600;
                "
            >
                Try Again
            </button>

        </div>
    `;

    const retryButton =
        document.getElementById(
            "retryButton"
        );

    if (retryButton) {

        retryButton.addEventListener(
            "click",
            loadAllIssues
        );
    }
}

//   SEARCH

function runSearch() {

    if (!searchInput) {
        return;
    }

    state.searchText =
        searchInput.value.trim();

    filterIssues();
}

if (searchButton) {

    searchButton.addEventListener(
        "click",
        runSearch
    );
}

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                runSearch();
            }
        }
    );
}

//   TABS

tabs.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            state.activeTab =
                button.dataset.tab || "all";

            filterIssues();
        }
    );
});

//   ISSUE MODAL

async function openIssueModal(id) {

    if (
        !modalBackdrop ||
        !modalTitle ||
        !modalDescription ||
        !modalMeta ||
        !modalLabels
    ) {
        return;
    }

    modalBackdrop.style.display =
        "flex";

    document.body.style.overflow =
        "hidden";

    // Initial state

    modalTitle.textContent =
        "Loading...";

    modalDescription.textContent =
        "Loading issue details...";

    modalMeta.innerHTML =
        "";

    modalLabels.innerHTML =
        "";

    if (modalStatus) {

        modalStatus.textContent =
            "Loading";

        modalStatus.style.background =
            "#f1f5f9";

        modalStatus.style.color =
            "#64748b";
    }

    try {

        const safeId =
            encodeURIComponent(
                String(id)
            );


        const response =
            await fetch(
                `${API_BASE}/issue/${safeId}`
            );


        if (!response.ok) {

            throw new Error(
                `Unable to load issue details. (${response.status})`
            );
        }

        const result =
            await response.json();

        const issue =
            result.data;

        if (!issue) {

            throw new Error(
                "Issue not found."
            );
        }

        // Status

        const isOpen =
            normalize(issue.status) === "open0";

        if (modalStatus) {

            modalStatus.textContent =
                isOpen ? "Open" : "Closed";

            modalStatus.style.background =
                isOpen
                    ? "#dcfce7"
                    : "#ede9fe";

            modalStatus.style.color =
                isOpen
                    ? "#15803d"
                    : "#6d28d9";
        }

        // Title 

        modalTitle.textContent =
            safeText(
                issue.title,
                "Untitled issue"
            );

        //  Description 

        modalDescription.textContent =
            safeText(
                issue.description,
                "No description available."
            );

        // Meta

        const meta = [
            [
                "Author",
                safeText(issue.author)
            ],
            [
                "Assignee",
                safeText(
                    issue.assignee,
                    "Unassigned"
                )
            ],
            [
                "Priority",
                safeText(issue.priority)
            ],
            [
                "Created At",
                formatDate(issue.createdAt)
            ],
            [
                "Updated At",
                formatDate(issue.updatedAt)
            ],
            [
                "Issue ID",
                `#${safeText(issue.id)}`
            ]
        ];


        modalMeta.innerHTML =
            meta
                .map(
                    ([key, value]) => `
                        <div
                            style="
                                padding:12px;
                                border:1px solid #e5e7eb;
                                border-radius:8px;
                                background-color:#f8fafc;
                            "
                        >

                            <div
                                style="
                                    font-size:10px;
                                    color:#94a3b8;
                                    margin-bottom:4px;
                                "
                            >
                                ${escapeHtml(key)}
                            </div>

                            <div
                                style="
                                    font-size:12px;
                                    color:#334155;
                                    font-weight:600;
                                    text-transform:${key === "Priority"
                            ? "capitalize"
                            : "none"
                        };
                                    word-break:break-word;
                                "
                            >
                                ${escapeHtml(value)}
                            </div>

                        </div>
                    `
                )
                .join("");


        // Labels
        modalLabels.innerHTML =
            labelHtml(issue.labels);

    } catch (error) {

        modalTitle.textContent =
            "Something went wrong";

        modalDescription.textContent =
            error.message ||
            "Unable to load issue details.";

        modalMeta.innerHTML =
            "";

        modalLabels.innerHTML =
            "";

    }
}

//    CLOSE ISSUE MODAL

function closeIssueModal() {

    if (!modalBackdrop) {
        return;
    }

    modalBackdrop.style.display =
        "none";

    document.body.style.overflow =
        "";
}

if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeIssueModal
    );
}

if (modalBackdrop) {

    modalBackdrop.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modalBackdrop
            ) {

                closeIssueModal();
            }
        }
    );
}

//    NEW ISSUE MODAL

function openNewIssueModal() {

    if (!newIssueBackdrop) {
        return;
    }

    newIssueBackdrop.style.display =
        "flex";

    document.body.style.overflow =
        "hidden";
}

function closeNewIssueModalHandler() {

    if (!newIssueBackdrop) {
        return;
    }

    newIssueBackdrop.style.display =
        "none";

    document.body.style.overflow =
        "";
}

if (newIssueButton) {

    newIssueButton.addEventListener(
        "click",
        openNewIssueModal
    );
}

if (closeNewIssueModal) {

    closeNewIssueModal.addEventListener(
        "click",
        closeNewIssueModalHandler
    );
}

if (newIssueOkay) {

    newIssueOkay.addEventListener(
        "click",
        closeNewIssueModalHandler
    );
}

if (newIssueBackdrop) {

    newIssueBackdrop.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                newIssueBackdrop
            ) {

                closeNewIssueModalHandler();
            }
        }
    );
}

//    LOGOUT

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            sessionStorage.removeItem(
                "isLoggedIn"
            );

            window.location.replace(
                "./index.html"
            );
        }
    );
}

//    ESCAPE KEY

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        if (
            modalBackdrop &&
            modalBackdrop.style.display ===
            "flex"
        ) {

            closeIssueModal();

            return;
        }

        if (
            newIssueBackdrop &&
            newIssueBackdrop.style.display ===
            "flex"
        ) {

            closeNewIssueModalHandler();
        }
    }
);

//    RESPONSIVE DESIGN

function makeResponsive() {

    const grid =
        document.getElementById(
            "issuesGrid"
        );

    const navbar =
        document.getElementById(
            "navbar"
        );

    const navActions =
        document.getElementById(
            "navActions"
        );

    const searchBox =
        document.getElementById(
            "searchInput"
        );

    if (!grid) {
        return;
    }

    const width =
        window.innerWidth;

    // Mobile

    if (width < 700) {

        if (navbar) {

            navbar.style.flexDirection =
                "column";

            navbar.style.alignItems =
                "stretch";
        }

        if (navActions) {

            navActions.style.flexWrap =
                "wrap";

            navActions.style.justifyContent =
                "stretch";
        }

        if (searchBox) {

            searchBox.style.width =
                "auto";
        }

        grid.style.gridTemplateColumns =
            "1fr";
    }


    // Tablet

    else if (width < 1000) {

        if (navbar) {

            navbar.style.flexDirection =
                "row";

            navbar.style.alignItems =
                "center";
        }

        if (navActions) {

            navActions.style.flexWrap =
                "wrap";
        }

        grid.style.gridTemplateColumns =
            "repeat(2, minmax(0, 1fr))";
    }

    // Small Desktop 

    else if (width < 1250) {

        if (navbar) {

            navbar.style.flexDirection =
                "row";

            navbar.style.alignItems =
                "center";
        }

        grid.style.gridTemplateColumns =
            "repeat(3, minmax(0, 1fr))";
    }

    // Large Desktop

    else {

        if (navbar) {

            navbar.style.flexDirection =
                "row";

            navbar.style.alignItems =
                "center";
        }

        grid.style.gridTemplateColumns =
            "repeat(4, minmax(0, 1fr))";
    }
}

window.addEventListener(
    "resize",
    makeResponsive
);

//    INITIALIZE

updateTabStyles();

makeResponsive();

loadAllIssues();
