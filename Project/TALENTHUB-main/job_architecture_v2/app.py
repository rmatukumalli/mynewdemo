from flask import Flask
from database import init_db
from routes import main

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///job_architecture.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    init_db(app)

    app.register_blueprint(main)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=8001)
