const websiteURL = "https://example.com";  // Change to the website you want to monitor

async function checkWebsite() {
    const startTime = performance.now();
    
    try {
        const response = await fetch(websiteURL, { method: "GET", mode: "no-cors" });
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        
        document.getElementById("status").textContent = "Online ✅";
        document.getElementById("status").style.color = "green";
        document.getElementById("response-time").textContent = `${responseTime} ms`;

        updateChart(responseTime);
        updateUptime(true);
    } catch (error) {
        document.getElementById("status").textContent = "Down ❌";
        document.getElementById("status").style.color = "red";
        document.getElementById("response-time").textContent = "N/A";

        logIncident();
        updateUptime(false);
    }
}

// Update chart with response time
let responseTimes = [];
let responseChart = new Chart(document.getElementById("responseChart"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Response Time (ms)",
            data: responseTimes,
            borderColor: "blue",
            fill: false
        }]
    }
});

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

// Store incidents
function logIncident() {
    const incidentLog = document.getElementById("incident-log");
    const listItem = document.createElement("li");
    listItem.textContent = `Website Down at ${new Date().toLocaleTimeString()}`;
    incidentLog.appendChild(listItem);
}

// Uptime calculation
let checks = 0, uptimeCount = 0;
function updateUptime(isOnline) {
    checks++;
    if (isOnline) uptimeCount++;
    
    const uptimePercentage = ((uptimeCount / checks) * 100).toFixed(2);
    document.getElementById("uptime").textContent = `${uptimePercentage}%`;
}

// Run check every 10 seconds
setInterval(checkWebsite, 10000);
