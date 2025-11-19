CREATE DATABASE GameLogDB;
GO

USE GameLogDB;
GO

CREATE LOGIN adminGameLog WITH PASSWORD = 'ProvisionalPassword123.';
GO

CREATE LOGIN jugadorGameLog WITH PASSWORD = 'ProvisionalPassword123.';
GO

CREATE USER [adminGameLog] FOR LOGIN [adminGameLog] WITH DEFAULT_SCHEMA=[dbo]
GO

CREATE USER [jugadorGameLog] FOR LOGIN [jugadorGameLog] WITH DEFAULT_SCHEMA=[dbo]
GO

ALTER ROLE [db_owner] ADD MEMBER [adminGameLog]
GO
ALTER ROLE [db_accessadmin] ADD MEMBER [adminGameLog]
GO
ALTER ROLE [db_backupoperator] ADD MEMBER [adminGameLog]
GO
ALTER ROLE [db_datareader] ADD MEMBER [adminGameLog]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [adminGameLog]
GO
ALTER ROLE [db_datareader] ADD MEMBER [jugadorGameLog]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [jugadorGameLog]
GO

USE [GameLogDB]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_VerificarMeGustaAResenia]
(
	@idJugadorBuscador INT,
	@idResenia INT
)
RETURNS BIT
AS
BEGIN
	RETURN (
		SELECT CASE 
			WHEN EXISTS (
				SELECT 1 FROM MeGusta WHERE idResenia = @idResenia AND idJugador = @idJugadorBuscador
			) THEN 1 ELSE 0
		END
	)
