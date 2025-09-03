from flask import Blueprint

bp = Blueprint('data_management', __name__, url_prefix='/data-management')

from app.data_management import routes
