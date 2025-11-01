// ClearPath - Real-time Ambulance Priority System
// Main JavaScript functionality

class ClearPathSystem {
    constructor() {
        this.isEmergencyActive = false;
        this.ambulancePosition = 0; // Percentage along route
        this.currentSpeed = 0;
        this.maxSpeed = 0;
        this.distanceTraveled = 0;
        this.eta = '--:--';
        this.etaDestination = '--:--';
        this.severityCode = '--';
        this.patientStatus = '--';
        this.routeProgress = 0;
        this.currentPhase = 'Standby'; // Standby, Going to Emergency, At Emergency, Returning
        this.intersections = ['A', 'B', 'C'];
        this.alerts = [];
        this.notifications = [];
        this.analytics = {
            responseTime: 2.3,
            routeEfficiency: 94,
            successRate: 97,
            officerResponse: 1.8
        };
        
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.socket = null;
        
        this.initializeEventListeners();
        this.initializeChart();
        this.initializeWebSocket();
        this.startRealTimeUpdates();
    }

    initializeEventListeners() {
        // Navigation menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Add offset for fixed navbar
                        const offsetTop = targetElement.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }

        // Scroll indicator click handler
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                scrollToSection('demo');
            });
        }
    }

    initializeChart() {
        const ctx = document.getElementById('responseChart');
        if (!ctx) return;

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Response Time (minutes)',
                    data: [3.2, 2.8, 2.5, 2.3, 2.1, 2.3],
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Target Response Time',
                    data: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
                    borderColor: '#7ed321',
                    backgroundColor: 'rgba(126, 211, 33, 0.1)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 3,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Response Time Trends',
                        font: {
                            size: 14
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Time (min)',
                            font: {
                                size: 10
                            }
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Month',
                            font: {
                                size: 10
                            }
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }

    initializeWebSocket() {
        // Initialize Socket.IO connection
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Connected to ClearPath backend');
        });
        
        this.socket.on('disconnect', () => {
            console.log('Disconnected from ClearPath backend');
        });
        
        this.socket.on('status_update', (data) => {
            this.updateSystemStatus(data);
        });
        
        this.socket.on('emergency_triggered', (data) => {
            this.handleEmergencyTriggered(data);
        });
        
        this.socket.on('emergency_reset', (data) => {
            this.handleEmergencyReset(data);
        });
        
        this.socket.on('new_alert', (alert) => {
            this.handleNewAlert(alert);
        });
        
        this.socket.on('new_notification', (notification) => {
            this.handleNewNotification(notification);
        });
        
        this.socket.on('signal_preempted', (data) => {
            this.handleSignalPreempted(data);
        });
        
        this.socket.on('ambulance_position_update', (data) => {
            this.handleAmbulancePositionUpdate(data);
        });
        
        this.socket.on('analytics_update', (data) => {
            this.handleAnalyticsUpdate(data);
        });
    }

    startRealTimeUpdates() {
        // Update time every second
        setInterval(() => {
            this.updateTime();
        }, 1000);

        // Simulate real-time data updates
        setInterval(() => {
            if (this.isEmergencyActive) {
                this.updateAmbulancePosition();
                this.updateTrafficSignals();
            }
        }, 2000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Update any time displays if needed
        const timeElements = document.querySelectorAll('.current-time');
        timeElements.forEach(element => {
            element.textContent = timeString;
        });
    }

    async triggerEmergency() {
        if (this.isEmergencyActive) {
            await this.resetDemo();
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/emergency/trigger`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                this.isEmergencyActive = true;
                this.updateEmergencyStatus();
                
                // Update button
                const emergencyBtn = document.getElementById('emergencyBtn');
                if (emergencyBtn) {
                    emergencyBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Emergency';
                    emergencyBtn.classList.add('btn-secondary');
                    emergencyBtn.classList.remove('btn-emergency');
                }
            } else {
                console.error('Failed to trigger emergency:', data.message);
            }
        } catch (error) {
            console.error('Error triggering emergency:', error);
        }
    }

    async resetDemo() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/emergency/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                this.isEmergencyActive = false;
                this.ambulancePosition = 30;
                this.currentSpeed = 0;
                this.eta = '--:--';
                this.severityCode = '--';
                this.alerts = [];
                this.notifications = [];

                // Reset UI
                this.updateEmergencyStatus();
                this.resetTrafficSignals();
                this.clearAlerts();
                this.resetAmbulancePosition();
                
                // Update button
                const emergencyBtn = document.getElementById('emergencyBtn');
                if (emergencyBtn) {
                    emergencyBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Trigger Emergency';
                    emergencyBtn.classList.remove('btn-secondary');
                    emergencyBtn.classList.add('btn-emergency');
                }
            } else {
                console.error('Failed to reset emergency:', data.message);
            }
        } catch (error) {
            console.error('Error resetting emergency:', error);
        }
    }

    updateEmergencyStatus() {
        const statusElements = {
            emergencyStatus: this.isEmergencyActive ? 'Active' : 'Inactive',
            currentSpeed: `${this.currentSpeed} km/h`,
            maxSpeed: `${this.maxSpeed} km/h`,
            distanceTraveled: `${this.distanceTraveled.toFixed(1)} km`,
            eta: this.eta,
            etaDestination: this.etaDestination,
            severityCode: this.severityCode,
            patientStatus: this.patientStatus,
            routeProgress: `${this.routeProgress}%`
        };

        Object.entries(statusElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                if (id === 'emergencyStatus' && this.isEmergencyActive) {
                    element.classList.add('emergency');
                } else {
                    element.classList.remove('emergency');
                }
            }
        });

        // Update current phase
        const phaseElement = document.getElementById('currentPhase');
        if (phaseElement) {
            phaseElement.textContent = this.currentPhase;
        }

        // Update ambulance info
        const ambulanceInfo = document.getElementById('ambulanceInfo');
        if (ambulanceInfo) {
            ambulanceInfo.textContent = `Position: ${this.routeProgress}%`;
        }
    }

    startEmergencySequence() {
        // Simulate the emergency response sequence
        setTimeout(() => this.sendOfficerAlert('A'), 1000);
        setTimeout(() => this.sendDriverNotification('A'), 1500);
        setTimeout(() => this.preemptSignal('A'), 2000);
        
        setTimeout(() => this.sendOfficerAlert('B'), 3000);
        setTimeout(() => this.sendDriverNotification('B'), 3500);
        setTimeout(() => this.preemptSignal('B'), 4000);
        
        setTimeout(() => this.sendOfficerAlert('C'), 5000);
        setTimeout(() => this.sendDriverNotification('C'), 5500);
        setTimeout(() => this.preemptSignal('C'), 6000);
    }

    sendOfficerAlert(intersection) {
        const alert = {
            id: Date.now(),
            intersection: intersection,
            message: `Ambulance approaching Junction ${intersection} - Clear left lanes and hold cross traffic`,
            timestamp: new Date(),
            status: 'pending'
        };

        this.alerts.push(alert);
        this.updateAlertsDisplay();
    }

    sendDriverNotification(intersection) {
        const notification = {
            id: Date.now(),
            intersection: intersection,
            message: `Emergency vehicle approaching Junction ${intersection} - Move left when safe. ETA 2 minutes`,
            timestamp: new Date(),
            type: 'driver'
        };

        this.notifications.push(notification);
        this.updateNotificationsDisplay();
    }

    preemptSignal(intersection) {
        const signalElement = document.getElementById(`signal${intersection}`);
        const statusElement = document.getElementById(`status${intersection}`);
        const mapIntersection = document.getElementById(`mapIntersection${intersection}`);

        if (signalElement && statusElement) {
            // Change signal to green
            const lights = signalElement.querySelectorAll('.light');
            lights.forEach(light => light.classList.remove('red', 'yellow', 'green'));
            lights[2].classList.add('green'); // Green light

            statusElement.textContent = 'Preempted';
            statusElement.classList.add('preempted');
        }

        if (mapIntersection) {
            mapIntersection.classList.add('cleared');
        }
    }

    updateAlertsDisplay() {
        const container = document.getElementById('alertsContainer');
        if (!container) return;

        if (this.alerts.length === 0) {
            container.innerHTML = '<div class="no-alerts">No active alerts</div>';
            return;
        }

        container.innerHTML = this.alerts.map(alert => `
            <div class="alert-item">
                <div class="alert-header">
                    <strong>Junction ${alert.intersection}</strong>
                    <span class="alert-time">${alert.timestamp.toLocaleTimeString()}</span>
                </div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-actions">
                    <button class="btn btn-sm btn-primary" onclick="clearPathSystem.acknowledgeAlert(${alert.id})">
                        Acknowledge
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateNotificationsDisplay() {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;

        if (this.notifications.length === 0) {
            container.innerHTML = '<div class="no-notifications">No active notifications</div>';
            return;
        }

        container.innerHTML = this.notifications.map(notification => `
            <div class="notification-item">
                <div class="notification-header">
                    <strong>Driver Alert - Junction ${notification.intersection}</strong>
                    <span class="notification-time">${notification.timestamp.toLocaleTimeString()}</span>
                </div>
                <div class="notification-message">${notification.message}</div>
            </div>
        `).join('');
    }

    async acknowledgeAlert(alertId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/alerts/${alertId}/acknowledge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                const alert = this.alerts.find(a => a.id == alertId);
                if (alert) {
                    alert.status = 'acknowledged';
                    this.updateAlertsDisplay();
                }
            } else {
                console.error('Failed to acknowledge alert:', data.message);
            }
        } catch (error) {
            console.error('Error acknowledging alert:', error);
        }
    }

    clearAlerts() {
        this.alerts = [];
        this.notifications = [];
        this.updateAlertsDisplay();
        this.updateNotificationsDisplay();
    }

    resetTrafficSignals() {
        this.intersections.forEach(intersection => {
            const signalElement = document.getElementById(`signal${intersection}`);
            const statusElement = document.getElementById(`status${intersection}`);
            const mapIntersection = document.getElementById(`mapIntersection${intersection}`);

            if (signalElement && statusElement) {
                const lights = signalElement.querySelectorAll('.light');
                lights.forEach(light => light.classList.remove('red', 'yellow', 'green'));
                lights[0].classList.add('red'); // Red light

                statusElement.textContent = 'Normal';
                statusElement.classList.remove('preempted');
            }

            if (mapIntersection) {
                mapIntersection.classList.remove('cleared');
            }
        });
    }

    updateAmbulancePosition() {
        if (this.isEmergencyActive) {
            // Simulate round trip: 0-50% going to emergency, 50-100% returning
            if (this.routeProgress < 50) {
                // Going to emergency
                this.currentPhase = 'Going to Emergency';
                this.routeProgress += 2;
                this.currentSpeed = 65 + Math.random() * 10;
                this.maxSpeed = Math.max(this.maxSpeed, this.currentSpeed);
                this.distanceTraveled = (this.routeProgress / 100) * 6.8; // 6.8km to emergency
                this.etaDestination = this.calculateETA(this.routeProgress, 50);
            } else if (this.routeProgress < 100) {
                // Returning to hospital
                this.currentPhase = 'Returning to Hospital';
                this.routeProgress += 2;
                this.currentSpeed = 60 + Math.random() * 8;
                this.maxSpeed = Math.max(this.maxSpeed, this.currentSpeed);
                this.distanceTraveled = 6.8 + ((this.routeProgress - 50) / 50) * 6.8; // Total 13.6km
                this.eta = this.calculateETA(this.routeProgress - 50, 50);
            } else {
                // Complete
                this.currentPhase = 'Mission Complete';
                this.currentSpeed = 0;
                this.routeProgress = 100;
                this.distanceTraveled = 13.6;
                this.eta = '0:00';
                this.etaDestination = '0:00';
            }
            
            this.updateAmbulanceUI();
        }
    }

    calculateETA(progress, total) {
        const remaining = total - progress;
        const timeMinutes = Math.round((remaining / 2) * 2); // 2 minutes per 2% progress
        return `${Math.floor(timeMinutes / 60)}:${(timeMinutes % 60).toString().padStart(2, '0')}`;
    }

    updateAmbulanceUI() {
        const ambulanceElement = document.getElementById('ambulancePoint');
        const mapAmbulance = document.getElementById('demoAmbulance');
        
        // Calculate position based on route progress
        let position = this.routeProgress;
        if (this.routeProgress > 50) {
            // Returning phase - reverse the position
            position = 100 - this.routeProgress;
        }
        
        if (ambulanceElement) {
            ambulanceElement.style.left = `${position}%`;
        }
        
        if (mapAmbulance) {
            mapAmbulance.style.left = `${position}%`;
            if (this.routeProgress > 0) {
                mapAmbulance.classList.add('moving');
            }
        }

        // Update emergency status with all new data
        this.updateEmergencyStatus();
    }

    resetAmbulancePosition() {
        this.ambulancePosition = 0;
        this.routeProgress = 0;
        this.currentSpeed = 0;
        this.maxSpeed = 0;
        this.distanceTraveled = 0;
        this.currentPhase = 'Standby';
        this.updateAmbulanceUI();
        
        const mapAmbulance = document.getElementById('demoAmbulance');
        if (mapAmbulance) {
            mapAmbulance.classList.remove('moving');
        }
    }

    updateTrafficSignals() {
        // Simulate dynamic traffic signal changes during emergency
        if (this.isEmergencyActive && Math.random() > 0.7) {
            const randomIntersection = this.intersections[Math.floor(Math.random() * this.intersections.length)];
            this.preemptSignal(randomIntersection);
        }
    }

    async handleContactForm() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            organization: document.getElementById('organization').value,
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                alert(data.message);
                document.getElementById('contactForm').reset();
            } else {
                alert('Error submitting form. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('Error submitting form. Please try again.');
        }
    }

    // WebSocket event handlers
    updateSystemStatus(data) {
        this.isEmergencyActive = data.emergency_active;
        this.ambulancePosition = data.ambulance_position;
        this.currentSpeed = data.current_speed;
        this.eta = data.eta;
        this.severityCode = data.severity_code;
        this.alerts = data.alerts || [];
        this.notifications = data.notifications || [];
        
        this.updateEmergencyStatus();
        this.updateAlertsDisplay();
        this.updateNotificationsDisplay();
    }

    handleEmergencyTriggered(data) {
        this.updateSystemStatus(data);
    }

    handleEmergencyReset(data) {
        this.updateSystemStatus(data);
        this.resetTrafficSignals();
        this.clearAlerts();
        this.resetAmbulancePosition();
    }

    handleNewAlert(alert) {
        this.alerts.push(alert);
        this.updateAlertsDisplay();
    }

    handleNewNotification(notification) {
        this.notifications.push(notification);
        this.updateNotificationsDisplay();
    }

    handleSignalPreempted(data) {
        const signalElement = document.getElementById(`signal${data.signal_id}`);
        const statusElement = document.getElementById(`status${data.signal_id}`);
        const mapIntersection = document.getElementById(`mapIntersection${data.signal_id}`);

        if (signalElement && statusElement) {
            const lights = signalElement.querySelectorAll('.light');
            lights.forEach(light => light.classList.remove('red', 'yellow', 'green'));
            lights[2].classList.add('green');

            statusElement.textContent = 'Preempted';
            statusElement.classList.add('preempted');
        }

        if (mapIntersection) {
            mapIntersection.classList.add('cleared');
        }
    }

    handleAmbulancePositionUpdate(data) {
        this.ambulancePosition = data.position;
        this.currentSpeed = data.speed;
        this.updateAmbulanceUI();
    }

    handleAnalyticsUpdate(data) {
        this.analytics = data;
        this.updateAnalyticsDisplay();
    }

    updateAnalyticsDisplay() {
        // Update analytics cards with new data
        const responseTimeElement = document.querySelector('.metric-card:nth-child(1) .metric-value');
        const routeEfficiencyElement = document.querySelector('.metric-card:nth-child(2) .metric-value');
        const successRateElement = document.querySelector('.metric-card:nth-child(3) .metric-value');
        const officerResponseElement = document.querySelector('.metric-card:nth-child(4) .metric-value');

        if (responseTimeElement) responseTimeElement.textContent = `${this.analytics.responseTime} min`;
        if (routeEfficiencyElement) routeEfficiencyElement.textContent = `${this.analytics.routeEfficiency}%`;
        if (successRateElement) successRateElement.textContent = `${this.analytics.successRate}%`;
        if (officerResponseElement) officerResponseElement.textContent = `${this.analytics.officerResponse} min`;
    }
}

