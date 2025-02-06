import os
from flask import Blueprint, jsonify, request
from bson.objectid import ObjectId
from datetime import datetime, timedelta
from dotenv import load_dotenv
from email.message import EmailMessage
from auth.auth import verificar_token
import smtplib
import ssl
import jwt
import random
import string
from werkzeug.security import generate_password_hash, check_password_hash
from colecciones.mongo_setup import db

api = Blueprint('api', __name__)

# Cargar variables de entorno
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", os.urandom(32))
smtp_user = os.getenv('SMTP_USER')
smtp_password = os.getenv('PASSWORD')
smtp_server = os.getenv('SMTP_SERVER')
smtp_port = int(os.getenv('SMTP_PORT'))

reset_codes = {}  # Esto debería almacenarse en la BD para persistencia



# Rutas de cargos
@api.route('/cargos', methods=['GET'])
def get_cargos():
    cargos = db.cargos.find()
    cargos_list = [{"id": str(cargo["_id"]), "nombre": cargo["nombre"]} for cargo in cargos]
    return jsonify(cargos_list)

# Registrar usuario
@api.route('/register', methods=['POST'])
def register_user():
    data = request.json
    if not all(key in data for key in ('nombre', 'correo', 'cargo', 'password', 'confirmPassword')):
        return jsonify({"success": False, "message": "Faltan campos obligatorios"}), 400

    if data['password'] != data['confirmPassword']:
        return jsonify({"success": False, "message": "Las contraseñas no coinciden"}), 400

    # Hashear la contraseña antes de guardarla
    hashed_password = generate_password_hash(data['password'])

    result = db.usuarios.insert_one({
        "nombre": data['nombre'],
        "correo": data['correo'],
        "cargo": data['cargo'],
        "password": hashed_password
    })
    return jsonify({"success": True, "inserted_id": str(result.inserted_id)})

# Login
@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = db.usuarios.find_one({"correo": data['correo']})

        if user and check_password_hash(user['password'], data['password']):
            token = jwt.encode({
                'username': str(user['nombre']),
                'exp': datetime.utcnow() + timedelta(hours=1)
            }, SECRET_KEY, algorithm='HS256')
            
            return jsonify({"success": True, "token": token})
        else:
            return jsonify({"success": False, "message": "Correo o contraseña incorrectos"}), 401
    except Exception:
        return jsonify({"success": False, "message": "Error en el servidor"}), 500

# Obtener perfil (Usando `verificar_token`)
@api.route('/profile', methods=['GET'])
@verificar_token
def profile():
    usuario_actual = getattr(request, "usuario_actual", None)
    if not usuario_actual:
        return jsonify({"success": False, "message": "Usuario no autenticado"}), 401

    user = db.usuarios.find_one({"correo": usuario_actual})
    if user:
        return jsonify({
            "success": True,
            "user": {
                "nombre": user['nombre'],
                "correo": user['correo'],
                "cargo": user['cargo']
            }
        })
    else:
        return jsonify({"success": False, "message": "Usuario no encontrado"}), 404



# Rutas de cargos
@api.route('/especies', methods=['GET'])
def get_especies():
    especies = db.especies.find()
    especies_list = [{"id": str(especie["_id"]), "nombre": especie["nombre"]} for especie in especies]
    return jsonify(especies_list)


# Registrar especie
@api.route('/especies', methods=['POST'])
@verificar_token
def add_especie():
    data = request.json
    result = db.especies.insert_one({"nombre": data["nombre"]})
    return jsonify({"inserted_id": str(result.inserted_id)})

# Registro de producción
@api.route('/registros', methods=['POST'])
@verificar_token
def add_registro():
    data = request.json
    usuario_actual = getattr(request, "usuario_actual", None)
    print(usuario_actual)
    if not usuario_actual:
        return jsonify({"error": "Usuario no autenticado"}), 401

    result = db.registros.insert_one({
        "fechaA": datetime.utcnow(),
        "cantidadPr": data["cantidadPr"],
        "retornoEs": data["retornoEs"],
        "especie": data["especie"],
        "costoEst": data["costoEst"],
        "usuario": usuario_actual
    })

    return jsonify({"inserted_id": str(result.inserted_id)})

# Función para enviar correo
def enviar_correo(correo, codigo):
    try:
        mensaje = EmailMessage()
        mensaje['From'] = smtp_user
        mensaje['To'] = correo
        mensaje['Subject'] = "Restablecer Contraseña"
        mensaje.set_content(f"Tu código de restablecimiento es: {codigo}")

        context = ssl.create_default_context()

        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(mensaje)
        
        return True
    except Exception as e:
        print(f"Error al enviar el correo: {e}")
        return False

# Olvido de contraseña
@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('correo')

    user = db.usuarios.find_one({"correo": email})
    if user:
        codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        reset_codes[email] = codigo
        if enviar_correo(email, codigo):
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "message": "Error al enviar el correo"}), 500
    else:
        return jsonify({"success": False, "message": "Correo no encontrado"}), 404

# Verificación de código
@api.route('/verify-code', methods=['POST'])
def verify_code():
    data = request.json
    code = data.get('code')

    email = next((k for k, v in reset_codes.items() if v == code), None)

    if email:
        del reset_codes[email]
        return jsonify({"success": True, "email": email}), 200
    else:
        return jsonify({"success": False, "message": "Código incorrecto"}), 400

# Restablecer contraseña
@api.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('correo')
    new_password = generate_password_hash(data.get('newPassword'))

    user = db.usuarios.find_one({"correo": email})
    
    if user:
        db.usuarios.update_one({"correo": email}, {"$set": {"password": new_password}})
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "message": "Error al restablecer la contraseña"}), 400
    
    
@api.route('/evaluaciones', methods=['GET'])
def get_evaluaciones():
    try:
        registros = list(db.registros.find())
        for registro in registros:
            registro["_id"] = str(registro["_id"])
        return jsonify({"success": True, "registros": registros}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

