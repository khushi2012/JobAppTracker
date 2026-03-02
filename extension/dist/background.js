"use strict";
//save to chrome local storage persistent data 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SAVE_JOB") {
        console.log("Saving job:", message.payload); // <-- THIS LINE
        const newJob = message.payload;
        chrome.storage.local.get(["jobs"], (result) => {
            const jobs = result.jobs || [];
            jobs.push(newJob);
            chrome.storage.local.set({ jobs }, () => {
                console.log("Job saved successfully");
            });
        });
    }
});