END
GO
/****** Object:  Table [dbo].[MeGusta]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MeGusta](
	[idJugador] [int] NOT NULL,
	[idResenia] [int] NOT NULL,
	[idMeGusta] [int] IDENTITY(1,1) NOT NULL,
CONSTRAINT [PK_MeGusta] PRIMARY KEY CLUSTERED 
(
	[idMeGusta] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  UserDefinedFunction [dbo].[fn_ObtenerMeGustaDeReseña]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[fn_ObtenerMeGustaDeReseña]
(	
	@idResenia INT
)
RETURNS TABLE 
AS
RETURN 
(
	SELECT COUNT(*) AS totalDeMeGusta
    FROM MeGusta
    WHERE idResenia = @idResenia
	GROUP BY idResenia
)
GO
/****** Object:  Table [dbo].[Accesos]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Accesos](
	[correo] [varchar](255) NOT NULL,
	[contrasenia] [varchar](255) NOT NULL,
	[idCuenta] [int] IDENTITY(1,1) NOT NULL,
	[estado] [varchar](10) NOT NULL,
	[tipoDeAcceso] [int] NOT NULL,
 CONSTRAINT [PK_Accesos] PRIMARY KEY CLUSTERED 
(
	[idCuenta] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Favoritos]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Favoritos](
	[idJugador] [int] NOT NULL,
	[idJuego] [int] NOT NULL,
	[idFavorito] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK_Favoritos] PRIMARY KEY CLUSTERED 
(
	[idFavorito] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notificaciones]    Script Date: 26/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO 
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notificaciones](
	[idNotificacion] [int] IDENTITY(1,1) NOT NULL,
	[idJugadorNotificado] [int] NOT NULL,
	[idJugadorNotificante] [int] NOT NULL,
	[mensajeNotificacion] [varchar](255) NOT NULL,
	[fechaNotificacion] [date] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Juegos]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Juegos](
	[idJuego] [int] NOT NULL,
	[nombre] [varchar](100) NOT NULL,
	[fechaDeLanzamiento] [date] NOT NULL,
 CONSTRAINT [PK_Juegos] PRIMARY KEY CLUSTERED 
(
	[idJuego] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Jugadores]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Jugadores](
	[nombre] [varchar](80) NOT NULL,
	[primerApellido] [varchar](80) NOT NULL,
	[segundoApellido] [varchar](80) NULL,
	[nombreDeUsuario] [varchar](20) NOT NULL,
	[descripcion] [varchar](200) NULL,
	[foto] [varchar](255) NOT NULL,
	[idJugador] [int] IDENTITY(1,1) NOT NULL,
	[idAcceso] [int] NOT NULL,
 CONSTRAINT [PK_Jugadores] PRIMARY KEY CLUSTERED 
(
	[idJugador] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Pendientes]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pendientes](
	[idPendientes] [int] IDENTITY(1,1) NOT NULL,
	[idJugador] [int] NOT NULL,
	[idJuego] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[idPendientes] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reseñas]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reseñas](
	[idJugador] [int] NOT NULL,
	[idJuego] [int] NOT NULL,
	[fecha] [date] NOT NULL,
	[opinion] [varchar](200) NULL,
	[calificacion] [decimal](3, 1) NULL,
	[idResenia] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK_Reseñas] PRIMARY KEY CLUSTERED 
(
	[idResenia] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Seguidor]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Seguidor](
	[idSeguidor] [int] IDENTITY(1,1) NOT NULL,
	[idJugadorSeguidor] [int] NOT NULL,
	[idJugadorSeguido] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TiposDeAccesos]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TiposDeAccesos](
	[idTipoDeAcceso] [int] IDENTITY(1,1) NOT NULL,
	[tipoDeAcceso] [varchar](13) NOT NULL,
 CONSTRAINT [PK_TiposDeAccesos] PRIMARY KEY CLUSTERED 
(
	[idTipoDeAcceso] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Accesos] ADD  DEFAULT ((2)) FOR [tipoDeAcceso]
GO
ALTER TABLE [dbo].[Accesos]  WITH NOCHECK ADD  CONSTRAINT [TipoDeAcceso-Acceso] FOREIGN KEY([tipoDeAcceso])
REFERENCES [dbo].[TiposDeAccesos] ([idTipoDeAcceso])
GO
ALTER TABLE [dbo].[Accesos] NOCHECK CONSTRAINT [TipoDeAcceso-Acceso]
GO
ALTER TABLE [dbo].[Favoritos]  WITH NOCHECK ADD  CONSTRAINT [Juegos-Favoritos] FOREIGN KEY([idJuego])
REFERENCES [dbo].[Juegos] ([idJuego])
GO
ALTER TABLE [dbo].[Favoritos] NOCHECK CONSTRAINT [Juegos-Favoritos]
GO
ALTER TABLE [dbo].[Favoritos]  WITH NOCHECK ADD  CONSTRAINT [Jugador-Favorito] FOREIGN KEY([idJugador])
REFERENCES [dbo].[Jugadores] ([idJugador])
GO
ALTER TABLE [dbo].[Favoritos] NOCHECK CONSTRAINT [Jugador-Favorito]
GO
ALTER TABLE [dbo].[Jugadores]  WITH NOCHECK ADD  CONSTRAINT [Acceso-Jugador] FOREIGN KEY([idAcceso])
REFERENCES [dbo].[Accesos] ([idCuenta])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Jugadores] NOCHECK CONSTRAINT [Acceso-Jugador]
GO
ALTER TABLE [dbo].[MeGusta]  WITH NOCHECK ADD  CONSTRAINT [Jugador-MeGusta] FOREIGN KEY([idJugador])
REFERENCES [dbo].[Jugadores] ([idJugador])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[MeGusta] NOCHECK CONSTRAINT [Jugador-MeGusta]
GO
ALTER TABLE [dbo].[MeGusta]  WITH NOCHECK ADD  CONSTRAINT [Reseña-MeGusta] FOREIGN KEY([idResenia])
REFERENCES [dbo].[Reseñas] ([idResenia])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[MeGusta] NOCHECK CONSTRAINT [Reseña-MeGusta]
GO
ALTER TABLE [dbo].[Pendientes]  WITH CHECK ADD  CONSTRAINT [Juego-Pendiente] FOREIGN KEY([idJuego])
REFERENCES [dbo].[Juegos] ([idJuego])
GO
ALTER TABLE [dbo].[Pendientes] CHECK CONSTRAINT [Juego-Pendiente]
GO
ALTER TABLE [dbo].[Pendientes]  WITH CHECK ADD  CONSTRAINT [Jugador-Pendiente] FOREIGN KEY([idJugador])
REFERENCES [dbo].[Jugadores] ([idJugador])
GO
ALTER TABLE [dbo].[Pendientes] CHECK CONSTRAINT [Jugador-Pendiente]
GO
ALTER TABLE [dbo].[Reseñas]  WITH NOCHECK ADD  CONSTRAINT [Juego-Reseña] FOREIGN KEY([idJuego])
REFERENCES [dbo].[Juegos] ([idJuego])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Reseñas] NOCHECK CONSTRAINT [Juego-Reseña]
GO
ALTER TABLE [dbo].[Reseñas]  WITH CHECK ADD  CONSTRAINT [Jugador-Reseña] FOREIGN KEY([idJugador])
REFERENCES [dbo].[Jugadores] ([idJugador])
GO
ALTER TABLE [dbo].[Reseñas] CHECK CONSTRAINT [Jugador-Reseña]
GO
ALTER TABLE [dbo].[Seguidor]  WITH NOCHECK ADD  CONSTRAINT [Jugador-Seguidor] FOREIGN KEY([idJugadorSeguidor])
REFERENCES [dbo].[Jugadores] ([idJugador])
GO
ALTER TABLE [dbo].[Seguidor] NOCHECK CONSTRAINT [Jugador-Seguidor]
GO
/****** Object:  StoredProcedure [dbo].[spa_Acceso]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[spa_Acceso]
	@idAcceso INT,
	@correo VARCHAR(255) = NULL,
	@contrasenia VARCHAR(255) = NULL,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF EXISTS (SELECT * FROM Accesos WHERE idCuenta = @idAcceso)
		BEGIN
			IF NOT EXISTS (SELECT * FROM Accesos WHERE correo = @correo AND idCuenta <> @idAcceso)
			BEGIN
				BEGIN TRANSACTION
					UPDATE Accesos
					SET correo = ISNULL(@correo,correo),
					contrasenia = ISNULL(@contrasenia,contrasenia)
					WHERE idCuenta = @idAcceso;
				COMMIT TRANSACTION
				SET @estado = 200;
				SET @mensaje = 'Los datos de acceso al sistema han sido modificados con éxito.';
			END
			ELSE
			BEGIN
				SET @estado = 400;
				SET @mensaje = 'El correo nuevo que desea ingresar ya se encuentra registrado.';
			END
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'El ID de la cuenta ingresada no existe.';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spa_EstadoAccesos]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spa_EstadoAccesos]
	@idAcceso INT,
	@estadoAcceso VARCHAR(10),
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
	IF EXISTS (SELECT * FROM Accesos WHERE idCuenta = @idAcceso)
	BEGIN
		BEGIN TRANSACTION
			UPDATE Accesos
			SET estado = @estadoAcceso
			WHERE idCuenta = @idAcceso;
		COMMIT TRANSACTION
		SET @estado = 200;
		SET @mensaje = 'El estado de la cuenta ha sido modificada con éxito';
	END
	ELSE
	BEGIN
		SET @estado = 400;
		SET @mensaje = 'El ID de la cuenta ingresada no existe.';
	END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spa_Jugadores]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spa_Jugadores]
	@idJugador INT,
	@nombre VARCHAR(80) = NULL,
	@primerApellido VARCHAR(80) = NULL,
	@segundoApellido VARCHAR(80) = NULL,
	@nombreDeUsuario VARCHAR(20) = NULL,
	@descripcion VARCHAR(200) = NULL,
	@foto VARCHAR(255) = NULL,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF EXISTS (SELECT * FROM Jugadores WHERE idJugador = @idJugador)
		BEGIN
			IF NOT EXISTS (SELECT * FROM Jugadores WHERE nombreDeUsuario = @nombreDeUsuario  AND idJugador <> @idJugador)
			BEGIN
				BEGIN TRANSACTION
					UPDATE Jugadores 
					SET nombre = ISNULL(@nombre,nombre), 
					primerApellido = ISNULL(@primerApellido,primerApellido), 
					segundoApellido = ISNULL(@segundoApellido,segundoApellido), 
					nombreDeUsuario = ISNULL(@nombreDeUsuario,nombreDeUsuario), 
					descripcion = ISNULL(@descripcion,descripcion), 
					foto = ISNULL(@foto,foto) 
					WHERE idJugador = @idJugador;
				COMMIT TRANSACTION
				SET @estado = 200;
				SET @mensaje = 'El perfil del jugador ha sido editado de manera exitosa.'
			END
			ELSE
			BEGIN
				SET @estado = 400;
				SET @mensaje = 'El nuevo nombre de usuario que desea ingresar ya se encuentra registrado.'
			END
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'La cuenta que desea editar, no se encuentra registrada.'
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spb_BuscarJuegoPorId]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_BuscarJuegoPorId]
	@idJuego INT
AS
BEGIN
	SELECT j.idJuego, j.nombre
    FROM Juegos j
    WHERE j.idJuego = @idJuego;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_BuscarJuegoPorNombre]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_BuscarJuegoPorNombre]
	@nombre VARCHAR(100)
AS
BEGIN
	SELECT j.idJuego, j.nombre
	FROM Juegos j 
    WHERE j.nombre = @nombre;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_BuscarJugador]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_BuscarJugador] 
	@nombreDeUsuario VARCHAR(20)
AS
BEGIN
	SELECT a.idCuenta,a.correo,a.estado,ta.tipoDeAcceso,j.idJugador,j.nombre,j.primerApellido,j.segundoApellido,j.nombreDeUsuario,j.descripcion,j.foto
    FROM Jugadores j JOIN Accesos a ON a.idCuenta = j.idAcceso 
	JOIN TiposDeAccesos ta ON a.tipoDeAcceso = ta.idTipoDeAcceso 
    WHERE j.nombreDeUsuario = @nombreDeUsuario;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_BuscarLogin]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_BuscarLogin]
	@correo VARCHAR(255),
	@contrasenia VARCHAR(255)
AS
BEGIN
	SELECT a.idCuenta,a.correo,a.estado,ta.tipoDeAcceso,j.idJugador,j.nombre,j.primerApellido,j.segundoApellido,j.nombreDeUsuario,j.descripcion,j.foto
    FROM Accesos a JOIN Jugadores j ON a.idCuenta = j.idAcceso
    JOIN TiposDeAccesos ta ON a.tipoDeAcceso = ta.idTipoDeAcceso 
    WHERE a.correo = @correo AND a.contrasenia = @contrasenia;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_ConsultarJugadoresSeguidores]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_ConsultarJugadoresSeguidores]
	@idJugadorSeguido INT
AS
BEGIN
	SELECT j.nombre, j.primerApellido, j.segundoApellido, j.nombreDeUsuario, j.descripcion, j.foto, j.idJugador
    FROM Seguidor AS s
    JOIN Jugadores AS j ON s.idJugadorSeguidor = j.idJugador
    WHERE s.idJugadorSeguido = @idJugadorSeguido;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_ConsultarJugadoresSeguidos]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_ConsultarJugadoresSeguidos]
	@idJugadorSeguidor INT
AS
BEGIN
	SELECT j.nombre, j.primerApellido, j.segundoApellido, j.nombreDeUsuario, j.descripcion, j.foto, j.idJugador
    FROM Seguidor AS s 
    JOIN Jugadores AS j ON s.idJugadorSeguido = j.idJugador
    WHERE s.idJugadorSeguidor = @idJugadorSeguidor;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_JuegosEnTendencia]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_JuegosEnTendencia]
	@fechaInicioBusqueda DATE,
	@fechaFinBusqueda DATE
AS
BEGIN
	SELECT TOP 5
	J.idJuego,
	J.nombre,
	COUNT(R.idJuego) AS totalReseñas
	FROM Juegos J
	INNER JOIN Reseñas R on R.idJuego = J.idJuego
	WHERE R.fecha BETWEEN @fechaInicioBusqueda AND @fechaFinBusqueda
	GROUP BY J.idJuego,J.nombre
	ORDER BY totalReseñas DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_JuegosRevivalRetro]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_JuegosRevivalRetro]
	@fechaInicioBusqueda DATE,
	@fechaFinBusqueda DATE
AS
BEGIN
	SELECT TOP 5
	J.idJuego,
	J.nombre,
	COUNT(R.idJuego) AS totalReseñas
	FROM Juegos J
	INNER JOIN Reseñas R on R.idJuego = J.idJuego
	WHERE (R.fecha BETWEEN @fechaInicioBusqueda AND @fechaFinBusqueda) AND (J.fechaDeLanzamiento < '2000-01-01')
	GROUP BY J.idJuego,J.nombre
	ORDER BY totalReseñas DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_ObtenerIdDeAccesoPorCorreo]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_ObtenerIdDeAccesoPorCorreo] 
	@correo VARCHAR(255)
AS
BEGIN
	SELECT idCuenta FROM Accesos where correo = @correo;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_ObtenerJuegosFavoritos]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_ObtenerJuegosFavoritos] 
	@idJugador INT
AS
BEGIN
	SELECT j.idJuego, j.nombre
    FROM Juegos AS j
    JOIN Favoritos AS f ON j.idJuego = f.idJuego
    WHERE  f.idJugador = @idJugador;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_ObtenerJuegosPendientes]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_ObtenerJuegosPendientes]
	@idJugador INT
AS
BEGIN
	SELECT j.idJuego, j.nombre
    FROM Juegos AS j 
    JOIN Pendientes AS p ON j.idJuego = p.idJuego 
    WHERE  p.idJugador = @idJugador
END
GO
/****** Object:  StoredProcedure [dbo].[spb_ObtenerReseñasDeJugador]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_ObtenerReseñasDeJugador]
	@idJugador INT,
	@idJugadorBuscador INT
AS
BEGIN
	SELECT DISTINCT 
	R.idResenia,
	R.idJugador,
	J.idJuego,
	J.nombre,
	R.fecha,
	R.opinion,
	R.calificacion,
	ISNULL(L.totalDeMeGusta,0) AS totalDeMeGusta,
	dbo.fn_VerificarMeGustaAResenia(@idJugadorBuscador,R.idResenia) AS existeLike
    FROM Reseñas AS R
    JOIN Juegos AS J ON J.idJuego = R.idJuego
    OUTER APPLY dbo.fn_ObtenerMeGustaDeReseña(R.idResenia) AS L
    WHERE R.idJugador = @idJugador;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_ObtenerNotificaciones]    Script Date: 26/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_ObtenerNotificaciones]
	@idJugador INT
AS
BEGIN
	SELECT DISTINCT 
		N.idNotificacion,
		N.idJugadorNotificado,
		N.idJugadorNotificante,
		N.mensajeNotificacion,
		N.fechaNotificacion
    FROM Notificaciones N
    WHERE N.idJugadorNotificado = @idJugador
END
GO
/****** Object:  StoredProcedure [dbo].[spd_Notificaciones]    Script Date: 26/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spd_Notificaciones]
	@idNotificacion INT,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF EXISTS (SELECT * FROM Notificaciones WHERE idNotificacion = @idNotificacion)
		BEGIN
			BEGIN TRANSACTION
				DELETE FROM Notificaciones WHERE idNotificacion = @idNotificacion;
			COMMIT TRANSACTION
			SET @estado = 200;
			SET @mensaje = 'La notificación ha sido eliminada con éxito.';
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'No se ha encontrado la notificacion a eliminar.';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spb_ObtenerReseñasDeUnJuego]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_ObtenerReseñasDeUnJuego]
	@idJuego INT,
	@idJugadorBuscador INT
AS
BEGIN
	SELECT DISTINCT 
	R.idResenia,
	J.idJugador,
	J.nombreDeUsuario,
	J.foto,
	JG.idJuego,
	JG.nombre,
	R.fecha,
	R.opinion,
	R.calificacion,
	ISNULL(L.totalDeMeGusta,0) AS totalDeMeGusta,
	dbo.fn_VerificarMeGustaAResenia(@idJugadorBuscador,R.idResenia) AS existeMeGusta
    FROM Reseñas AS R 
    JOIN Juegos AS JG ON JG.idJuego = R.idJuego 
    JOIN Jugadores AS J ON R.idJugador = J.idJugador
    OUTER APPLY dbo.fn_ObtenerMeGustaDeReseña(R.idResenia) AS L 
    WHERE R.idJuego = @idJuego;
END
GO
/****** Object:  StoredProcedure [dbo].[spb_ObtenerReseñasDeUnJuegoReseñadoPorJugadoresSeguidos]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spb_ObtenerReseñasDeUnJuegoReseñadoPorJugadoresSeguidos]
	@idJuego INT,
	@idJugador INT
AS
BEGIN
	SELECT DISTINCT 
	R.idResenia,
	J.idJugador,
	J.nombreDeUsuario,
	J.foto,
	JG.idJuego,
	JG.nombre,
	R.fecha,
	R.opinion,
	R.calificacion,
	ISNULL(L.totalDeMeGusta,0) AS totalDeMeGusta,
	dbo.fn_VerificarMeGustaAResenia(@idJugador,R.idResenia) AS existeMeGusta
    FROM Reseñas AS R
    JOIN Juegos AS JG ON JG.idJuego = R.idJuego
    JOIN Jugadores AS J ON R.idJugador = J.idJugador 
    JOIN Seguidor AS S ON S.idJugadorSeguido = R.idJugador
	OUTER APPLY dbo.fn_ObtenerMeGustaDeReseña(R.idResenia) AS L
    WHERE R.idJuego = @idJuego AND S.idJugadorSeguidor = @idJugador;
END
GO
/****** Object:  StoredProcedure [dbo].[spd_Acceso]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spd_Acceso]
	@idAcceso INT = NULL,
	@correo VARCHAR(255) = NULL,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF EXISTS (SELECT * FROM Accesos WHERE idCuenta = @idAcceso OR correo = @correo)
		BEGIN
			BEGIN TRANSACTION
				DELETE FROM Accesos WHERE idCuenta = @idAcceso;
				DELETE FROM Jugadores WHERE idAcceso = @idAcceso;
			COMMIT TRANSACTION
			SET @estado = 200;
			SET @mensaje = 'El acceso ha sido eliminado con éxito';
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'No se ha encontrado el acceso a eliminar';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spd_Favorito]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[spd_Favorito]
	@idJugador INT,
	@idJuego INT,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
BEGIN TRY
		IF EXISTS (SELECT * FROM Favoritos WHERE idJugador = @idJugador AND idJuego = @idJuego)
		BEGIN
			BEGIN TRANSACTION
				DELETE FROM Favoritos WHERE idJugador = @idJugador AND idJuego = @idJuego;
			COMMIT TRANSACTION
			SET @estado = 200;
			SET @mensaje = 'El Juego favorito ha sido eliminado con éxito';
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'No se ha encontrado el juego favorito a eliminar';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spd_Juego]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spd_Juego]
	@idJuego INT,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
BEGIN TRY
		IF EXISTS (SELECT * FROM Juegos WHERE idJuego = @idJuego)
		BEGIN
			BEGIN TRANSACTION
				DELETE FROM Reseñas WHERE idJuego = @idJuego;
				DELETE FROM Favoritos WHERE idJuego = @idJuego;
				DELETE FROM Pendientes WHERE idJuego = @idJuego;
				DELETE FROM Juegos WHERE idJuego = @idJuego;
			COMMIT TRANSACTION
			SET @estado = 200;
			SET @mensaje = 'El Juego ha sido eliminado con éxito';
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'No se ha encontrado el juego a eliminar';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spd_Jugador]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spd_Jugador]
	@idJugador INT,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF EXISTS (SELECT * FROM Jugadores WHERE idJugador = @idJugador)
		BEGIN
			BEGIN TRANSACTION
				DECLARE @idAcceso INT;
				SET @idAcceso = (SELECT idAcceso FROM Jugadores WHERE idJugador = @idJugador);
				DELETE FROM Accesos WHERE idCuenta = @idAcceso;
				DELETE FROM MeGusta WHERE idJugador = @idJugador;
				DELETE FROM Seguidor WHERE idJugadorSeguidor = @idJugador;
				DELETE FROM Favoritos WHERE idJugador = @idJugador;
				DELETE FROM Reseñas WHERE idJugador = @idJugador;
				DELETE FROM Pendientes WHERE idJugador = @idJugador;
				DELETE FROM Jugadores WHERE idJugador = @idJugador;
				
			COMMIT TRANSACTION
			SET @estado = 200;
			SET @mensaje = 'El Jugador ha sido eliminado con éxito.';
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'No se ha encontrado el Jugador a eliminar.';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spd_MeGusta]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spd_MeGusta]
	@idResenia INT,
	@idJugador INT,
	@mensajeNotificacion VARCHAR(255),
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF EXISTS (SELECT * FROM MeGusta WHERE idResenia = @idResenia)
		BEGIN
			IF EXISTS (SELECT * FROM MeGusta WHERE idJugador = @idJugador)
			BEGIN
				BEGIN TRANSACTION
					DELETE FROM MeGusta WHERE idJugador = @idJugador AND idResenia = @idResenia;
					DECLARE @idJugadorNotificado INT;
					SET @idJugadorNotificado = (SELECT TOP 1 idJugador FROM Reseñas WHERE idResenia = @idResenia);
					IF @idJugadorNotificado != @idJugador
					BEGIN
						DECLARE @nombreDeUsuario VARCHAR(20);
						DECLARE @idNotificacion INT;
						SET @nombreDeUsuario = (SELECT TOP 1 nombreDeUsuario FROM Jugadores WHERE idJugador = @idJugador);
						DELETE FROM Notificaciones WHERE mensajeNotificacion = @mensajeNotificacion;
					END
				COMMIT TRANSACTION
				SET @estado = 200;
				SET @mensaje = 'El me gusta ha sido eliminado correctamente.';
			END
			ELSE
			BEGIN
				SET @estado = 400;
				SET @mensaje = 'El jugador que desea quitar el me gusta no ha sido encontrado.';
			END
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'La reseña a quitarle me gusta no ha sido encontrada.';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spd_Pendientes]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spd_Pendientes]
	@idJugador INT,
	@idJuego INT,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF EXISTS (SELECT * FROM Pendientes WHERE idJuego = @idJuego AND idJugador = @idJugador)
		BEGIN
			BEGIN TRANSACTION
				DELETE FROM Pendientes WHERE idJuego = @idJuego AND idJugador = @idJugador;
			COMMIT TRANSACTION
			SET @estado = 200;
			SET @mensaje = 'El juego ha sido eliminado de la lista para reseñar más tarde de manera éxitosa.';
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'No se ha podido encontrar el juego a reseñar más tarde.';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'ERROR: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spd_Reseñas]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spd_Reseñas]
	@idReseña INT,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF EXISTS (SELECT * FROM Reseñas WHERE idResenia = @idReseña)
		BEGIN
			BEGIN TRANSACTION
				DELETE FROM Reseñas WHERE idResenia = @idReseña;
			COMMIT TRANSACTION
			SET @estado = 200;
			SET @mensaje = 'La reseña ha sido eliminada con éxito.';
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'El ID de reseña ingresado no se encuentra registrado.';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spd_Seguidor]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spd_Seguidor]
	@idJugadorSeguidor INT,
	@idJugadorSeguido INT,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF EXISTS (SELECT * FROM Seguidor WHERE idJugadorSeguidor = @idJugadorSeguidor AND idJugadorSeguido = @idJugadorSeguido)
		BEGIN
			BEGIN TRANSACTION
				DELETE FROM Seguidor WHERE idJugadorSeguidor = @idJugadorSeguidor AND idJugadorSeguido = @idJugadorSeguido;
				DECLARE @nombreDeUsuario VARCHAR(20);
				DECLARE @mensajeNotificacion VARCHAR(255);
				SET @nombreDeUsuario = (SELECT TOP 1 nombreDeUsuario FROM Jugadores WHERE idJugador = @idJugadorSeguidor);
				SET @mensajeNotificacion = CONCAT(@nombreDeUsuario,' ha comenzado a seguirte.');
				DELETE FROM Notificaciones WHERE mensajeNotificacion = @mensajeNotificacion AND idJugadorNotificado = @idJugadorSeguido;
			COMMIT TRANSACTION
			SET @estado = 200;
			SET @mensaje = 'El jugador seguido ha sido eliminado con éxito.';
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'No se ha encontrado el seguimiento a eliminar.';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spi_Acceso]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spi_Acceso]
	@correo varchar(255),
	@contrasenia varchar(255),
	@estado varchar(10),
	@nombre varchar(80),
	@primerApellido varchar(80),
	@segundoApellido varchar(80) = NULL,
	@nombreDeUsuario varchar(20),
	@descripcion varchar(200) = NULL,
	@foto varchar(255),
	@tipoDeAcceso VARCHAR(13),
	@resultado INT OUTPUT,
	@mensaje NVARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM Accesos WHERE correo = @correo)
		BEGIN
			IF NOT EXISTS (SELECT * FROM Jugadores WHERE nombreDeUsuario = @nombreDeUsuario)
			BEGIN
				DECLARE @idTipoDeAcceso INT;
				SET @idTipoDeAcceso = (SELECT TOP 1 idTipoDeAcceso FROM TiposDeAccesos WHERE tipoDeAcceso = @tipoDeAcceso);
				IF @idTipoDeAcceso IS NOT NULL
				BEGIN
					BEGIN TRANSACTION
						DECLARE @idAcceso INT;
						INSERT INTO Accesos (correo,contrasenia,estado,tipoDeAcceso) VALUES (@correo,@contrasenia,@estado,@idTipoDeAcceso);
						SET @idAcceso = SCOPE_IDENTITY();
						INSERT INTO Jugadores (nombre,primerApellido,segundoApellido,nombreDeUsuario,descripcion,foto,idAcceso) VALUES (@nombre,@primerApellido,@segundoApellido,@nombreDeUsuario,@descripcion,@foto,@idAcceso);
					COMMIT TRANSACTION
					SET @resultado = 200;
					SET @mensaje = 'La nueva cuenta de acceso ha sido registrada correctamente.';
				END
				ELSE
				BEGIN
					SET @resultado = 400;
					SET @mensaje = 'No se ha encontrado el tipo de acceso que desea asignarle al usuario.';
				END
			END
			ELSE
			BEGIN
				SET @resultado = 400;
				SET @mensaje = 'El nombre de usuario ingresado ya se encuentra registrado.';
			END
		END
		ELSE
		BEGIN
			SET @resultado = 400;
			SET @mensaje = 'El correo ingresado ya se encuentra registrado.';
		END
	END TRY
	BEGIN CATCH
		IF XACT_STATE() <> 0
		BEGIN
			ROLLBACK TRANSACTION;
		END
		SET @resultado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spi_Favoritos]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spi_Favoritos]
	@idJugador INT,
	@idJuego INT,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM Favoritos where idJuego = @idJuego AND idJugador = @idJugador)
		BEGIN
			DECLARE @conteoJugador INT;
			SELECT @conteoJugador = COUNT(*) 
			FROM Favoritos 
			WHERE idJugador = @idJugador;
			IF @conteoJugador <= 3
			BEGIN
				BEGIN TRANSACTION
				INSERT INTO Favoritos (idJuego,idJugador) VALUES (@idJuego,@idJugador);
				COMMIT TRANSACTION
				SET @estado = 200;
				SET @mensaje = 'El juego ha sido agregado a favoritos de manera correcta'; 
			END
			ELSE
			BEGIN
				SET @estado = 400;
				SET @mensaje = 'Solo se puede tener un máximo de 4 juegos agregados como favoritos'; 
			END
		END
		ELSE
		BEGIN 
			SET @estado = 400;
			SET @mensaje = 'El juego ya se encuentra agregado a favoritos'; 
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE(); 
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spi_Juegos]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spi_Juegos]
	@idJuego INT,
	@nombre VARCHAR(100),
	@fechaDeLanzamiento DATE,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM Juegos WHERE nombre = @nombre OR idJuego = @idJuego)
		BEGIN 
			BEGIN TRANSACTION
				INSERT INTO Juegos (idJuego,nombre,fechaDeLanzamiento) VALUES (@idJuego,@nombre,@fechaDeLanzamiento);
			COMMIT TRANSACTION
			SET @estado = 200;
			SET @mensaje = 'El juego se ha registrado con exito';
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'El juego que desea ingresar, ya se encuentra registrado';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spi_MeGusta]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spi_MeGusta]
	@idJugador INT,
	@idResenia INT,
	@mensajeNotificacion VARCHAR(255),
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF EXISTS (SELECT * FROM Jugadores WHERE idJugador = @idJugador)
		BEGIN
			IF EXISTS (SELECT * FROM Reseñas WHERE idResenia = @idResenia)
			BEGIN
				IF NOT EXISTS (SELECT * FROM MeGusta WHERE idJugador = @idJugador AND idResenia = @idResenia)
				BEGIN
					BEGIN TRANSACTION
						INSERT INTO MeGusta (idJugador,idResenia) VALUES (@idJugador,@idResenia);
						DECLARE @idJugadorNotificado INT;
						SET @idJugadorNotificado = (SELECT TOP 1 idJugador FROM Reseñas WHERE idResenia = @idResenia);
						IF @idJugadorNotificado != @idJugador
						BEGIN
							DECLARE @nombreDeUsuario VARCHAR(20);
							SET @nombreDeUsuario = (SELECT TOP 1 nombreDeUsuario FROM Jugadores WHERE idJugador = @idJugador);
							INSERT INTO Notificaciones (idJugadorNotificado,idJugadorNotificante,fechaNotificacion,mensajeNotificacion) VALUES (@idJugadorNotificado,@idJugador,CAST(GETDATE() AS DATE),@mensajeNotificacion);
						END
					COMMIT TRANSACTION
					SET @estado = 200;
					SET @mensaje = 'Se ha registrado un me gusta de manera exitosa.';
				END
				ELSE
				BEGIN
					SET @estado = 400;
					SET @mensaje = 'No es posible darle me gusta, ya se ha dado me gusta a la reseña.';
				END
			END
			ELSE
			BEGIN
				SET @estado = 400;
				SET @mensaje = 'El id de la reseña ingresada no existe en la base de datos.';
			END
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'El id del jugador ingresado no existe en la base de datos.';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spi_Pendientes]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spi_Pendientes]
	@idJugador INT,
	@idJuego INT,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM Reseñas WHERE idJugador = @idJugador AND idJuego = @idJuego)
		BEGIN
			IF NOT EXISTS (SELECT * FROM Pendientes WHERE idJuego = @idJuego AND idJugador = @idJugador)
			BEGIN
				BEGIN TRANSACTION
					INSERT INTO Pendientes (idJuego,idJugador) VALUES (@idJuego,@idJugador);
				COMMIT TRANSACTION
				SET @estado = 200;
				SET @mensaje = 'El juego ha sido guardado a la lista de reseñar más tarde, de manera éxitosa.';
			END
			ELSE
			BEGIN
				SET @estado = 400;
				SET @mensaje = 'El juego ya se ha guardado para reseñar más tarde.';
			END
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'Juego ya reseñado. No se puede realizar más de una reseña a un juego ya reseñado.';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'ERROR: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spi_Reseña]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[spi_Reseña]
	@idJugador INT,
	@idJuego INT,
	@opinion VARCHAR(200),
	@calificacion DECIMAL(3,1),
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM Reseñas WHERE idJugador = @idJugador AND idJuego = @idJuego)
		BEGIN
			BEGIN TRANSACTION
				INSERT INTO Reseñas (idJugador,idJuego,fecha,opinion,calificacion) VALUES (@idJugador,@idJuego,CAST(GETDATE() AS DATE),@opinion,@calificacion);
				DELETE FROM Pendientes WHERE idJuego = @idJuego AND idJugador = @idJugador;
			COMMIT TRANSACTION
			SET @estado = 200;
			SET @mensaje = 'Se ha registrado la reseña de manera correcta.';
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'Ya ha realizado una reseña para el juego seleccionado.';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+ERROR_MESSAGE();
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spi_Seguidor]    Script Date: 14/05/2025 06:12:20 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spi_Seguidor]
	@idJugadorSeguido INT,
	@idJugadorSeguidor INT,
	@estado INT OUTPUT,
	@mensaje VARCHAR(MAX) OUTPUT
AS
BEGIN
	BEGIN TRY
		IF NOT EXISTS (SELECT * FROM Seguidor WHERE idJugadorSeguido = @idJugadorSeguido AND idJugadorSeguidor = @idJugadorSeguidor)
		BEGIN
			BEGIN TRANSACTION
				INSERT INTO Seguidor (idJugadorSeguidor,idJugadorSeguido) VALUES (@idJugadorSeguidor,@idJugadorSeguido);
				DECLARE @nombreDeUsuario VARCHAR(20);
				DECLARE @mensajeNotificacion VARCHAR(255);
				SET @nombreDeUsuario = (SELECT TOP 1 nombreDeUsuario FROM Jugadores WHERE idJugador = @idJugadorSeguidor);
				SET @mensajeNotificacion = CONCAT(@nombreDeUsuario,' ha comenzado a seguirte.');
				INSERT INTO Notificaciones (idJugadorNotificado,idJugadorNotificante,fechaNotificacion,mensajeNotificacion) VALUES (@idJugadorSeguido,@idJugadorSeguidor,CAST(GETDATE() AS DATE),@mensajeNotificacion);
			COMMIT TRANSACTION
			SET @estado = 200;
			SET @mensaje = 'Se ha comenzado a seguir al jugador seleccionado.';
		END
		ELSE
		BEGIN
			SET @estado = 400;
			SET @mensaje = 'El usuario que desea seguir ya lo está siguiendo.';
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @estado = 500;
		SET @mensaje = 'Error: '+Error_message();
	END CATCH
END
GO


INSERT INTO TiposDeAccesos (tipoDeAcceso) VALUES ('Administrador'),('Jugador');
GO

ALTER LOGIN adminGameLog WITH PASSWORD = 'G4m3LoG4dM1n.';
GO 

ALTER LOGIN jugadorGameLog WITH PASSWORD = 'G4m3LoGUs3R.';
GO

GRANT EXECUTE ON OBJECT::dbo.spi_Acceso TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spi_Favoritos TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spi_MeGusta TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spi_Reseña TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spi_Seguidor TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spb_JuegosRevivalRetro TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spb_JuegosEnTendencia TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spi_Pendientes TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spd_Pendientes TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spa_Acceso TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spa_Jugadores TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spd_MeGusta TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spi_Juegos TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spd_Seguidor TO jugadorGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spd_Favorito TO jugadorGameLog;
GO

GRANT DELETE ON dbo.MeGusta TO jugadorGameLog;
GO

GRANT DELETE ON dbo.Pendientes TO jugadorGameLog;
GO

GRANT DELETE ON dbo.Favoritos TO jugadorGameLog;
GO

GRANT DELETE ON dbo.Seguidor TO jugadorGameLog;
GO

GRANT EXECUTE ON dbo.spb_BuscarJuegoPorId TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_BuscarJuegoPorNombre TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_BuscarJugador TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_BuscarLogin TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_ConsultarJugadoresSeguidores TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_ConsultarJugadoresSeguidos TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerIdDeAccesoPorCorreo TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerJuegosFavoritos TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerJuegosPendientes TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerReseñasDeJugador TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerReseñasDeUnJuego TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerReseñasDeUnJuegoReseñadoPorJugadoresSeguidos TO jugadorGameLog;
GO
GRANT SELECT ON dbo.fn_ObtenerMeGustaDeReseña TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerNotificaciones TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerNotificaciones TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spd_Notificaciones TO jugadorGameLog;
GO
GRANT EXECUTE ON dbo.spd_Notificaciones TO adminGameLog;
GO
GRANT EXECUTE ON OBJECT::dbo.spi_Acceso TO adminGameLog
GO

GRANT EXECUTE ON OBJECT::dbo.spi_Favoritos TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spi_MeGusta TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spi_Reseña TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spi_Seguidor TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spb_JuegosRevivalRetro TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spb_JuegosEnTendencia TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spi_Pendientes TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spd_Pendientes TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spa_Acceso TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spa_Jugadores TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spd_MeGusta TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spi_Juegos TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spd_Seguidor TO adminGameLog;
GO

GRANT EXECUTE ON OBJECT::dbo.spd_Favorito TO adminGameLog;
GO

GRANT DELETE ON dbo.MeGusta TO adminGameLog;
GO

GRANT DELETE ON dbo.Pendientes TO adminGameLog;
GO

GRANT DELETE ON dbo.Favoritos TO adminGameLog;
GO

GRANT DELETE ON dbo.Seguidor TO adminGameLog;
GO

GRANT DELETE ON dbo.Reseñas TO adminGameLog;
GO

GRANT EXECUTE ON dbo.spb_BuscarJuegoPorId TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spb_BuscarJuegoPorNombre TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spb_BuscarJugador TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spb_BuscarLogin TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spb_ConsultarJugadoresSeguidores TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spb_ConsultarJugadoresSeguidos TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerIdDeAccesoPorCorreo TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerJuegosFavoritos TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerJuegosPendientes TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerReseñasDeJugador TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerReseñasDeUnJuego TO adminGameLog;
GO
GRANT EXECUTE ON dbo.spb_ObtenerReseñasDeUnJuegoReseñadoPorJugadoresSeguidos TO adminGameLog;
GO
GRANT SELECT ON dbo.fn_ObtenerMeGustaDeReseña TO adminGameLog;
GO

DECLARE	@resultadoTercerInsercion int,
		@mensajeTecerInsercion nvarchar(max);

EXEC	[dbo].[spi_Acceso]
		@correo = N'chrisvasquez985@gmail.com',
		@contrasenia = N'acd40c4aaf7edaae796f90aed30b55ec2cf7cc224a71a862774998d22fdd07f4',
		@estado = N'Desbaneado',
		@nombre = N'Christopher',
		@primerApellido = N'Vasquez',
		@segundoApellido = N'Zapata',
		@nombreDeUsuario = N'christolin',
		@descripcion = N'Primer usuario',
		@foto = N'/home/app/fotos/imagendeperfildefaultgamelog.png',
		@tipoDeAcceso = N'Jugador',
		@resultado = @resultadoTercerInsercion OUTPUT,
		@mensaje = @mensajeTecerInsercion OUTPUT
GO

DECLARE	@resultadoSegundaInsercion int,
		@mensajeSegundaInsercion nvarchar(max);

EXEC	[dbo].[spi_Acceso]
		@correo = N'mario@gmail.com',
		@contrasenia = N'acd40c4aaf7edaae796f90aed30b55ec2cf7cc224a71a862774998d22fdd07f4',
		@estado = N'Desbaneado',
		@nombre = N'Mario',
		@primerApellido = N'Limon',
		@segundoApellido = N'Cabrera',
		@nombreDeUsuario = N'mariofei',
		@descripcion = N'Segundo usuario gamelog',
		@foto = N'/home/app/fotos/imagendeperfildefaultgamelog.png',
		@tipoDeAcceso = N'Administrador',
		@resultado = @resultadoSegundaInsercion OUTPUT,
		@mensaje = @mensajeSegundaInsercion OUTPUT
GO

DECLARE	@resultadoPrimerInserscion int,
		@mensajePrimerInsercion nvarchar(max);

EXEC	[dbo].[spi_Acceso]
		@correo = N'oscar@gmail.com',
		@contrasenia = N'acd40c4aaf7edaae796f90aed30b55ec2cf7cc224a71a862774998d22fdd07f4',
		@estado = N'Desbaneado',
		@nombre = N'Oscar Hizay',
		@primerApellido = N'Apodaca',
		@segundoApellido = N'Garcia',
		@nombreDeUsuario = N'oscarin',
		@descripcion = N'Tercer usuario gamelog',
		@foto = N'/home/app/fotos/imagendeperfildefaultgamelog.png',
		@tipoDeAcceso = N'Jugador',
		@resultado = @resultadoPrimerInserscion OUTPUT,
		@mensaje = @mensajePrimerInsercion OUTPUT
GO

