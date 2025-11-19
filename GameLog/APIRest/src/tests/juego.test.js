import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/sql/AccesoModelo.js";
import { ModeloLogin } from "../api_rest/model/sql/LoginModelo.js";
import {ModeloJuego} from "../api_rest/model/sql/JuegoModelo.js";

let servidor;
let tokenAdmin;
let tokenJugador;
let idAdminCreado;
let idJugadorCreado;

jest.setTimeout(15000);

beforeAll(async () =>
{
    const {server: servidorCreado} = CrearServidorTest({ModeloAcceso:ModeloAcceso,ModeloLogin:ModeloLogin,ModeloJuego:ModeloJuego});
    servidor = servidorCreado;
    const datosAdmin = 
        {
            correo: "usuariopruebajuego@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "pruebaJuego",
            primerApellido: "prueba",
            segundoApellido: "prueba",
            nombreDeUsuario: "pruebaJuego",
            descripcion: "login",
            foto: "login.jpg",
            tipoDeUsuario: "Administrador"
        };
    await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datosAdmin);
    const DatosAdmin = 
        {
            correo: "usuariopruebajuego@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
    const resLoginAdmin = await request(servidor).post('/gamelog/login').set("Content-Type","application/json").send(DatosAdmin);
    tokenAdmin = resLoginAdmin.headers['access_token'];
    idAdminCreado = resLoginAdmin.body.cuenta[0].idJugador;
    const datosJugador = 
        {
            correo: "usuariopruebajugadorjuego@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "pruebaJuegador",
            primerApellido: "prueba",
            segundoApellido: "prueba",
            nombreDeUsuario: "pruebaJuegador",
            descripcion: "login",
            foto: "login.jpg",
            tipoDeUsuario: "Jugador"
        };
    await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datosJugador);
    const DatosJugador = 
        {
            correo: "usuariopruebajugadorjuego@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Jugador"
        }
    const resLoginJugador = await request(servidor).post('/gamelog/login').set("Content-Type","application/json").send(DatosJugador);
    tokenJugador = resLoginJugador.headers['access_token'];
    idJugadorCreado = resLoginJugador.body.cuenta[0].idJugador;
})

afterAll(async() => 
{
    const datosEliminacionAdmin = {
            tipoDeUsuario: "Administrador",
            correo: "usuariopruebajuego@gmail.com",
        }
    await request(servidor).delete(`/gamelog/acceso/${idAdminCreado}`)
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${tokenAdmin}`
        })
        .send(datosEliminacionAdmin);
    const datosEliminacionJugador = {
        tipoDeUsuario: "Jugador",
        correo: "usuariopruebajugadorjuego@gmail.com"
    }
    await request(servidor).delete(`/gamelog/acceso/${idJugadorCreado}`)
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${tokenAdmin}`
        })
        .send(datosEliminacionJugador);
    servidor.close();
})

