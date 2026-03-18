let currentFilter = "All";
let currentSearch = "";
async function loadJobs() {
    try {
        const res = await fetch("http://localhost:8000/jobs");
        const jobs = await res.json();

        const container = document.getElementById("jobs");
        if (!container) return;

        container.innerHTML = "";

        jobs.forEach((job) => {
            // filtering 
            if (currentFilter !== "All" && job.status !== currentFilter) {
                return;
            }
            //searching 
            const text = `${job.title} ${job.company} ${job.location}`.toLowerCase();
            if (!text.includes(currentSearch.toLowerCase())) {
                return;
            }

            const div = document.createElement("div");
            div.className = "job";

            div.innerHTML = `
        <div class="title">${job.title}</div>
        <div class="meta">${job.company} - ${job.location}</div>

        <a href="${job.url}" target="_blank">View Job</a><br/>

        <select data-id="${job.id}">
          <option ${job.status === "Applied" ? "selected" : ""}>Applied</option>
          <option ${job.status === "Interview" ? "selected" : ""}>Interview</option>
          <option ${job.status === "Offer" ? "selected" : ""}>Offer</option>
          <option ${job.status === "Rejected" ? "selected" : ""}>Rejected</option>
        </select>

        <button class="delete-btn" data-id="${job.id}">Delete</button>
      `;

            container.appendChild(div);
        });

    } catch (err) {
        console.error("Error loading jobs:", err);
    }
}

//updating status of job 
document.addEventListener("change", async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLSelectElement)) return;

    // ignore filter dropdown
    if (target.id === "filter") return;

    const jobId = target.getAttribute("data-id");
    const newStatus = target.value;

    await fetch(`http://localhost:8000/jobs/${jobId}?status=${newStatus}`, {
        method: "PUT"
    });

    console.log("Status updated");

    loadJobs();
});

// deleting job 
document.addEventListener("click", async (e) => {
    const target = e.target;

    if (!(target instanceof HTMLButtonElement)) return;
    if (!target.classList.contains("delete-btn")) return;

    const jobId = target.getAttribute("data-id");

    await fetch(`http://localhost:8000/jobs/${jobId}`, {
        method: "DELETE"
    });

    console.log("Job deleted");

    loadJobs(); // refresh UI
});

// filter change 
document.getElementById("filter").addEventListener("change", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLSelectElement)) return;

    currentFilter = target.value;
    loadJobs();
});

//searching 
document.getElementById("search").addEventListener("input", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLInputElement)) return;

  currentSearch = target.value;
  loadJobs();
});

// INITIAL LOAD
loadJobs();