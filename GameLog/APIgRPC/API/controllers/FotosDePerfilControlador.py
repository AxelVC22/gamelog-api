# API/controllers/FotosDePerfilControlador.py
import grpc
import os
from ..ficheros.fotosDePerfil import Fotos_De_Perfil_pb2, Fotos_De_Perfil_pb2_grpc

class FotosDePerfilControlador(Fotos_De_Perfil_pb2_grpc.FotosDePerfilServicer):
    
    def _buscar_foto_usuario(self, id_jugador):
        """Busca foto del usuario con extensión .jpg, .jpeg o .png"""
        directorio = os.getenv("DIRECTORIO_FOTOS")
        extensiones = ['.jpg', '.jpeg', '.png']
        
        for ext in extensiones:
            ruta = os.path.join(directorio, f"{id_jugador}{ext}")
            if os.path.exists(ruta):
                return ruta, True
        
        return None, False
    
    def _detectar_extension(self, datos_imagen):
        """
        Detecta extensión de imagen desde magic bytes
        PNG: empieza con b'\x89PNG\r\n\x1a\n'
        JPEG: empieza con b'\xff\xd8\xff'
        """
        if datos_imagen.startswith(b'\x89PNG\r\n\x1a\n'):
            return '.png'
        elif datos_imagen.startswith(b'\xff\xd8\xff'):
            return '.jpg'
        else:
            # Default a jpg si no se puede detectar
            return '.jpg'
    
    def _eliminar_fotos_antiguas(self, id_jugador, excepto_ruta):
        """Elimina fotos con extensiones diferentes"""
        directorio = os.getenv("DIRECTORIO_FOTOS")
        extensiones = ['.jpg', '.jpeg', '.png']
        
        for ext in extensiones:
            ruta = os.path.join(directorio, f"{id_jugador}{ext}")
            if os.path.exists(ruta) and os.path.abspath(ruta) != os.path.abspath(excepto_ruta):
                try:
                    os.remove(ruta)
                except Exception:
                    pass
    
    def SubirFoto(self, request, context):
        idJugador = request.idJugador
        datosImagen = request.datos
        directorio = os.getenv("DIRECTORIO_FOTOS")
        
        # Detectar extensión automáticamente
        extension = self._detectar_extension(datosImagen)
        rutaFinalArchivo = os.path.join(directorio, f"{idJugador}{extension}")

        try:
            # Eliminar foto anterior si existe y no es la default
            if os.path.exists(rutaFinalArchivo):
                if os.path.abspath(rutaFinalArchivo) != os.path.abspath(os.getenv("RUTAFOTOPORDEFECTO")):
                    os.remove(rutaFinalArchivo)
            
            # Eliminar fotos con otras extensiones
            self._eliminar_fotos_antiguas(idJugador, rutaFinalArchivo)
            
            # Guardar la nueva foto
            with open(rutaFinalArchivo, "wb") as archivo:
                archivo.write(datosImagen)
                
        except Exception:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Error al querer guardar la imagen en el servidor")
            return Fotos_De_Perfil_pb2.FotoResponse(
                idJugador=idJugador,
                datos=b"",
                success=False,
                message="Error al guardar",
                esDefault=False
            )
        
        context.set_code(grpc.StatusCode.OK)
        context.set_details(f"Foto guardada de manera correcta")
        return Fotos_De_Perfil_pb2.FotoResponse(
            idJugador=idJugador,
            datos=b"",
            success=True,
            message="Foto guardada correctamente",
            esDefault=False
        )
    
    def ObtenerFoto(self, request, context):
        idJugador = request.idJugador
        
        # Buscar foto del usuario
        rutaImagen, existe = self._buscar_foto_usuario(idJugador)
        
        try:
            if existe:
                # Foto del usuario encontrada
                with open(rutaImagen, "rb") as archivo:
                    datos = archivo.read()
                
                context.set_code(grpc.StatusCode.OK)
                context.set_details("Foto del usuario encontrada")
                return Fotos_De_Perfil_pb2.FotoResponse(
                    idJugador=idJugador,
                    datos=datos,
                    success=True,
                    message="Foto del usuario",
                    esDefault=False
                )
            else:
                # Devolver foto por defecto
                rutaFotoDefault = os.getenv("RUTAFOTOPORDEFECTO")
                
                with open(rutaFotoDefault, "rb") as archivo:
                    datos = archivo.read()
                
                context.set_code(grpc.StatusCode.OK)
                context.set_details("Foto de perfil no encontrada, devolviendo default")
                return Fotos_De_Perfil_pb2.FotoResponse(
                    idJugador=idJugador,
                    datos=datos,
                    success=True,
                    message="Foto por defecto",
                    esDefault=True
                )
                    
        except FileNotFoundError:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("La imagen de perfil no fue encontrada.")
            return Fotos_De_Perfil_pb2.FotoResponse(
                idJugador=idJugador,
                datos=b"",
                success=False,
                message="Imagen no encontrada",
                esDefault=False
            )
        except Exception:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Error al leer la imagen")
            return Fotos_De_Perfil_pb2.FotoResponse(
                idJugador=idJugador,
                datos=b"",
                success=False,
                message="Error al leer la imagen",
                esDefault=False
            )
    
    def ActualizarFoto(self, request, context):
        # Actualizar es lo mismo que subir (sobrescribe)
        return self.SubirFoto(request, context)