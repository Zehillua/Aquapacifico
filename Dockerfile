# Usar la imagen base de Python
FROM python:3.9

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el archivo requirements.txt y el código del proyecto a /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .

# Comando para ejecutar tu aplicación
CMD ["python", "conexion_BD.py"]
