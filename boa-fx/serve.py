import http.server, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
handler = http.server.SimpleHTTPRequestHandler
with http.server.HTTPServer(('', port), handler) as httpd:
    httpd.serve_forever()