describe('Test para el servicio de Juegos donde se encuentran los métodos de Registro, Búsqueda y Eliminación',() =>
{
    test('POST /juego - Ingresa un nuevo juego dentro del sistema', async() => 
    {
        const DatosPrimerJuego = {idJuego: 41437, nombre: "Fortnite battle royale",fechaDeLanzamiento: "2025-05-09"};
        const DatosSegundoJuego = {idJuego: 12567, nombre: "Halo infinite",fechaDeLanzamiento: "2025-05-09"};
        const resInsercion = await request(servidor).post('/gamelog/juego')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(DatosPrimerJuego);
        const resSegundaInsercion = await request(servidor).post('/gamelog/juego')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(DatosSegundoJuego);
        expect(resInsercion.statusCode).toBe(200);
        expect(resSegundaInsercion.statusCode).toBe(200);
        console.log('Juego insertado')
        console.log(resInsercion.body);
    })

    test('POST /juego - Ingresa un juego repetido dentro del sistema', async() => 
    {
        const Datos = {idJuego: 41437, nombre: "Fortnite battle royale",fechaDeLanzamiento: "2025-05-09"};
        const resInsercion = await request(servidor).post('/gamelog/juego')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(Datos);
        expect(resInsercion.statusCode).toBe(400);
    })

    test('POST /juego - Tratar de ingresar un juego con datos inválidos',async() => 
    {
        const Datos = {idJuego: "ojinjqjieq", nombre: "Fortnite battle royale",fechaDeLanzamiento: "asdawkpowe"};
        const resInsercion = await request(servidor).post('/gamelog/juego')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(Datos);
        expect(resInsercion.statusCode).toBe(400);
    })

    test('POST /juego - Ingresa un juego sin pasar parámetros', async() => 
        {
            const resInsercion = await request(servidor).post('/gamelog/juego')
                .set({
                    "access_token": `Bearer ${tokenAdmin}`
                })
            expect(resInsercion.statusCode).toBe(400);
        })
    
    test('POST /juego/favorito - Ingresa un juego como favorito dentro del sistema', async() => 
    {
        const DatosJuegoFavorito = {idJuego: 41437, idJugador: idJugadorCreado};
        const DatosJuego = {idJuego: 12567, nombre: "Halo infinite"};
        await request(servidor).post('/gamelog/juego')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(DatosJuego);
        const resInsercion = await request(servidor).post('/gamelog/juego/favorito')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(DatosJuegoFavorito);
        expect(resInsercion.statusCode).toBe(200);
    })

    test('POST /juego/favorito - Ingresa un juego como favorito repetido dentro del sistema', async() => 
    {
        const DatosJuegoFavorito = {idJuego: 41437, idJugador: idJugadorCreado};
        const resInsercion = await request(servidor).post('/gamelog/juego/favorito')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(DatosJuegoFavorito);
        expect(resInsercion.statusCode).toBe(400);
    })

    test('POST /juego/favorito - Ingresa un juego como favorito sin pasar parámetros', async() => 
    {
        const resInsercion = await request(servidor).post('/gamelog/juego/favorito')
            .set({
                "access_token": `Bearer ${tokenAdmin}`
            });
        expect(resInsercion.statusCode).toBe(400);
    })

    test('POST /juego/pendiente - Ingresar un juego a la lista de pendientes', async() =>
    {
        const DatosJuegoPendiente = {idJuego: 12567, idJugador: idJugadorCreado};
        const DatosJuegoPendienteDos = {idJuego: 41437, idJugador: idJugadorCreado};
        const resInsercionPrimerInsercion = await request(servidor).post('/gamelog/juego/pendiente')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(DatosJuegoPendiente);
        const resInsercionSegundaInsercion = await request(servidor).post('/gamelog/juego/pendiente')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(DatosJuegoPendienteDos);
        expect(resInsercionPrimerInsercion.statusCode).toBe(200);
        expect(resInsercionSegundaInsercion.statusCode).toBe(200);
    })

    test('POST /juego/pendiente - Ingresar un juego repetido a la lista de pendientes', async() =>
    {
        const DatosJuegoPendiente = {idJuego: 12567, idJugador: idJugadorCreado};
        const resInsercionPrimerInsercion = await request(servidor).post('/gamelog/juego/pendiente')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${tokenAdmin}`
            })
            .send(DatosJuegoPendiente);
        expect(resInsercionPrimerInsercion.statusCode).toBe(400);
    })

    test('POST /juego/pendiente - Ingresar un juego repetido a la lista de pendientes sin parámetros ingresados', async() =>
        {
            const resInsercionPrimerInsercion = await request(servidor).post('/gamelog/juego/pendiente')
                .set({
                    "access_token": `Bearer ${tokenAdmin}`
                });
            expect(resInsercionPrimerInsercion.statusCode).toBe(400);
        })

    test('GET /juego/:idJuego - Buscar un juego por su ID', async() => 
    {
        const resBusqueda = await request(servidor).get(`/gamelog/juego/${41437}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(200);
        expect(resBusqueda.body).toHaveProperty("juego");
    })

    test('GET /juego/:idJuego - Buscar un juego inexistente por su ID', async() => 
    {
        const resBusqueda = await request(servidor).get(`/gamelog/juego/${99999}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(404);
    })

    test('GET /juego/:idJuego - Buscar un juego por su ID sin pasar parámetros', async() => 
        {
            const resBusqueda = await request(servidor).get(`/gamelog/juego/${null}`)
                .set({"access_token": `Bearer ${tokenJugador}`});
            expect(resBusqueda.statusCode).toBe(400);
        })

    test('GET /juego/ - Buscar un juego a través de su nombre', async() => 
    {
        const NombreJuego = "Fortnite battle royale";
        const resBusqueda = await request(servidor).get(`/gamelog/juego/?nombre=${NombreJuego}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(200);
        expect(resBusqueda.body).toHaveProperty("juego");
    })

    test('GET /juego/ - Buscar un juego inexistente en la base de datos a través de su nombre', async() => 
    {
        const NombreJuego = "Repo";
        const resBusqueda = await request(servidor).get(`/gamelog/juego/?nombre=${NombreJuego}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(404);
    })

    test('GET /juego/ - Buscar un juego por su nombre con datos inválidos', async() => 
        {
            const NombreJuego = "'o04p23k4i9201pol2,3{121}{}?¡¿*]";
            const resBusqueda = await request(servidor).get(`/gamelog/juego/?nombre=${NombreJuego}`)
                .set({"access_token": `Bearer ${tokenJugador}`});
            expect(resBusqueda.statusCode).toBe(400);
        })

    test('GET /juego/favorito/:idJugador - Obtener los juegos favoritos de un jugador', async() => 
    {
        const resBusqueda = await request(servidor).get(`/gamelog/juego/favorito/${idJugadorCreado}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        console.log(resBusqueda.body);
        expect(resBusqueda.statusCode).toBe(200);
        expect(resBusqueda.body).toHaveProperty("juegos");
    })

    test('GET /juego/favorito/:idJugador - Obtener resultados sin juegos como favoritos de un jugador', async() => 
    {
        const resBusqueda = await request(servidor).get(`/gamelog/juego/favorito/${202}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(404);
        expect(resBusqueda.body).toHaveProperty("mensaje");
    })

    test('GET /juego/favorito/:idJugador - Intentar obtener los juegos favoritos de un jugador con parámetros inválidos', async() =>
    {
        const idJugador = "'o04p23k4i9201pol2,3{121}{}?¡¿*]";
        const resBusqueda = await request(servidor).get(`/gamelog/juego/favorito/${idJugador}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(400);
    })

    test('GET /juego/pendiente/:idJugador - Obtener los juegos pendientes de un jugador', async() => 
    {
        const resBusqueda = await request(servidor).get(`/gamelog/juego/pendiente/${idJugadorCreado}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        console.log(resBusqueda.body);
        expect(resBusqueda.statusCode).toBe(200);
        expect(resBusqueda.body).toHaveProperty("juegos");
    })
    
    test('GET /juego/pendiente/:idJugador - Obtener resultados sin juegos como pendientes de un jugador', async() => 
    {
        const resBusqueda = await request(servidor).get(`/gamelog/juego/pendiente/${202}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(404);
        expect(resBusqueda.body).toHaveProperty("mensaje");
    })

    test('GET /juego/pendiente/:idJugador - Intentar obtener los juegos pendientes de un jugador con parámetros inválidos', async() =>
    {
        const idJugador = "'o04p23k4i9201pol2,3{121}{}?¡¿*]";
        const resBusqueda = await request(servidor).get(`/gamelog/juego/pendiente/${idJugador}`)
            .set({"access_token": `Bearer ${tokenJugador}`});
        expect(resBusqueda.statusCode).toBe(400);
    })
    
    test('DELETE /juego/pendiente/:idJuego/:idJugador - Eliminar juego de la lista de pendientes', async() =>
    {
        const resEliminacionPrimerJuego = await request(servidor).delete(`/gamelog/juego/pendiente/${41437}/${idJugadorCreado}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        const resEliminacionSegundoJuego = await request(servidor).delete(`/gamelog/juego/pendiente/${12567}/${idJugadorCreado}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacionPrimerJuego.statusCode).toBe(200);
        expect(resEliminacionSegundoJuego.statusCode).toBe(200);
    })

    test('DELETE /juego/pendiente/:idJuego/:idJugador - Eliminar juego no registrado en la lista de pendientes', async() =>
    {
        const resEliminacion = await request(servidor).delete(`/gamelog/juego/pendiente/${209811}/${idJugadorCreado}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacion.statusCode).toBe(400);
    })

    test('DELETE /juego/pendiente/:idJuego/:idJugador - Intentar eliminar juego con datos inválidos ', async() =>
    {
        const IdJuego = "ABCDEFG" 
        const resEliminacion = await request(servidor).delete(`/gamelog/juego/pendiente/${IdJuego}/${idJugadorCreado}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacion.statusCode).toBe(400);
    })

    test('DELETE /juego/pendiente/:idJuego/:idJugador - Intentar eliminar juego con parámetros nulos', async() =>
    {
        const resEliminacion = await request(servidor).delete(`/gamelog/juego/pendiente/${null}/${null}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacion.statusCode).toBe(400);
    })

    test('DELETE /juego/favorito/:idJuego/:idJugador - Eliminar juego de la lista de favoritos', async() =>
    {
        const resEliminacion = await request(servidor).delete(`/gamelog/juego/favorito/${41437}/${idJugadorCreado}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacion.statusCode).toBe(200);
    })

    test('DELETE /juego/favorito/:idJuego/:idJugador - Eliminar juego de la lista de favoritos no registrado', async() =>
    {
        const resEliminacion = await request(servidor).delete(`/gamelog/juego/favorito/${127940}/${idJugadorCreado}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacion.statusCode).toBe(400);
    })

    test('DELETE /juego/favorito/:idJuego/:idJugador - Eliminar juego de la lista de favoritos con datos inválidos', async() =>
    {
        const IdJuego = "ABCDEFG";
        const resEliminacion = await request(servidor).delete(`/gamelog/juego/favorito/${IdJuego}/${idJugadorCreado}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacion.statusCode).toBe(400);
    })

    test('DELETE /juego/favorito/:idJuego/:idJugador - Eliminar juego de la lista de favoritos con parámetros nulos', async() =>
    {
        const resEliminacion = await request(servidor).delete(`/gamelog/juego/favorito/${null}/${null}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacion.statusCode).toBe(400);
    })

    test('DELETE /juego/:idJuego - Eliminar juego existente en la base de datos a través de su ID',async() => 
    {
        const resEliminacion = await request(servidor).delete(`/gamelog/juego/${41437}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        await request(servidor).delete(`/gamelog/juego/${12567}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacion.statusCode).toBe(200);
    })

    test('DELETE /juego/:idJuego - Eliminar juego inexistente en la base de datos a través de su ID',async() => 
    {
        const resEliminacion = await request(servidor).delete(`/gamelog/juego/${20000}`)
            .set({"access_token": `Bearer ${tokenAdmin}`});
        expect(resEliminacion.statusCode).toBe(400);
    })

    test('DELETE /juego/:idJuego - Eliminar juego con datos inválidos',async() => 
        {
            const IdJuego = "ABCDEFG" 
            const resEliminacion = await request(servidor).delete(`/gamelog/juego/${IdJuego}`)
                .set({"access_token": `Bearer ${tokenAdmin}`});
            expect(resEliminacion.statusCode).toBe(400);
        })

    test('DELETE /juego/:idJuego - Eliminar juego sin pasarle parámetros',async() => 
        {
            const resEliminacion = await request(servidor).delete(`/gamelog/juego/${null}`)
                .set({"access_token": `Bearer ${tokenAdmin}`});
            expect(resEliminacion.statusCode).toBe(400);
        })
    
})