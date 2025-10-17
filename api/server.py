#!/usr/bin/env python3

from http.server import HTTPServer, BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import sys
import os
import random
import threading
import time
from datetime import datetime, timedelta

sessions = {}
clients = {}

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def _add_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._add_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self._add_cors_headers()
            self.end_headers()
            response = {'message': 'API Server is running!', 'status': 'ok'}
            self.wfile.write(json.dumps(response).encode())
        elif self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self._add_cors_headers()
            self.end_headers()
            response = {'status': 'healthy', 'active_sessions': len(sessions)}
            self.wfile.write(json.dumps(response).encode())
        elif self.path.startswith('/api/session'):
            self.handle_session_get()
        elif self.path.startswith('/api/events/'):
            self.handle_sse_connection()
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self._add_cors_headers()
            self.end_headers()
            response = {'error': 'Endpoint not found'}
            self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        if self.path == '/api/session':
            self.handle_session_post()
        elif self.path == '/api/message':
            self.handle_message_post()
        elif self.path.startswith('/api/session/'):
            pass
        else:
            content_length = int(self.headers['Content-Length']) if self.headers.get('Content-Length') else 0
            post_data = self.rfile.read(content_length) if content_length > 0 else b''

            try:
                data = json.loads(post_data.decode()) if post_data else {}
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'error': 'Invalid JSON'}
                self.wfile.write(json.dumps(response).encode())
                return

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self._add_cors_headers()
            self.end_headers()
            response = {'message': 'Data received', 'data': data}
            self.wfile.write(json.dumps(response).encode())

    def handle_session_get(self):
        path_parts = self.path.split('/')
        if len(path_parts) >= 4 and path_parts[3]:
            session_code = path_parts[3].upper()
            if session_code in sessions:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._add_cors_headers()
                self.end_headers()
                response = {'exists': True, 'session_code': session_code}
                self.wfile.write(json.dumps(response).encode())
            else:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self._add_cors_headers()
                self.end_headers()
                response = {'exists': False, 'session_code': session_code}
                self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self._add_cors_headers()
            self.end_headers()
            response = {'error': 'Missing session code'}
            self.wfile.write(json.dumps(response).encode())

    def handle_session_post(self):
        content_length = int(self.headers['Content-Length']) if self.headers.get('Content-Length') else 0
        post_data = self.rfile.read(content_length) if content_length > 0 else b''

        try:
            data = json.loads(post_data.decode()) if post_data else {}
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {'error': 'Invalid JSON'}
            self.wfile.write(json.dumps(response).encode())
            return
        session_code = None
        attempts = 0
        while session_code is None and attempts < 100:
            code = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=4))
            if code not in sessions:
                session_code = code
            attempts += 1

        if session_code is None:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self._add_cors_headers()
            self.end_headers()
            response = {'error': 'Could not generate unique session code'}
            self.wfile.write(json.dumps(response).encode())
            return
        sessions[session_code] = {
            'clients': [],
            'created_at': datetime.now(),
            'host': data.get('client_id', 'unknown')
        }

        self.send_response(201)
        self.send_header('Content-type', 'application/json')
        self._add_cors_headers()
        self.end_headers()
        response = {'session_code': session_code, 'created': True}
        self.wfile.write(json.dumps(response).encode())

    def handle_sse_connection(self):
        path_parts = self.path.split('/')
        if len(path_parts) >= 5 and path_parts[3] and path_parts[4]:
            session_code = path_parts[3].upper()
            client_id = path_parts[4]

            if session_code in sessions and client_id:
                if client_id not in sessions[session_code]['clients']:
                    sessions[session_code]['clients'].append(client_id)

                clients[client_id] = {
                    'session': session_code,
                    'connection': self
                }

                self.send_response(200)
                self.send_header('Content-Type', 'text/event-stream')
                self.send_header('Cache-Control', 'no-cache')
                self.send_header('Connection', 'keep-alive')
                self._add_cors_headers()
                self.end_headers()

                try:
                    while True:
                        time.sleep(30)
                        self.wfile.write(b': keepalive\n\n')
                        self.wfile.flush()
                except:
                    if client_id in clients:
                        if client_id in sessions[session_code]['clients']:
                            sessions[session_code]['clients'].remove(client_id)
                        del clients[client_id]
            else:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self._add_cors_headers()
                self.end_headers()
                response = {'error': 'Session not found or missing client ID'}
                self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self._add_cors_headers()
            self.end_headers()
            response = {'error': 'Missing session code or client ID'}
            self.wfile.write(json.dumps(response).encode())

    def handle_message_post(self):
        content_length = int(self.headers['Content-Length']) if self.headers.get('Content-Length') else 0
        post_data = self.rfile.read(content_length) if content_length > 0 else b''

        try:
            data = json.loads(post_data.decode())
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self._add_cors_headers()
            self.end_headers()
            response = {'error': 'Invalid JSON'}
            self.wfile.write(json.dumps(response).encode())
            return

        client_id = data.get('client_id')
        session_code = data.get('session_code')

        if session_code and session_code in sessions:
            broadcast_message = {
                'type': 'message',
                'client_id': client_id,
                'username': data.get('username', f'User-{client_id[:8]}'),
                'content': data['content'],
                'timestamp': datetime.now().isoformat(),
                'session_code': session_code
            }

            for cid in sessions[session_code]['clients']:
                if cid in clients and cid != client_id:
                    try:
                        conn = clients[cid]['connection']
                        event_data = f"data: {json.dumps(broadcast_message)}\n\n"
                        conn.wfile.write(event_data.encode())
                        conn.wfile.flush()
                    except:
                        pass

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self._add_cors_headers()
            self.end_headers()
            response = {'sent': True}
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self._add_cors_headers()
            self.end_headers()
            response = {'error': 'Session not found'}
            self.wfile.write(json.dumps(response).encode())

    def log_message(self, format, *args):
        pass


def cleanup_sessions():
    current_time = datetime.now()
    expired_sessions = []

    for session_code, session_data in sessions.items():
        if current_time - session_data['created_at'] > timedelta(minutes=15):
            expired_sessions.append(session_code)

    for session_code in expired_sessions:
        if session_code in sessions:
            for client_id in sessions[session_code]['clients']:
                if client_id in clients:
                    try:
                        conn = clients[client_id]['connection']
                        event_data = f"data: {json.dumps({'type': 'session_expired', 'session_code': session_code})}\n\n"
                        conn.wfile.write(event_data.encode())
                        conn.wfile.flush()
                    except:
                        pass
        del sessions[session_code]

    if expired_sessions:
        print(f"Cleaned up {len(expired_sessions)} expired sessions")

def run_server(port=8000, host='localhost'):
    server_address = (host, port)
    httpd = ThreadingHTTPServer(server_address, SimpleHTTPRequestHandler)
    print(f"Server running on http://{host}:{port}")
    print("Press Ctrl+C to stop")

    def cleanup_timer():
        while True:
            time.sleep(300)
            cleanup_sessions()

    cleanup_thread = threading.Thread(target=cleanup_timer, daemon=True)
    cleanup_thread.start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run_server(port)
