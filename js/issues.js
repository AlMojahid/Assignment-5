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

