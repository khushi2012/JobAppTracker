"use strict";
async function loadJobs() {
    const res = await fetch("http://localhost:8000/jobs");
    const jobs = await res.json();
    const container = document.getElementById("jobs");
    if (!container)
        return;
    container.innerHTML = "";
    jobs.forEach((job) => {
        const div = document.createElement("div");
        div.className = "job";
        container.appendChild(div);
        div.innerHTML = `
  <div class="title">${job.title}</div>
  <div>${job.company} - ${job.location}</div>
  <a href="${job.url}" target="_blank">View Job</a><br/>

  <select data-id="${job.id}">
    <option ${job.status === "Applied" ? "selected" : ""}>Applied</option>
    <option ${job.status === "Interview" ? "selected" : ""}>Interview</option>
    <option ${job.status === "Offer" ? "selected" : ""}>Offer</option>
    <option ${job.status === "Rejected" ? "selected" : ""}>Rejected</option>
  </select>
`;
    });
}
document.addEventListener("change", async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLSelectElement))
        return;
    const jobId = target.getAttribute("data-id");
    const newStatus = target.value;
    await fetch(`http://localhost:8000/jobs/${jobId}?status=${newStatus}`, {
        method: "PUT"
    });
    console.log("Status updated");
});
loadJobs();
