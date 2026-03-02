//listening for messages from content script and logs them 
//chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //  console.log("Message received: ", message)
//})
interface Job {
  title: string;
  url: string;
  company: string;
  location: string;
  status: string;
}
//save to chrome local storage persistent data 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_JOB") {
    console.log("Saving job:", message.payload);  // <-- THIS LINE

    const newJob: Job = message.payload;

    chrome.storage.local.get(["jobs"], (result) => {
      const jobs = (result.jobs as Job[]) || [];
      jobs.push(newJob);

      chrome.storage.local.set({ jobs }, () => {
        console.log("Job saved successfully");
      });
    });
  }
});