from flask import Blueprint, jsonify, request
from bson.objectid import ObjectId
from colecciones.mongo_setup import db  # Asegúrate de que la ruta es correcta

api = Blueprint('api', __name__)

# Ruta para agregar un documento a la colección "usuarios"
@api.route('/add', methods=['POST'])
def add_document():
    data = request.json
    result = db.usuarios.insert_one(data)
    return jsonify({"inserted_id": str(result.inserted_id)})

