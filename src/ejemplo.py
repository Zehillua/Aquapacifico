import os
from dotenv import load_dotenv
from email.message import EmailMessage
import smtplib
import ssl

# Cargar variables de entorno desde el archivo .env
load_dotenv()

smtp_user = os.getenv('SMTP_USER')
smtp_password = os.getenv('PASSWORD')
smtp_server = os.getenv('SMTP_SERVER')
smtp_port = int(os.getenv('SMTP_PORT'))

def enviar_correo(correo, codigo):
    try:
        mensaje = EmailMessage()
        mensaje['From'] = smtp_user
        mensaje['To'] = correo
        mensaje['Subject'] = "Prueba de Envío de Correo"
        mensaje.set_content(f"Este es un correo de prueba con el código: {codigo}")

        context = ssl.create_default_context()

        with smtplib.SMTP_SSL(smtp_server, smtp_port, context=context) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(mensaje)
        
        print("Correo enviado exitosamente")
        return True
    except Exception as e:
        print(f"Error al enviar el correo: {e}")
        return False

# Prueba enviar un correo
if __name__ == "__main__":
    correo = "recipient_email@example.com"  # Cambia esto por el correo al que quieras enviar
    codigo = "123456"  # Puedes usar un código aleatorio o fijo

    if enviar_correo(correo, codigo):
        print("Correo de prueba enviado exitosamente.")
    else:
        print("Error al enviar el correo de prueba.")
