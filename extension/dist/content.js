"use strict";
//runs on job pages 
// detect page change, grab text, send to backend 
//checks if extension is installed correctly, content script injecting properly, ts compiled right, and page data is accessible 
console.log("AI Job Tracker active on: ", window.location.href);
//creating button for saving job 
const button = document.createElement("button");
button.innerText = "Save Job";
button.style.position = "fixed";
button.style.bottom = "20px";
button.style.right = "20px";
button.style.padding = "10px 15px";
button.style.backgroundColor = "#4CAF50";
button.style.color = "white";
button.style.border = "none";
button.style.borderRadius = "8px";
button.style.cursor = "pointer";
button.style.zIndex = "9999";
document.body.appendChild(button);
// sending job data when clicked
//grabbing page title, url, and placeholder company and send to bkg 
button.addEventListener("click", () => {
    const titleElement = document.querySelector("h1");
    const companyElement = document.querySelector('a[href*="/employers/"]');
    const locationElement = Array.from(document.querySelectorAll("div"))
        .find(div => div.textContent?.includes(","));
    const jobData = {
        title: titleElement?.textContent?.trim() || document.title,
        company: companyElement?.textContent?.trim() || "Unknown",
        location: locationElement?.textContent?.trim() || "Unknown",
        url: window.location.href,
        status: "Applied"
    };
    chrome.runtime.sendMessage({
        type: "SAVE_JOB",
        payload: jobData
    });
    alert("Job Saved!");
});
//sending message to background script of page loaded 
//chrome.runtime.sendMessage({
//  type: "PAGE_LOADED",
//url: window.location.href
//});
