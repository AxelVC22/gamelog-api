import grpc
import os
from dotenv import load_dotenv
from concurrent import futures
from API.controllers.FotosDePerfilControlador import FotosDePerfilControlador 
from API.ficheros.fotosDePerfil import Fotos_De_Perfil_pb2_grpc

load_dotenv()
if not os.path.exists(os.getenv("DIRECTORIO_FOTOS")):
    os.makedirs(os.getenv("DIRECTORIO_FOTOS"))
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10),
             options=[("grpc.max_send_message_length", 5 * 1024 * 1024), 
             ("grpc.max_receive_message_length", 5 * 1024 * 1024)])
    Fotos_De_Perfil_pb2_grpc.add_FotosDePerfilServicer_to_server(FotosDePerfilControlador(),server)
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