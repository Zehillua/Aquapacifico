from flask import Flask
from colecciones.mongo_setup import create_collection
from rutas.api_routes import api
from waitress import serve

app = Flask(__name__)

# Configurar la colección al iniciar la aplicación
create_collection()

# Registrar el blueprint para las rutas
app.register_blueprint(api)

@app.route('/')
def home():
    return "API de Aquapacifico"

if __name__ == '__main__':
    # Usa waitress para servir la aplicación
    serve(app, host='0.0.0.0', port=5000)
