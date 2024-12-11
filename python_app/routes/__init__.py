
from python_app.routes.lollipop_task import lollipop_blueprint

def register_blueprints(app):
    app.register_blueprint(lollipop_blueprint, url_prefix="/lollipop")