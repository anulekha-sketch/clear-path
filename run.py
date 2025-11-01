#!/usr/bin/env python3
"""
ClearPath Emergency Response System
Startup script for the application
"""

import os
import sys
import subprocess
import webbrowser
import time
from threading import Timer

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import flask
        import flask_socketio
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def open_browser():
    """Open browser after a short delay"""
    time.sleep(2)
    webbrowser.open('http://localhost:5000')

def main():
    """Main startup function"""
    print("🚑 ClearPath Emergency Response System")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    print("🚀 Starting ClearPath server...")
    print("📍 Server will be available at: http://localhost:5000")
    print("🔗 WebSocket enabled for real-time updates")
    print("📊 Analytics dashboard available")
    print("🚦 Traffic signal simulation active")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 50)
    
    # Open browser after delay
    Timer(3.0, open_browser).start()
    
    # Start the Flask application
    try:
        from app import app, socketio
        socketio.run(app, debug=False, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()




