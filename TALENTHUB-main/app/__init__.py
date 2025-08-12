from flask import Flask, send_from_directory, abort, redirect, url_for
from werkzeug.exceptions import NotFound
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import os

db = SQLAlchemy()
migrate = Migrate()
ma = Marshmallow() # Marshmallow instance

def create_app():
    app = Flask(__name__,
                instance_relative_config=True,
                template_folder='templates',
                static_folder='static')
    
    # Configuration
    # Use environment variables for sensitive data or use a config file
    # For simplicity, I'm setting a default SQLite URI here.
    # You should configure this properly for your environment.
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'site.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.debug = True

    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app) # Initialize Marshmallow
    CORS(app) # Initialize CORS - for prototype, allow all origins

    # Import models here to ensure they are registered with SQLAlchemy
    # before any database operations (like migrations) are performed.
    with app.app_context():
        from . import models # noqa: F401

        # Import and register API blueprints
        from .api.skills import skills_bp
        from .api.capabilities import capabilities_bp
        from .api.competencies import competencies_bp
        from .api.behaviors import behaviors_bp
        from .api.proficiencies import proficiencies_bp
        from .api.ontology import ontology_bp 
        from .api.job_architecture import job_architecture_bp

        # Register the job architecture blueprint, which includes the AI wizard endpoints
        app.register_blueprint(skills_bp, url_prefix='/api/v1/skills')
        app.register_blueprint(capabilities_bp, url_prefix='/api/v1/capabilities')
        app.register_blueprint(competencies_bp, url_prefix='/api/v1/competencies')
        app.register_blueprint(behaviors_bp, url_prefix='/api/v1/behaviors')
        app.register_blueprint(proficiencies_bp, url_prefix='/api/v1/proficiencies')
        app.register_blueprint(ontology_bp, url_prefix='/api/v1/ontology')
        app.register_blueprint(job_architecture_bp, url_prefix='/job-architecture')

        # Define the root route to redirect to index.html
        @app.route('/')
        def root_page_redirect():
            app.logger.info("Route / hit, redirecting to index.html")
            return redirect(url_for('serve_root_static_factory', filename='index.html'))

        @app.route('/favicon.ico')
        def favicon():
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            try:
                return send_from_directory(os.path.join(project_root, 'images'), 'favicon.png', mimetype='image/png')
            except FileNotFoundError:
                app.logger.error("favicon.png not found in images directory.")
                abort(404)
            except Exception as e:
                app.logger.error(f"Error serving favicon.png: {e}")
                abort(500)

        # Define the admin login route
        @app.route('/admin/login')
        def admin_login_page():
            app.logger.info("Route /admin/login hit, serving admin-login.html (defined in create_app)")
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            try:
                return send_from_directory(project_root, 'admin-login.html')
            except FileNotFoundError:
                app.logger.error(f"admin-login.html not found in {project_root} for /admin/login route (defined in create_app)")
                abort(404)
            except Exception as e:
                app.logger.error(f"Error serving admin-login.html from /admin/login route (defined in create_app): {e}")
                abort(500)

        @app.route('/view_skills_ontology')
        def view_skills_ontology_page():
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            return send_from_directory(project_root, 'view_skills_ontology.html')

        @app.route('/admin_skills_ontology')
        def admin_skills_ontology_page():
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            return send_from_directory(project_root, 'admin_skills_ontology.html')

        # --- New Admin Skills Ontology Dashboard Routes (moved from app.py) ---
        @app.route('/admin/skills-dashboard')
        def admin_skills_dashboard_index_factory():
            app.logger.info("Route /admin/skills-dashboard hit (defined in create_app)")
            # __file__ is app/__init__.py, so '..' goes to project root
            frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
            try:
                return send_from_directory(frontend_dir, 'index.html')
            except FileNotFoundError:
                app.logger.error(f"frontend/index.html not found in {frontend_dir} for /admin/skills-dashboard (defined in create_app)")
                abort(404)

        @app.route('/admin/skills-dashboard-assets/<path:filename>')
        def admin_skills_dashboard_static_factory(filename):
            app.logger.info(f"Route /admin/skills-dashboard-assets hit for: {filename} (defined in create_app)")
            frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
            try:
                return send_from_directory(frontend_dir, filename)
            except FileNotFoundError:
                app.logger.error(f"Asset {filename} not found in {frontend_dir} for /admin/skills-dashboard-assets (defined in create_app)")
                abort(404)
        # --- End New Admin Skills Ontology Dashboard Routes ---

        # --- Temporary Specific Route for admin-dashboard.html (moved from app.py) ---
        @app.route('/admin-dashboard.html')
        def serve_admin_dashboard_specifically_factory():
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            app.logger.info(f"Attempting to serve admin-dashboard.html explicitly from {project_root} (defined in create_app)")
            try:
                return send_from_directory(project_root, 'admin-dashboard.html')
            except FileNotFoundError:
                app.logger.error(f"admin-dashboard.html EXPLICITLY NOT FOUND in {project_root} (defined in create_app)")
                abort(404)
            except Exception as e:
                app.logger.error(f"Error serving admin-dashboard.html explicitly (defined in create_app): {e}")
                abort(500)

        # --- Specific route for CSS files ---
        @app.route('/css/<path:filename>')
        def serve_css_factory(filename):
            app.logger.info(f"serve_css_factory called for: {filename}")
            css_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'css'))
            try:
                return send_from_directory(css_dir, filename)
            except NotFound:
                app.logger.info(f"CSS file not found: {filename} (path searched: {os.path.join(css_dir, filename)})")
                abort(404)
            except Exception as e:
                app.logger.error(f"Error serving CSS file {filename}: {e}")
                abort(500)

        # --- General static file server (moved from app.py) ---
        # This serves files from the project root and subdirectories like js/, admin/
        # It's placed after more specific routes.
        @app.route('/<path:filename>')
        def serve_root_static_factory(filename):
            app.logger.info(f"serve_root_static_factory called with filename: '{filename}' (defined in create_app)")
            
            # Define excluded extensions and prefixes
            excluded_extensions = ('.py', '.pyc', '.md', '.csv', '.db', '.sqlite', '.ini', '.mako')
            # Ensure these prefixes are relative to the filename being requested from the root
            excluded_prefixes = ('app/', 'migrations/', 'config/', 'instance/', '.venv/', 'frontend/') 
            
            if filename.endswith(excluded_extensions) or \
               any(filename.startswith(prefix) for prefix in excluded_prefixes) or \
               filename == 'Procfile' or \
               filename == 'requirements.txt' or \
               filename == '.DS_Store' or \
               filename == 'static.json':
                app.logger.warning(f"Denied access attempt to: {filename} by serve_root_static_factory")
                abort(404)
            
            project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            try:
                return send_from_directory(project_root, filename)
            except NotFound:
                app.logger.info(f"File not found by serve_root_static_factory: {filename} (path searched: {os.path.join(project_root, filename)})")
                abort(404)
            except Exception as e:
                app.logger.error(f"Error in serve_root_static_factory for {filename}: {e}")
                abort(500)
        # --- End General static file server ---

    return app
