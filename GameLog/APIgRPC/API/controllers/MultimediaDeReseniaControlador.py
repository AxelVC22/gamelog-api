import grpc
import os
import re
from ..ficheros.multimediaResenia import Multimedia_De_Resenia_pb2, Multimedia_De_Resenia_pb2_grpc

class MultimediaDeReseniaControlador(Multimedia_De_Resenia_pb2_grpc.ReviewMultimediaServicer):

    EXTENSIONES_FOTO = {'jpg', 'jpeg', 'png'}
    EXTENSIONES_VIDEO = {'mp4'}
    MAX_FOTOS = 3
    MAX_FOTO_MB = 5  
    MAX_VIDEO_MB = 50 
    CHUNK_SIZE = 64 * 1024 

    def _validar_id_review(self, idReview):
        if not idReview or '..' in idReview or '/' in idReview or '\\' in idReview:
            return False
        return bool(re.match(r'^[a-zA-Z0-9_-]+$', idReview))

    
    def SubirFoto(self, request, context):
        """Sube una foto completa (sin chunks)"""
        idReview = request.idReview
        indice = request.indice
        extension = request.extension.lower()
        datos = request.datos

        if not self._validar_id_review(idReview):
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "ID inválido")

        if extension not in self.EXTENSIONES_FOTO:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Extensión debe ser jpg o png")

        if indice < 1 or indice > self.MAX_FOTOS:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, f"Índice debe ser 1-{self.MAX_FOTOS}")

        if len(datos) > self.MAX_FOTO_MB * 1024 * 1024:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, f"Foto excede {self.MAX_FOTO_MB}MB")

        base = os.getenv("DIRECTORIO_MULTIMEDIA_RESENIAS")
        carpeta = os.path.join(base, idReview)
        os.makedirs(carpeta, exist_ok=True)

        ruta = os.path.join(carpeta, f"{indice}.{extension}")

        try:
            with open(ruta, "wb") as f:
                f.write(datos)

            return Multimedia_De_Resenia_pb2.SubirFotoResponse(
                success=True,
                message=f"Foto {indice} guardada"
            )
        except Exception as e:
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def ObtenerFotos(self, request, context):
        """Obtiene todas las fotos"""
        idReview = request.idReview

        if not self._validar_id_review(idReview):
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "ID inválido")

        base = os.getenv("DIRECTORIO_MULTIMEDIA_RESENIAS")
        carpeta = os.path.join(base, idReview)
        fotos = []

        for i in range(1, self.MAX_FOTOS + 1):
            for ext in self.EXTENSIONES_FOTO:
                ruta = os.path.join(carpeta, f"{i}.{ext}")
                if os.path.exists(ruta):
                    try:
                        with open(ruta, "rb") as f:
                            fotos.append(
                                Multimedia_De_Resenia_pb2.FotoReviewInfo(
                                    indice=i,
                                    datos=f.read()
                                )
                            )
                        break
                    except:
                        continue

        return Multimedia_De_Resenia_pb2.ObtenerFotosResponse(
            idReview=idReview,
            fotos=fotos
        )

    
    def SubirVideo(self, request_iterator, context):
        """Sube un video por chunks (streaming)"""
        archivo = None
        ruta = None
        idReview = None
        total_bytes = 0

        try:
            for chunk_request in request_iterator:
                if idReview is None:
                    idReview = chunk_request.idReview
                    extension = chunk_request.extension.lower()

                    if not self._validar_id_review(idReview):
                        context.abort(grpc.StatusCode.INVALID_ARGUMENT, "ID inválido")

                    if extension not in self.EXTENSIONES_VIDEO:
                        context.abort(grpc.StatusCode.INVALID_ARGUMENT, "Extensión debe ser mp4")

                    base = os.getenv("DIRECTORIO_MULTIMEDIA_RESENIAS")
                    carpeta = os.path.join(base, idReview)
                    os.makedirs(carpeta, exist_ok=True)

                    ruta = os.path.join(carpeta, f"video.{extension}")
                    archivo = open(ruta, "wb")

                archivo.write(chunk_request.chunk)
                total_bytes += len(chunk_request.chunk)

                if total_bytes > self.MAX_VIDEO_MB * 1024 * 1024:
                    archivo.close()
                    os.remove(ruta)
                    context.abort(grpc.StatusCode.INVALID_ARGUMENT, f"Video excede {self.MAX_VIDEO_MB}MB")

            if archivo:
                archivo.close()

            return Multimedia_De_Resenia_pb2.SubirVideoResponse(
                success=True,
                message=f"Video guardado ({total_bytes} bytes)"
            )

        except grpc.RpcError:
            raise
        except Exception as e:
            if archivo:
                archivo.close()
            if ruta and os.path.exists(ruta):
                os.remove(ruta)
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def ObtenerVideo(self, request, context):
        """Obtiene un video por chunks (streaming)"""
        idReview = request.idReview

        if not self._validar_id_review(idReview):
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "ID inválido")

        base = os.getenv("DIRECTORIO_MULTIMEDIA_RESENIAS")
        carpeta = os.path.join(base, idReview)

        ruta = None
        for ext in self.EXTENSIONES_VIDEO:
            temp = os.path.join(carpeta, f"video.{ext}")
            if os.path.exists(temp):
                ruta = temp
                break

        if not ruta:
            context.abort(grpc.StatusCode.NOT_FOUND, "Video no encontrado")

        try:
            tamaño = os.path.getsize(ruta)
            total_chunks = (tamaño + self.CHUNK_SIZE - 1) // self.CHUNK_SIZE

            with open(ruta, "rb") as f:
                chunk_index = 0
                while True:
                    chunk_data = f.read(self.CHUNK_SIZE)
                    if not chunk_data:
                        break

                    yield Multimedia_De_Resenia_pb2.VideoChunk(
                        chunk=chunk_data,
                        chunkIndex=chunk_index,
                        totalChunks=total_chunks
                    )
                    chunk_index += 1

        except Exception as e:
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    
    def ObtenerMetadata(self, request, context):
        """Obtiene metadata"""
        idReview = request.idReview

        if not self._validar_id_review(idReview):
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "ID inválido")

        base = os.getenv("DIRECTORIO_MULTIMEDIA_RESENIAS")
        carpeta = os.path.join(base, idReview)

        num_fotos = 0
        num_videos = 0

        if os.path.exists(carpeta):
            for i in range(1, self.MAX_FOTOS + 1):
                for ext in self.EXTENSIONES_FOTO:
                    if os.path.exists(os.path.join(carpeta, f"{i}.{ext}")):
                        num_fotos += 1
                        break

            for ext in self.EXTENSIONES_VIDEO:
                if os.path.exists(os.path.join(carpeta, f"video.{ext}")):
                    num_videos = 1
                    break

        return Multimedia_De_Resenia_pb2.MetadataResponse(
            numFotos=num_fotos,
            numVideos=num_videos
        )

    def EliminarArchivos(self, request, context):
        """Elimina todos los archivos"""
        idReview = request.idReview

        if not self._validar_id_review(idReview):
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "ID inválido")

        base = os.getenv("DIRECTORIO_MULTIMEDIA_RESENIAS")
        carpeta = os.path.join(base, idReview)

        if not os.path.exists(carpeta):
            return Multimedia_De_Resenia_pb2.EliminarArchivosResponse(
                success=True,
                message="No hay archivos"
            )

        archivos_eliminados = 0

        for i in range(1, self.MAX_FOTOS + 1):
            for ext in self.EXTENSIONES_FOTO:
                ruta = os.path.join(carpeta, f"{i}.{ext}")
                if os.path.exists(ruta):
                    try:
                        os.remove(ruta)
                        archivos_eliminados += 1
                    except:
                        pass

        for ext in self.EXTENSIONES_VIDEO:
            ruta = os.path.join(carpeta, f"video.{ext}")
            if os.path.exists(ruta):
                try:
                    os.remove(ruta)
                    archivos_eliminados += 1
                except:
                    pass

        try:
            if not os.listdir(carpeta):
                os.rmdir(carpeta)
        except:
            pass

        return Multimedia_De_Resenia_pb2.EliminarArchivosResponse(
            success=True,
            message=f"{archivos_eliminados} archivos eliminados"
        )