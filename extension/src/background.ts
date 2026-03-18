// Generate or get user ID
async function getUserId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["userId"], (result) => {
      if (result.userId) {
        resolve(result.userId);
      } else {
        const newId = crypto.randomUUID();
        chrome.storage.local.set({ userId: newId }, () => {
          resolve(newId);
        });
      }
    });
  });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "EXTRACT_JOB_WITH_AI") {

    (async () => {
      console.log("✅ Message received in background");

      const pageText = message.payload.text;
      const url = message.payload.url;

      try {
        const userId = await getUserId();
        console.log("User ID:", userId);

        console.log("Sending request to backend...");

        const response = await fetch("http://localhost:8000/extract-job", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: pageText,
            url: url,
            userId: userId   // ✅ IMPORTANT
          })
        });

        console.log("Response status:", response.status);

        const aiOutput = await response.json();
        console.log("AI OUTPUT:", aiOutput);

        if (aiOutput.error) {
          console.log("Not a job page, skipping...");
          return;
        }

        console.log("✅ Job saved to DB");

      } catch (err) {
        console.error("❌ FETCH ERROR:", err);
      }

    })();
  }

  return true;
});