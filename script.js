// Create the entire UI dynamically
document.body.style.cssText = "font-family: Arial, sans-serif; background: #f4f4f4; text-align: center; margin: 0; padding: 0;";

const container = document.createElement("div");
container.style.cssText = "width: 90%; max-width: 600px; background: white; margin: 20px auto; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);";
document.body.appendChild(container);

const title = document.createElement("h1");
title.textContent = "Website Monitoring Dashboard";
container.appendChild(title);

const inputSection = document.createElement("div");
inputSection.innerHTML = `
    <label for="website-url">Enter Website URL:</label>
    <input type="text" id="website-url" placeholder="https://example.com" style="width: 70%; padding: 8px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px;">
    <button id="start-btn" style="background-color: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">Start Monitoring</button>
`;
container.appendChild(inputSection);

const statusSection = document.createElement("div");
statusSection.innerHTML = `
    <p>Status: <span id="status" style="font-weight: bold; color: black;">N/A</span></p>
    <p>Response Time: <span id="response-time">N/A</span></p>
    <p>Uptime Percentage: <span id="uptime">0%</span></p>
`;
container.appendChild(statusSection);

const chartContainer = document.createElement("div");
chartContainer.style.cssText = "width: 100%; height: 300px;";
chartContainer.innerHTML = `<h3>Response Time Chart</h3><canvas id="responseChart"></canvas>`;
container.appendChild(chartContainer);

const logSection = document.createElement("div");
logSection.innerHTML = `<h3>Incident Log</h3><ul id="incident-log" style="list-style-type: none; padding: 0;"></ul>`;
container.appendChild(logSection);

// Load Chart.js
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
document.head.appendChild(script);

// Monitoring Variables
let websiteURL = "";
let checks = 0, uptimeCount = 0;
let responseTimes = [];
let monitorInterval;

// Initialize Chart.js after loading
script.onload = () => {
    const ctx = document.getElementById("responseChart").getContext("2d");
    window.responseChart = new Chart(ctx, {
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
};

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

    window.responseChart.data.labels.push(currentTime);
    window.responseChart.data.datasets[0].data.push(responseTime);

    if (window.responseChart.data.labels.length > 10) {
        window.responseChart.data.labels.shift();
        window.responseChart.data.datasets[0].data.shift();
    }

    window.responseChart.update();
}

// Log Incidents
function logIncident() {
    const incidentLog = document.getElementById("incident-log");
    const listItem = document.createElement("li");
    listItem.textContent = `Website Down at ${new Date().toLocaleTimeString()}`;
    listItem.style.cssText = "background: #ffcccc; margin: 5px 0; padding: 8px; border-radius: 5px;";
    incidentLog.appendChild(listItem);
}

// Calculate Uptime
function updateUptime(isOnline) {
    checks++;
    if (isOnline) uptimeCount++;

    const uptimePercentage = ((uptimeCount / checks) * 100).toFixed(2);
    document.getElementById("uptime").textContent = `${uptimePercentage}%`;
}
