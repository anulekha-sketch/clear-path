from flask import Flask, render_template, request, jsonify, send_from_directory, send_file
from flask_socketio import SocketIO, emit
import json
import time
import random
from datetime import datetime, timedelta
import threading
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'clearpath_secret_key_2024'
socketio = SocketIO(app, cors_allowed_origins="*")

# Global state management
system_state = {
    'emergency_active': False,
    'ambulance_position': 30,
    'current_speed': 0,
    'eta': '--:--',
    'severity_code': '--',
    'alerts': [],
    'notifications': [],
    'traffic_signals': {
        'A': {'status': 'normal', 'preempted': False},
        'B': {'status': 'normal', 'preempted': False},
        'C': {'status': 'normal', 'preempted': False}
    },
    'analytics': {
        'response_time': 2.3,
        'route_efficiency': 94,
        'success_rate': 97,
        'officer_response': 1.8
    }
}

# Emergency simulation thread
emergency_thread = None
emergency_running = False

@app.route('/')
def index():
    response = send_file('index.html', mimetype='text/html')
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    return response

@app.route('/<path:filename>')
def static_files(filename):
    if filename.endswith('.html'):
        response = send_file(filename, mimetype='text/html')
        response.headers['Content-Type'] = 'text/html; charset=utf-8'
        return response
    elif filename.endswith('.css'):
        response = send_file(filename, mimetype='text/css')
        response.headers['Content-Type'] = 'text/css; charset=utf-8'
        return response
    elif filename.endswith('.js'):
        response = send_file(filename, mimetype='application/javascript')
        response.headers['Content-Type'] = 'application/javascript; charset=utf-8'
        return response
    else:
        return send_from_directory('.', filename)

@app.route('/api/emergency/trigger', methods=['POST'])
def trigger_emergency():
    global emergency_running
    
    if not emergency_running:
        emergency_running = True
        system_state['emergency_active'] = True
        system_state['current_speed'] = 65
        system_state['eta'] = '3:24'
        system_state['severity_code'] = 'P1'
        
        # Start emergency simulation
        start_emergency_simulation()
        
        return jsonify({
            'status': 'success',
            'message': 'Emergency mode activated',
            'data': system_state
        })
    else:
        return jsonify({
            'status': 'error',
            'message': 'Emergency already active'
        })

@app.route('/api/emergency/reset', methods=['POST'])
def reset_emergency():
    global emergency_running
    
    emergency_running = False
    system_state['emergency_active'] = False
    system_state['ambulance_position'] = 30
    system_state['current_speed'] = 0
    system_state['eta'] = '--:--'
    system_state['severity_code'] = '--'
    system_state['alerts'] = []
    system_state['notifications'] = []
    
    # Reset traffic signals
    for signal in system_state['traffic_signals']:
        system_state['traffic_signals'][signal] = {'status': 'normal', 'preempted': False}
    
    # Emit reset event to all clients
    socketio.emit('emergency_reset', system_state)
    
    return jsonify({
        'status': 'success',
        'message': 'Emergency mode reset',
        'data': system_state
    })

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        'status': 'success',
        'data': system_state
    })

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    return jsonify({
        'status': 'success',
        'data': system_state['alerts']
    })

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    return jsonify({
        'status': 'success',
        'data': system_state['notifications']
    })

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    # Simulate real-time analytics updates
    system_state['analytics']['response_time'] = round(2.0 + random.uniform(-0.5, 0.5), 1)
    system_state['analytics']['route_efficiency'] = round(90 + random.uniform(-5, 10), 1)
    system_state['analytics']['success_rate'] = round(95 + random.uniform(-3, 5), 1)
    system_state['analytics']['officer_response'] = round(1.5 + random.uniform(-0.3, 0.5), 1)
    
    return jsonify({
        'status': 'success',
        'data': system_state['analytics']
    })

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    data = request.get_json()
    
    # Simulate form processing
    contact_data = {
        'id': str(uuid.uuid4()),
        'name': data.get('name'),
        'email': data.get('email'),
        'organization': data.get('organization'),
        'interest': data.get('interest'),
        'message': data.get('message'),
        'timestamp': datetime.now().isoformat(),
        'status': 'new'
    }
    
    # In a real application, you would save this to a database
    print(f"New contact form submission: {contact_data}")
    
    return jsonify({
        'status': 'success',
        'message': 'Thank you for your interest! We\'ll get back to you within 24 hours.',
        'data': contact_data
    })

@app.route('/api/traffic-signals', methods=['GET'])
def get_traffic_signals():
    return jsonify({
        'status': 'success',
        'data': system_state['traffic_signals']
    })

@app.route('/api/traffic-signals/<signal_id>/preempt', methods=['POST'])
def preempt_signal(signal_id):
    if signal_id in system_state['traffic_signals']:
        system_state['traffic_signals'][signal_id]['status'] = 'preempted'
        system_state['traffic_signals'][signal_id]['preempted'] = True
        
        # Emit signal preemption event
        socketio.emit('signal_preempted', {
            'signal_id': signal_id,
            'status': 'preempted',
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            'status': 'success',
            'message': f'Signal {signal_id} preempted successfully',
            'data': system_state['traffic_signals'][signal_id]
        })
    else:
        return jsonify({
            'status': 'error',
            'message': f'Signal {signal_id} not found'
        })