// Global functions for HTML onclick handlers
function startDemo() {
    // First scroll to demo section
    scrollToSection('demo');
    
    // Add highlight effect
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.classList.add('highlighted');
        setTimeout(() => {
            demoSection.classList.remove('highlighted');
        }, 3000);
    }
    
    // Then trigger emergency after a short delay
    setTimeout(() => {
        clearPathSystem.triggerEmergency();
    }, 1000);
}

function triggerEmergency() {
    clearPathSystem.triggerEmergency();
}

function resetDemo() {
    clearPathSystem.resetDemo();
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        // Add offset for fixed navbar
        const offsetTop = element.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Initialize the system when DOM is loaded
let clearPathSystem;

document.addEventListener('DOMContentLoaded', () => {
    clearPathSystem = new ClearPathSystem();
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        setTimeout(typeWriter, 1000);
    }
});

// Add real-time clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const clockElements = document.querySelectorAll('.live-clock');
    clockElements.forEach(element => {
        element.textContent = timeString;
    });
}

// Update clock every second
setInterval(updateClock, 1000);

// Add performance monitoring
const performanceMonitor = {
    startTime: Date.now(),
    
    logPerformance: function() {
        const loadTime = Date.now() - this.startTime;
        console.log(`ClearPath System loaded in ${loadTime}ms`);
    }
};

// Log performance after page load
window.addEventListener('load', () => {
    performanceMonitor.logPerformance();
});

// Add error handling
window.addEventListener('error', (e) => {
    console.error('ClearPath System Error:', e.error);
});

// Add unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('ClearPath System Promise Rejection:', e.reason);
});

// Export for global access
window.clearPathSystem = clearPathSystem;
