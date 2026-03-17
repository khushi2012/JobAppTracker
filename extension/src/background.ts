//listening for messages from content script and logs them 
//chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//  console.log("Message received: ", message)
//})
interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
  status: string;
}

chrome.runtime.onMessage.addListener(async (message) => {

  if (message.type === "EXTRACT_JOB_WITH_AI") {

    const pageText = message.payload.text;
    const url = message.payload.url;

    // send job text to AI model
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

    const aiOutput = await response.json();
    if (aiOutput.error) {
      console.log("Not a job page, skipping...");
      return;
    }

    const newJob: Job = {
      title: aiOutput.title,
      company: aiOutput.company,
      location: aiOutput.location,
      url,
      status: "Applied"
    };

    chrome.storage.local.get(["jobs"], (result) => {

      const jobs = (result.jobs as Job[]) || [];

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

});
