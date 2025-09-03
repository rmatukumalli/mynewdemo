let isScrapingActive = false;
let scrapingInterval;
let jobCount = 0;
let pendingCount = 0;
let approvedCount = 0;
let publishedCount = 0;

const sampleJobs = [
    {
        title: "Senior Software Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        source: "iCIMS API",
        description: "Join our innovative team building next-generation software solutions..."
    },
    {
        title: "Data Analyst",
        company: "InnovateTech",
        location: "Remote",
        source: "careers.techcorp.com",
        description: "Analyze complex datasets to drive business insights and decision making..."
    },
    {
        title: "Frontend Developer",
        company: "StartupXYZ",
        location: "New York, NY",
        source: "iCIMS API",
        description: "Create beautiful, responsive web applications using modern frameworks..."
    },
    {
        title: "Product Manager",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        source: "jobs.innovatetech.com",
        description: "Lead product strategy and development for our flagship applications..."
    },
    {
        title: "DevOps Engineer",
        company: "CloudFirst",
        location: "Austin, TX",
        source: "iCIMS API",
        description: "Build and maintain scalable cloud infrastructure and deployment pipelines..."
    }
];

function addLogEntry(message, type = 'info') {
    const logContainer = document.getElementById('log-container');
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span> <span class="log-${type}">${message}</span>`;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function updateMetrics() {
    document.getElementById('jobs-found').textContent = jobCount;
    document.getElementById('jobs-pending').textContent = pendingCount;
    document.getElementById('jobs-approved').textContent = approvedCount;
    document.getElementById('jobs-published').textContent = publishedCount;
}

function startScraping() {
    if (isScrapingActive) return;
    
    isScrapingActive = true;
    document.getElementById('scraper-status').textContent = 'Scraping Active';
    // Ensure the correct panel is targeted for the scraping-active class
    const scraperConfigPanel = document.querySelector('.demo-container > .panel:first-child');
    if (scraperConfigPanel) {
        scraperConfigPanel.classList.add('scraping-active');
    }
    
    addLogEntry('🚀 Starting job scraping process...', 'info');
    addLogEntry('📡 Connecting to iCIMS API...', 'info');
    const keywords = document.getElementById('keywords').value;
    if (keywords) {
        addLogEntry(`🔍 Applying filters: ${keywords}`, 'info');
    }
    
    let progress = 0;
    const progressBar = document.getElementById('progress-fill');
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            addLogEntry('✅ Scraping completed successfully', 'info');
            setTimeout(() => {
                progress = 0;
                progressBar.style.width = '0%';
            }, 2000);
        }
        progressBar.style.width = progress + '%';
    }, 500);

    scrapingInterval = setInterval(() => {
        if (jobCount < sampleJobs.length) {
            const job = sampleJobs[jobCount];
            addJobToQueue(job);
            jobCount++;
            pendingCount++;
            updateMetrics();
            addLogEntry(`📥 Found job: ${job.title} at ${job.company}`, 'info');
        } else {
            // Stop interval if all sample jobs are processed
            stopScraping();
            addLogEntry('🏁 All sample jobs processed.', 'info');
        }
    }, 2000);

    setTimeout(() => {
        addLogEntry('🔗 Successfully connected to all job sources', 'info');
    }, 1000);
}

function stopScraping() {
    if (!isScrapingActive) return;
    
    isScrapingActive = false;
    clearInterval(scrapingInterval);
    document.getElementById('scraper-status').textContent = 'Stopped';
    const scraperConfigPanel = document.querySelector('.demo-container > .panel:first-child');
    if (scraperConfigPanel) {
        scraperConfigPanel.classList.remove('scraping-active');
    }
    document.getElementById('progress-fill').style.width = '0%';
    
    addLogEntry('⏹️ Scraping stopped', 'warning');
}

function testConnection() {
    addLogEntry('🔗 Testing connection to iCIMS API...', 'info');
    
    setTimeout(() => {
        addLogEntry('✅ Connection successful - API responding', 'info');
        addLogEntry('📊 Available endpoints: /jobs, /departments, /locations', 'info');
    }, 1500);
}

function addJobToQueue(job) {
    const queue = document.getElementById('job-queue');
    
    if (queue.children.length === 1 && queue.children[0].style.textAlign === 'center') {
        queue.innerHTML = ''; // Clear "No jobs in queue" message
    }

    const jobElement = document.createElement('div');
    jobElement.className = 'job-item';
    jobElement.innerHTML = `
        <div class="job-title">${job.title}</div>
        <div class="job-company">${job.company} <span class="integration-badge">${job.source}</span></div>
        <div class="job-location">📍 ${job.location}</div>
        <div class="job-actions">
            <button class="btn btn-secondary" onclick="approveJob(this)">✅ Approve</button>
            <button class="btn btn-danger" onclick="rejectJob(this)">❌ Reject</button>
            <button class="btn" onclick="viewJob(this)">👁️ View Details</button>
        </div>
    `;
    
    queue.appendChild(jobElement);
}

function approveJob(button) {
    const jobItem = button.closest('.job-item');
    const jobTitle = jobItem.querySelector('.job-title').textContent;
    
    jobItem.style.background = '#f0fff4';
    jobItem.style.borderLeft = '4px solid #48bb78';
    
    button.textContent = '✅ Approved';
    button.disabled = true;
    button.style.opacity = '0.6';
    
    // Disable other buttons in the same job item
    const otherButtons = jobItem.querySelectorAll('.job-actions button');
    otherButtons.forEach(btn => {
        if (btn !== button) {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        }
    });
    
    pendingCount--;
    approvedCount++;
    updateMetrics();
    
    addLogEntry(`✅ Approved: ${jobTitle}`, 'info');
    
    setTimeout(() => {
        publishedCount++;
        approvedCount--; // Job moves from approved to published
        updateMetrics();
        addLogEntry(`📢 Published: ${jobTitle}`, 'info');
        
        setTimeout(() => {
            jobItem.remove();
            if (document.getElementById('job-queue').children.length === 0) {
                document.getElementById('job-queue').innerHTML = '<div style="text-align: center; padding: 40px; color: #a0aec0;">No jobs in queue. Start scraping to see results here.</div>';
            }
        }, 1000);
    }, 2000);
}

function rejectJob(button) {
    const jobItem = button.closest('.job-item');
    const jobTitle = jobItem.querySelector('.job-title').textContent;
    
    jobItem.style.background = '#fff5f5';
    jobItem.style.borderLeft = '4px solid #f56565';

    // Disable all buttons in the same job item
    const allButtons = jobItem.querySelectorAll('.job-actions button');
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
    });
    
    pendingCount--;
    updateMetrics();
    
    addLogEntry(`❌ Rejected: ${jobTitle}`, 'warning');
    
    setTimeout(() => {
        jobItem.remove();
        if (document.getElementById('job-queue').children.length === 0) {
            document.getElementById('job-queue').innerHTML = '<div style="text-align: center; padding: 40px; color: #a0aec0;">No jobs in queue. Start scraping to see results here.</div>';
        }
    }, 1000);
}

function viewJob(button) {
    const jobItem = button.closest('.job-item');
    const jobTitle = jobItem.querySelector('.job-title').textContent;
    // Find the job data from sampleJobs to show more details if needed
    const jobData = sampleJobs.find(job => job.title === jobTitle && job.company === jobItem.querySelector('.job-company').textContent.split(' ')[0]);
    
    let alertMessage = `Viewing detailed job posting for: ${jobTitle}\n\nCompany: ${jobData.company}\nLocation: ${jobData.location}\nSource: ${jobData.source}\n\nDescription: ${jobData.description}\n\nIn a real implementation, this would open a detailed view with full job description, requirements, application process, and integration metadata.`;
    alert(alertMessage);
}

// Initialize demo
document.addEventListener('DOMContentLoaded', () => {
    updateMetrics();
    
    // Add some periodic activity to make the demo feel alive
    setInterval(() => {
        if (!isScrapingActive && Math.random() < 0.3) {
            const activities = [
                'System health check completed',
                'Connection to iCIMS API verified',
                'Monitoring job board changes...',
                'Cache updated with latest job data'
            ];
            addLogEntry(activities[Math.floor(Math.random() * activities.length)], 'info');
        }
    }, 10000);
});
