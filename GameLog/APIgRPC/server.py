import grpc
import os
from dotenv import load_dotenv
from concurrent import futures
from API.controllers.FotosDePerfilControlador import FotosDePerfilControlador 
from API.controllers.MultimediaDeReseniaControlador import MultimediaDeReseniaControlador 
from API.ficheros.fotosDePerfil import Fotos_De_Perfil_pb2_grpc
from API.ficheros.multimediaResenia import Multimedia_De_Resenia_pb2_grpc

load_dotenv()

REQUIRED_ENV_VARS = [
    "DIRECTORIO_FOTOS",
    "RUTAFOTOPORDEFECTO",
    "DIRECTORIO_MULTIMEDIA_RESENIAS",
    "PUERTO_SERVIDOR",
]

for var in REQUIRED_ENV_VARS:
    if not os.getenv(var):
        raise ValueError(f"Variable de entorno faltante: {var}")

os.makedirs(os.getenv("DIRECTORIO_FOTOS"), exist_ok=True)
os.makedirs(os.getenv("DIRECTORIO_MULTIMEDIA_RESENIAS"), exist_ok=True)

ruta_default = os.getenv("RUTAFOTOPORDEFECTO")
if not os.path.exists(ruta_default):
    raise ValueError(f"La foto por defecto no existe: {ruta_default}")



def serve():
    server = grpc.server(
        futures.ThreadPoolExecutor(max_workers=10),
        options=[
            ("grpc.max_send_message_length", 50 * 1024 * 1024),
            ("grpc.max_receive_message_length", 50 * 1024 * 1024)
        ]
    )
    
    Fotos_De_Perfil_pb2_grpc.add_FotosDePerfilServicer_to_server(
        FotosDePerfilControlador(),
        server
    )

    Multimedia_De_Resenia_pb2_grpc.add_ReviewMultimediaServicer_to_server(
        MultimediaDeReseniaControlador(),
        server
    )
    
    server.add_insecure_port(f'[::]:{os.getenv("PUERTO_SERVIDOR")}')
    server.start()
    print(f'Servidor corriendo en el puerto: {os.getenv("PUERTO_SERVIDOR")}')
    
    try:
        server.wait_for_termination()
    except KeyboardInterrupt:
        pass
    finally:
        server.stop(0)

if __name__ == '__main__':
    serve()