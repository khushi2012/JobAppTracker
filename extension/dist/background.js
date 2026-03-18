"use strict";
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "EXTRACT_JOB_WITH_AI") {
        (async () => {
            console.log("✅ Message received in background");
            const pageText = message.payload.text;
            const url = message.payload.url;
            try {
                console.log("Sending request to backend...");
                const response = await fetch("http://localhost:8000/extract-job", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: pageText,
                        url: url
                    })
                });
                console.log("Response status:", response.status);
                const aiOutput = await response.json();
                console.log("AI OUTPUT:", aiOutput);
                if (aiOutput.error) {
                    console.log("Not a job page, skipping...");
                    return;
                }
                const newJob = {
                    title: aiOutput.title,
                    company: aiOutput.company,
                    location: aiOutput.location,
                    url,
                    status: "Applied"
                };
                chrome.storage.local.get(["jobs"], (result) => {
                    const jobs = result.jobs || [];
                    const alreadySaved = jobs.some(job => job.url === newJob.url);
                    if (alreadySaved) {
                        console.log("Job already saved");
                        return;
                    }
                    jobs.push(newJob);
                    chrome.storage.local.set({ jobs }, () => {
                        console.log("AI job saved:", newJob);
                    });
                });
            }
            catch (err) {
                console.error("❌ FETCH ERROR:", err);
            }
        })();
    }
    return true;
});
