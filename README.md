# 🚑 ClearPath - Real-time Ambulance Priority System

ClearPath is an innovative emergency response system that automatically alerts traffic police, preempts signals, and guides nearby drivers to create fast green corridors for emergency vehicles. Save lives with smart traffic management technology.

## 🌟 Features

### Core Functionality
- **Emergency Detection**: Automatic ambulance emergency mode activation with GPS tracking
- **Signal Preemption**: Real-time traffic signal control to create green corridors
- **Traffic Officer Alerts**: Instant notifications with one-tap actions for traffic management
- **Driver Notifications**: Multi-channel alerts to nearby drivers via navigation apps
- **Predictive Routing**: AI-powered route optimization considering traffic patterns
- **Analytics Dashboard**: Comprehensive performance tracking and KPI monitoring

### Technical Features
- **Real-time WebSocket Communication**: Live updates across all system components
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Beautiful interface with happy color scheme (orange, blue, green)
- **Interactive Demo**: Fully functional simulation of emergency response sequence
- **RESTful API**: Complete backend API for system integration
- **Live Analytics**: Real-time performance metrics and trend analysis

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd clearpath
   
   # Or simply download and extract the files to a folder
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   
   **Option 1: Quick start (recommended)**
   ```bash
   python run.py
   ```
   This will automatically open your browser and start the server.
   
   **Option 2: Manual start**
   ```bash
   python app.py
   ```
   Then manually open `http://localhost:5000` in your browser.

4. **Verify connection**
   - The frontend will automatically connect to the backend via WebSocket
   - Check the browser console for "Connected to ClearPath backend" message
   - All emergency simulation features will work in real-time

## 🎮 How to Use the Demo

### Starting an Emergency
1. Click the **"Trigger Emergency"** button in the Live Demo section
2. Watch the system automatically:
   - Send alerts to traffic officers
   - Notify nearby drivers
   - Preempt traffic signals
   - Track ambulance movement on the live map
   - Update analytics in real-time

### Interactive Features
- **Traffic Officer Dashboard**: View real-time alerts and acknowledge them
- **Driver Notifications**: See push notifications sent to nearby drivers
- **Live Map**: Watch the ambulance move along the route with intersection status
- **Analytics**: Monitor performance metrics and response times
- **Signal Control**: Observe traffic signal preemption in action

### Resetting the Demo
- Click **"Reset Demo"** to return the system to normal state
- All alerts, notifications, and signal preemptions will be cleared

## 🏗️ System Architecture

### Frontend
- **HTML5**: Semantic markup with modern structure
- **CSS3**: Responsive design with CSS Grid and Flexbox
- **JavaScript**: Interactive functionality and real-time updates
- **Chart.js**: Analytics visualization
- **Font Awesome**: Icons and visual elements

### Backend
- **Flask**: Python web framework
- **Flask-SocketIO**: Real-time WebSocket communication
- **RESTful API**: Complete API for system integration
- **Threading**: Background tasks for simulation and analytics

### Key Components
```
ClearPath System
├── Frontend (HTML/CSS/JS)
│   ├── Emergency Simulation
│   ├── Traffic Officer Dashboard
│   ├── Driver Notifications
│   ├── Live Map Tracking
│   └── Analytics Dashboard
├── Backend (Flask)
│   ├── REST API Endpoints
│   ├── WebSocket Events
│   ├── Emergency Simulation Engine
│   └── Real-time Analytics
└── Integration Points
    ├── Traffic Signal Controllers
    ├── Navigation Apps (Waze, Google)
    ├── Police Dispatch Systems
    └── Hospital Emergency Departments
```

## 📊 API Endpoints

### Emergency Management
- `POST /api/emergency/trigger` - Activate emergency mode
- `POST /api/emergency/reset` - Reset emergency state
- `GET /api/status` - Get current system status

### Alerts & Notifications
- `GET /api/alerts` - Get active officer alerts
- `POST /api/alerts/<id>/acknowledge` - Acknowledge alert
- `GET /api/notifications` - Get driver notifications

### Traffic Control
- `GET /api/traffic-signals` - Get signal status
- `POST /api/traffic-signals/<id>/preempt` - Preempt signal

### Analytics
- `GET /api/analytics` - Get performance metrics

### Contact
- `POST /api/contact` - Submit contact form

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Set Flask environment
export FLASK_ENV=development
export FLASK_DEBUG=1

