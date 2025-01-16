import os
from flask import Blueprint, jsonify, request
from bson.objectid import ObjectId
from datetime import datetime, timedelta
from dotenv import load_dotenv
from email.message import EmailMessage
import smtplib
import ssl
import jwt
import random
import string
from colecciones.mongo_setup import db  # Asegúrate de que la ruta es correcta

api = Blueprint('api', __name__)

# Cargar variables de entorno desde el archivo .env
load_dotenv()
SECRET_KEY = os.environ.get("SECRET_KEY", os.urandom(32))
smtp_user = os.getenv('SMTP_USER')
smtp_password = os.getenv('PASSWORD')
smtp_server = os.getenv('SMTP_SERVER')
smtp_port = int(os.getenv('SMTP_PORT'))
reset_codes = {}  # Almacenará temporalmente los códigos de restablecimiento

# Ruta para registrar un nuevo usuario
@api.route('/register', methods=['POST'])
def register_user():
    data = request.json
    # Verificar que todos los campos requeridos están presentes
    if not all(key in data for key in ('nombre', 'correo', 'cargo', 'password', 'confirmPassword')):
        return jsonify({"success": False, "message": "Faltan campos obligatorios"}), 400

    if data['password'] != data['confirmPassword']:
        return jsonify({"success": False, "message": "Las contraseñas no coinciden"}), 400

    result = db.usuarios.insert_one({
        "nombre": data.get('nombre'),
        "correo": data.get('correo'),
        "cargo": data.get('cargo'),
        "password": data.get('password')
    })
    return jsonify({"success": True, "inserted_id": str(result.inserted_id)})

# Ruta para iniciar sesión
@api.route('/login', methods=['POST'])
def login():
    data = request.json
    user = db.usuarios.find_one({"correo": data['correo']})
    
    if user and user['password'] == data['password']:
        # Crear token JWT
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({"success": True, "token": token})
    else:
        return jsonify({"success": False, "message": "Correo o contraseña incorrectos"}), 401

# Ruta protegida para obtener información del usuario
@api.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"success": False, "message": "Token faltante"}), 403
    
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = db.usuarios.find_one({"_id": ObjectId(data['user_id'])})
        return jsonify({"success": True, "user": {"nombre": user['nombre'], "correo": user['correo'], "cargo": user['cargo']}})
    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": "Token expirado"}), 403
    except jwt.InvalidTokenError:
        return jsonify({"success": False, "message": "Token inválido"}), 403

# Rutas de cargos
@api.route('/cargos', methods=['GET'])
def get_cargos():
    cargos = db.cargos.find()
    cargos_list = [{"id": str(cargo["_id"]), "nombre": cargo["nombre"]} for cargo in cargos]
    return jsonify(cargos_list)

@api.route('/cargos', methods=['POST'])
def add_cargo():
    data = request.json
    result = db.cargos.insert_one({"nombre": data["nombre"]})
    return jsonify({"inserted_id": str(result.inserted_id)})

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
        
        print("Correo enviado exitosamente")
        return True
    except Exception as e:
        print(f"Error al enviar el correo: {e}")
        return False



@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('correo')
    confirm_email = data.get('confirmCorreo')
    
    if email != confirm_email:  
        return jsonify({"success": False, "message": "Los correos electrónicos no coinciden"}), 400

    user = db.usuarios.find_one({"correo": email})
    if user:
        codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        reset_codes[email] = codigo
        if enviar_correo(email, codigo):
            print("Correo enviado exitosamente")
            return jsonify({"success": True}), 200
        else:
            print("Error al enviar el correo")
            return jsonify({"success": False, "message": "Error al enviar el correo"}), 500
    else:
        print("Correo no encontrado")
        return jsonify({"success": False, "message": "Correo no encontrado"}), 404

@api.route('/verify-code', methods=['POST'])
def verify_code():
    data = request.json
    code = data.get('code')
    
    # Buscar el correo asociado al código dado
    email = next((k for k, v in reset_codes.items() if v == code), None)

    if email:
        del reset_codes[email]  # Eliminar el código verificado para seguridad
        return jsonify({"success": True, "email": email}), 200  # Devolver el correo verificado
    else:
        return jsonify({"success": False, "message": "Código incorrecto"}), 400


@api.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('correo')
    new_password = data.get('newPassword')
    user = db.usuarios.find_one({"correo": email})
    
    if user:
        db.usuarios.update_one({"correo": email}, {"$set": {"password": new_password}})
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "message": "Error al restablecer la contraseña"}), 400


