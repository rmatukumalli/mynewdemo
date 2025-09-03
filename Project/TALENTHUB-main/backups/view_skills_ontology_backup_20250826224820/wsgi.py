from app import create_app
import argparse

app = create_app()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Flask development server')
    parser.add_argument('--host', default='127.0.0.1', help='The hostname to listen on.')
    parser.add_argument('--port', type=int, default=5001, help='The port of the webserver.')
    args = parser.parse_args()
    app.run(debug=True, host=args.host, port=args.port)
