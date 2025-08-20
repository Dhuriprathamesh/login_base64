// DOM Elements
const welcomeName = document.getElementById('welcomeName');
const dateTimeDisplay = document.getElementById('dateTimeDisplay');
const notificationBtn = document.getElementById('notificationBtn');
const notificationBadge = document.getElementById('notificationBadge');
const userMenu = document.getElementById('userMenu');
const userMenuDropdown = document.getElementById('userMenuDropdown');
const logoutBtn = document.getElementById('logoutBtn');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadUserData();
    initializeNotifications();
    initializeCharts();
    loadRecentActivity();
    setupEventListeners();
});

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    dateTimeDisplay.textContent = now.toLocaleDateString('en-US', options);
}

// Load user data
function loadUserData() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
        welcomeName.textContent = userData.name;
        document.querySelector('.user-name').textContent = userData.name;
        document.querySelector('.user-email').textContent = userData.email;
    } else {
        window.location.href = '/login.html';
    }
}

// Initialize notifications
function initializeNotifications() {
    // Simulate notifications
    const notifications = [
        { id: 1, message: 'New message from John', time: '5 minutes ago' },
        { id: 2, message: 'Task deadline approaching', time: '1 hour ago' },
        { id: 3, message: 'System update available', time: '2 hours ago' }
    ];
    
    notificationBadge.textContent = notifications.length;
    
    // Create notification dropdown
    const notificationDropdown = document.createElement('div');
    notificationDropdown.className = 'notification-dropdown';
    notificationDropdown.innerHTML = notifications.map(notification => `
        <div class="notification-item">
            <p>${notification.message}</p>
            <span>${notification.time}</span>
        </div>
    `).join('');
    
    notificationBtn.parentElement.appendChild(notificationDropdown);
}

// Initialize charts
function initializeCharts() {
    // Activity Chart
    const activityCtx = document.getElementById('activityChart').getContext('2d');
    new Chart(activityCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Activity',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: '#3498db',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(52, 152, 219, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Progress', 'Pending'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Load recent activity
function loadRecentActivity() {
    const activities = [
        { icon: 'fas fa-user-plus', text: 'New user registered', time: '2 minutes ago' },
        { icon: 'fas fa-file-alt', text: 'Document updated', time: '1 hour ago' },
        { icon: 'fas fa-tasks', text: 'Task completed', time: '3 hours ago' },
        { icon: 'fas fa-comment', text: 'New comment received', time: '5 hours ago' }
    ];

    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <i class="${activity.icon}"></i>
            <div class="activity-info">
                <p>${activity.text}</p>
                <span>${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Notification toggle
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.querySelector('.notification-dropdown');
        dropdown.classList.toggle('show');
    });

    // User menu toggle
    userMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenuDropdown.classList.toggle('show');
    });

    // Sidebar toggle
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelector('.notification-dropdown')?.classList.remove('show');
        userMenuDropdown.classList.remove('show');
    });

    // Logout handler
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('userData');
        window.location.href = '/login.html';
    });

    // Quick action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
}

// Handle quick actions
function handleQuickAction(action) {
    switch(action) {
        case 'add-task':
            showModal('Add New Task', `
                <form id="taskForm">
                    <div class="form-group">
                        <label>Task Title</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea></textarea>
                    </div>
                    <div class="form-group">
                        <label>Due Date</label>
                        <input type="date" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Create Task</button>
                </form>
            `);
            break;
        case 'create-report':
            showModal('Generate Report', `
                <form id="reportForm">
                    <div class="form-group">
                        <label>Report Type</label>
                        <select required>
                            <option>Daily Activity</option>
                            <option>Weekly Summary</option>
                            <option>Monthly Overview</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date Range</label>
                        <input type="date" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Generate Report</button>
                </form>
            `);
            break;
        case 'send-message':
            showModal('Send Message', `
                <form id="messageForm">
                    <div class="form-group">
                        <label>Recipient</label>
                        <input type="email" required>
                    </div>
                    <div class="form-group">
                        <label>Message</label>
                        <textarea required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            `);
            break;
        case 'schedule-meeting':
            showModal('Schedule Meeting', `
                <form id="meetingForm">
                    <div class="form-group">
                        <label>Meeting Title</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Date & Time</label>
                        <input type="datetime-local" required>
                    </div>
                    <div class="form-group">
                        <label>Participants</label>
                        <input type="text" placeholder="Enter email addresses">
                    </div>
                    <button type="submit" class="btn btn-primary">Schedule Meeting</button>
                </form>
            `);
            break;
    }
}

// Show modal
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Handle form submissions
    const form = modal.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Handle form submission here
            modal.remove();
        });
    }
} 