@app.route('/api/alerts/<alert_id>/acknowledge', methods=['POST'])
def acknowledge_alert(alert_id):
    for alert in system_state['alerts']:
        if alert['id'] == alert_id:
            alert['status'] = 'acknowledged'
            alert['acknowledged_at'] = datetime.now().isoformat()
            
            # Emit acknowledgment event
            socketio.emit('alert_acknowledged', {
                'alert_id': alert_id,
                'timestamp': datetime.now().isoformat()
            })
            
            return jsonify({
                'status': 'success',
                'message': 'Alert acknowledged successfully',
                'data': alert
            })
    
    return jsonify({
        'status': 'error',
        'message': 'Alert not found'
    })

# WebSocket events
@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    socketio.emit('connected', {'message': 'Connected to ClearPath system'})
    socketio.emit('status_update', system_state)

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')

@socketio.on('request_status')
def handle_status_request():
    socketio.emit('status_update', system_state)

@socketio.on('emergency_trigger')
def handle_emergency_trigger():
    if not emergency_running:
        emergency_running = True
        system_state['emergency_active'] = True
        system_state['current_speed'] = 65
        system_state['eta'] = '3:24'
        system_state['severity_code'] = 'P1'
        
        start_emergency_simulation()
        socketio.emit('emergency_triggered', system_state)

@socketio.on('emergency_reset')
def handle_emergency_reset():
    global emergency_running
    emergency_running = False
    system_state['emergency_active'] = False
    system_state['ambulance_position'] = 30
    system_state['current_speed'] = 0
    system_state['eta'] = '--:--'
    system_state['severity_code'] = '--'
    system_state['alerts'] = []
    system_state['notifications'] = []
    
    for signal in system_state['traffic_signals']:
        system_state['traffic_signals'][signal] = {'status': 'normal', 'preempted': False}
    
    socketio.emit('emergency_reset', system_state)

def start_emergency_simulation():
    """Start the emergency simulation sequence"""
    def emergency_sequence():
        global emergency_running
        
        # Phase 1: Send alerts and notifications
        time.sleep(1)
        send_officer_alert('A')
        time.sleep(0.5)
        send_driver_notification('A')
        time.sleep(0.5)
        preempt_signal('A')
        
        time.sleep(2)
        send_officer_alert('B')
        time.sleep(0.5)
        send_driver_notification('B')
        time.sleep(0.5)
        preempt_signal('B')
        
        time.sleep(2)
        send_officer_alert('C')
        time.sleep(0.5)
        send_driver_notification('C')
        time.sleep(0.5)
        preempt_signal('C')
        
        # Phase 2: Simulate ambulance movement
        for i in range(12):  # 12 iterations over 24 seconds
            if not emergency_running:
                break
                
            time.sleep(2)
            system_state['ambulance_position'] = min(90, 30 + (i * 5))
            socketio.emit('ambulance_position_update', {
                'position': system_state['ambulance_position'],
                'speed': system_state['current_speed']
            })
        
        # Phase 3: Complete emergency
        if emergency_running:
            time.sleep(2)
            system_state['ambulance_position'] = 95
            system_state['eta'] = '0:30'
            socketio.emit('emergency_complete', system_state)
    
    # Start the emergency sequence in a separate thread
    thread = threading.Thread(target=emergency_sequence)
    thread.daemon = True
    thread.start()

def send_officer_alert(intersection):
    """Send an alert to traffic officers"""
    alert = {
        'id': str(uuid.uuid4()),
        'intersection': intersection,
        'message': f'Ambulance approaching Junction {intersection} - Clear left lanes and hold cross traffic',
        'timestamp': datetime.now().isoformat(),
        'status': 'pending'
    }
    
    system_state['alerts'].append(alert)
    socketio.emit('new_alert', alert)

def send_driver_notification(intersection):
    """Send a notification to drivers"""
    notification = {
        'id': str(uuid.uuid4()),
        'intersection': intersection,
        'message': f'Emergency vehicle approaching Junction {intersection} - Move left when safe. ETA 2 minutes',
        'timestamp': datetime.now().isoformat(),
        'type': 'driver'
    }
    
    system_state['notifications'].append(notification)
    socketio.emit('new_notification', notification)

def preempt_signal(intersection):
    """Preempt a traffic signal"""
    if intersection in system_state['traffic_signals']:
        system_state['traffic_signals'][intersection]['status'] = 'preempted'
        system_state['traffic_signals'][intersection]['preempted'] = True
        
        socketio.emit('signal_preempted', {
            'signal_id': intersection,
            'status': 'preempted',
            'timestamp': datetime.now().isoformat()
        })

# Background tasks
def background_analytics_update():
    """Update analytics data periodically"""
    while True:
        time.sleep(30)  # Update every 30 seconds
        
        # Simulate real-time analytics updates
        system_state['analytics']['response_time'] = round(2.0 + random.uniform(-0.5, 0.5), 1)
        system_state['analytics']['route_efficiency'] = round(90 + random.uniform(-5, 10), 1)
        system_state['analytics']['success_rate'] = round(95 + random.uniform(-3, 5), 1)
        system_state['analytics']['officer_response'] = round(1.5 + random.uniform(-0.3, 0.5), 1)
        
        socketio.emit('analytics_update', system_state['analytics'])

# Start background analytics update
analytics_thread = threading.Thread(target=background_analytics_update)
analytics_thread.daemon = True
analytics_thread.start()

if __name__ == '__main__':
    print("🚑 ClearPath Emergency Response System Starting...")
    print("📍 Server running on http://localhost:5000")
    print("🔗 WebSocket enabled for real-time updates")
    print("📊 Analytics dashboard available")
    print("🚦 Traffic signal simulation active")
    
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
