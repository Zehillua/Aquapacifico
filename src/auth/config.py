import os
from dotenv import load_dotenv

# Cargar las variables desde el archivo .env
load_dotenv()

# Obtener la clave secreta
SECRET_KEY = os.getenv("SECRET_KEY")
