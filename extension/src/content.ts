// runs on job pages
// detect page change, grab text, send to backend
// checks if extension is installed correctly, content script injecting properly,
// ts compiled right, and page data is accessible
console.log("AI Job Tracker active on:", window.location.href);

/*
-----------------------------------
RUN WHEN PAGE CHANGES
-----------------------------------
Used to re-run job detection
when navigating job boards
*/

function onPageChange() {

    console.log("Checking if new page is job posting");

    const pageText = document.body.innerText.toLowerCase();

    const jobSignals = [
        "job description",
        "responsibilities",
        "qualifications",
        "apply now",
        "about the role",
        "requirements"
    ];

    const isJobPage = jobSignals.some(signal =>
        pageText.includes(signal)
    );

    if (isJobPage) {
        console.log("Job page detected after navigation");
    }

}/*
-----------------------------------
DETECT FORM SUBMISSIONS
-----------------------------------
Many job applications end with a
form submission, so we detect this
to automatically track applications
*/

document.addEventListener("submit", (event) => {

    console.log("Form submission detected");

    extractAndSendJob();

});
/*
-----------------------------------
DETECT URL CHANGES (FOR REACT SITES)
-----------------------------------
Many job sites dynamically change
the page without reloading.
*/

let lastUrl = location.href;

const observer = new MutationObserver(() => {

    const currentUrl = location.href;

    if (currentUrl !== lastUrl) {

        lastUrl = currentUrl;

        console.log("Page changed:", currentUrl);

        onPageChange();
    }

});

observer.observe(document, { subtree: true, childList: true });
/*
-----------------------------------
DETECT APPLY BUTTON CLICKS
-----------------------------------
Listens for clicks on the page and
checks if the clicked element is
an "apply" button or link
*/

document.addEventListener("click", (event) => {

    const target = event.target as HTMLElement;

    if (!target) return;

    const elementText = target.innerText?.toLowerCase() || "";

    const applySignals = [
        "submit application",
        "submit",
        "apply now",
        "easy apply",
        "send application"
    ];

    const isApplyButton = applySignals.some(signal =>
        elementText.includes(signal)
    );



    if (isApplyButton) {

        console.log("Apply button detected");

        extractAndSendJob();

    }

});



/*
-----------------------------------
EXTRACT PAGE TEXT AND SEND TO AI
-----------------------------------
*/

function extractAndSendJob() {

    const pageText = document.body.innerText;
    chrome.runtime.sendMessage({
        type: "EXTRACT_JOB_WITH_AI",
        payload: {
            text: pageText,
            url: window.location.href
        }
    });

    console.log("Job sent to AI for extraction");

}