# Optional: Set custom port
export PORT=5000
```

### Customization
- **Colors**: Modify CSS variables in `styles.css`
- **API Endpoints**: Update routes in `app.py`
- **Simulation Timing**: Adjust delays in emergency simulation functions
- **Analytics**: Customize metrics in the analytics update functions

## 🌐 WebSocket Events

### Client to Server
- `emergency_trigger` - Trigger emergency mode
- `emergency_reset` - Reset emergency state
- `request_status` - Request current status
- `acknowledge_alert` - Acknowledge officer alert

### Server to Client
- `status_update` - System status update
- `emergency_triggered` - Emergency mode activated
- `emergency_reset` - Emergency mode reset
- `new_alert` - New officer alert
- `new_notification` - New driver notification
- `signal_preempted` - Traffic signal preempted
- `ambulance_position_update` - Ambulance position update
- `analytics_update` - Analytics data update

## 🎨 Design System

### Color Palette
- **Primary Orange**: `#ff6b35` - Emergency alerts and primary actions
- **Primary Blue**: `#4a90e2` - Trust and reliability
- **Primary Green**: `#7ed321` - Success and safety
- **Accent Yellow**: `#ffd23f` - Warnings and highlights
- **Accent Purple**: `#8b5cf6` - Innovation and technology

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales from mobile to desktop

### Components
- **Buttons**: Rounded corners, hover effects, loading states
- **Cards**: Subtle shadows, hover animations
- **Forms**: Clean inputs with focus states
- **Charts**: Interactive data visualization

## 🚦 Traffic Signal Integration

### Supported Protocols
- **NEMA TS2**: Standard traffic signal controller protocol
- **UTC (Urban Traffic Control)**: City-wide traffic management
- **SCOOT**: Split, Cycle, and Offset Optimization Technique
- **Custom APIs**: Integration with proprietary systems

### Preemption Process
1. **Detection**: Ambulance enters emergency mode
2. **Route Calculation**: Optimal path to destination
3. **Signal Identification**: Intersections along route
4. **Preemption Request**: Secure API call to traffic controller
5. **Confirmation**: Signal changes to green for ambulance
6. **Monitoring**: Real-time status updates
7. **Reset**: Return to normal operation after passage

## 📱 Mobile Responsiveness

The system is fully responsive and optimized for:
- **Desktop**: Full dashboard with all features
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Streamlined interface for emergency use

### Breakpoints
- **Desktop**: 1200px and above
- **Tablet**: 768px to 1199px
- **Mobile**: Below 768px

## 🔒 Security Features

### Authentication
- **Secure Tokens**: Short-lived authentication tokens
- **API Keys**: Encrypted communication with traffic systems
- **Audit Logs**: Complete activity tracking

### Data Protection
- **Privacy by Design**: Only necessary data is shared
- **Encryption**: All communications are encrypted
- **Retention Policies**: Automatic data cleanup

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production Deployment
```bash
# Using gunicorn
gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:5000 app:app

# Using Docker (if Dockerfile provided)
docker build -t clearpath .
docker run -p 5000:5000 clearpath
```

### Environment Setup
- **Development**: Debug mode enabled, detailed logging
- **Production**: Optimized performance, error handling
- **Testing**: Automated test suite (if implemented)

## 📈 Performance Metrics

### Key Performance Indicators (KPIs)
- **Response Time**: Average time from emergency activation to first response
- **Route Efficiency**: Percentage of optimal route utilization
- **Success Rate**: Percentage of successful emergency responses
- **Officer Response**: Average time for traffic officer acknowledgment

### Real-time Monitoring
- **Live Dashboard**: Real-time KPI updates
- **Historical Trends**: Performance over time
- **Alert System**: Performance threshold monitoring
- **Reporting**: Automated performance reports

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use modern ES6+ features
- **CSS**: Use BEM methodology for class names
- **HTML**: Semantic markup with accessibility in mind

## 📞 Support

### Contact Information
- **Email**: support@clearpath-emergency.com
- **Phone**: +1 (555) CLEAR-PATH
- **Documentation**: Available in the `/docs` folder

### Troubleshooting
- **Common Issues**: Check the troubleshooting guide
- **Logs**: Review application logs for errors
- **Community**: Join our developer community forum

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Traffic Management Systems**: Integration partners
- **Emergency Services**: Police and ambulance services
- **Technology Partners**: Navigation and communication providers
- **Open Source Community**: Libraries and frameworks used

---

**ClearPath** - Revolutionizing emergency response with smart traffic management technology. 🚑✨

*Built with ❤️ for saving lives and improving emergency response times.*
