import jwt
from flask import request, jsonify
from functools import wraps
from auth.config import SECRET_KEY  # Se carga desde .env

def verificar_token(f):
    @wraps(f)
    def decorador(*args, **kwargs):
        token = request.headers.get("Authorization").split()[1]
        if not token:
            return jsonify({"error": "Token no encontrado"}), 401
        
        try:
            token = token.replace("Bearer ", "")
            datos_usuario = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.usuario_actual = datos_usuario["username"]  # Guardamos el usuario en request
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token inválido"}), 401

        return f(*args, **kwargs)
    return decorador
