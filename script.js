// Monitoring Variables
let websiteURL = "";
let checks = 0, uptimeCount = 0;
let responseTimes = [];
let monitorInterval;

// Initialize Chart.js
const ctx = document.getElementById("responseChart").getContext("2d");
const responseChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Response Time (ms)",
            data: responseTimes,
            borderColor: "blue",
            fill: false,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } }
    }
});

// Start Monitoring
document.getElementById("start-btn").addEventListener("click", () => {
    const inputURL = document.getElementById("website-url").value.trim();
    
    if (!inputURL) {
        alert("Please enter a website URL!");
        return;
    }

    websiteURL = inputURL;
    clearInterval(monitorInterval);
    monitorInterval = setInterval(checkWebsite, 10000);
    checkWebsite();
});

// Check Website Status
async function checkWebsite() {
    if (!websiteURL) return;

    const startTime = performance.now();
    let statusText = "", statusColor = "black", responseTime = 0;

    try {
        const response = await fetch(websiteURL, { method: "GET", mode: "cors" });
        const endTime = performance.now();
        responseTime = Math.round(endTime - startTime);

        statusText = "Online ✅";
        statusColor = responseTime > 1000 ? "orange" : "green";
        document.getElementById("response-time").textContent = `${responseTime} ms`;

        updateUptime(true);
    } catch (error) {
        statusText = "Down ❌";
        statusColor = "red";
        responseTime = 0;

        logIncident();
        updateUptime(false);
    }

    document.getElementById("status").textContent = statusText;
    document.getElementById("status").style.color = statusColor;

    updateChart(responseTime);
}

// Update Chart
function updateChart(responseTime) {
    const currentTime = new Date().toLocaleTimeString();

    responseChart.data.labels.push(currentTime);
    responseChart.data.datasets[0].data.push(responseTime);

    if (responseChart.data.labels.length > 10) {
        responseChart.data.labels.shift();
        responseChart.data.datasets[0].data.shift();
    }

    responseChart.update();
}

// Log Incidents
function logIncident() {
    const incidentLog = document.getElementById("incident-log");
    const listItem = document.createElement("li");
    listItem.textContent = `Website Down at ${new Date().toLocaleTimeString()}`;
    incidentLog.appendChild(listItem);
}

// Calculate Uptime
function updateUptime(isOnline) {
    checks++;
    if (isOnline) uptimeCount++;

    const uptimePercentage = ((uptimeCount / checks) * 100).toFixed(2);
    document.getElementById("uptime").textContent = `${uptimePercentage}%`;
}
