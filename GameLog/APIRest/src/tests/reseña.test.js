import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/sql/AccesoModelo.js";
import { ModeloLogin } from "../api_rest/model/sql/LoginModelo.js";
import {ModeloSeguidor} from "../api_rest/model/sql/SeguidorModelo.js";
import {ModeloJuego} from "../api_rest/model/sql/JuegoModelo.js";
import {ModeloReseña} from "../api_rest/model/sql/ReseñaModelo.js"

let servidor;
let token;
let idPrimerJugador;
let idSegundoJugador;
let idTercerJugador;
let idPrimerReseña;
let idSegundaReseña;
let idTercerReseña;

jest.setTimeout(15000);

beforeAll( async() =>
{
    const {server: servidorCreado} = CrearServidorTest({ModeloAcceso:ModeloAcceso,ModeloLogin:ModeloLogin,ModeloSeguidor:ModeloSeguidor,ModeloJuego:ModeloJuego,ModeloReseña:ModeloReseña});
    servidor = servidorCreado;
    const datosPrimerJugador =
    {
        correo: "chrisresena@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        estado: "Desbaneado",
        nombre: "chris",
        primerApellido: "vasquez",
        segundoApellido: "zapata",
        nombreDeUsuario: "christolin",
        descripcion: "soy el primer jugador :D",
        foto: "login.jpg",
        tipoDeUsuario: "Administrador"
    };
    const datosSegundoJugador =
    {
        correo: "oscarresena@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        estado: "Desbaneado",
        nombre: "oscar",
        primerApellido: "hizay",
        segundoApellido: "apodaca",
        nombreDeUsuario: "oscarin",
        descripcion: "soy el segundo jugador :D",
        foto: "login.jpg",
        tipoDeUsuario: "Administrador"
    };
    const datosTercerJugador =
    {
        correo: "marioresena@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        estado: "Desbaneado",
        nombre: "Mario Miguel",
        primerApellido: "Limon",
        segundoApellido: "Cabrera",
        nombreDeUsuario: "MarioFEI",
        descripcion: "soy el tercer jugador :D",
        foto: "login.jpg",
        tipoDeUsuario: "Administrador"
    };
    const resInsercion = await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datosPrimerJugador);
    await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datosSegundoJugador);
    await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datosTercerJugador);
    console.log(resInsercion.body)
    const datosPrimerJugadorLogin =
    {
        correo: "chrisresena@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        tipoDeUsuario: "Administrador"
    };
    const datosSegundoJugadorLogin =
    {
        correo: "oscarresena@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        tipoDeUsuario: "Administrador"
    };
    const datosTercerJugadorLogin =
    {
        correo: "marioresena@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        tipoDeUsuario: "Administrador"
    };
    const resLoginPrimerJugador = await request(servidor).post('/gamelog/login').set("Content-Type","application/json").send(datosPrimerJugadorLogin);
    idPrimerJugador = resLoginPrimerJugador.body.cuenta[0].idJugador;
    token = resLoginPrimerJugador.headers['access_token'];
    const resLoginSegundoJugador = await request(servidor).post('/gamelog/login').set("Content-Type","application/json").send(datosSegundoJugadorLogin);
    idSegundoJugador = resLoginSegundoJugador.body.cuenta[0].idJugador;
    const resLoginTercerJugador = await request(servidor).post('/gamelog/login').set("Content-Type","application/json").send(datosTercerJugadorLogin);
    idTercerJugador = resLoginTercerJugador.body.cuenta[0].idJugador;
    const DatosPrimerSeguido = {idJugadorSeguidor: idPrimerJugador, idJugadorSeguido: idSegundoJugador};
    const DatosSegundoSeguido = {idJugadorSeguidor: idPrimerJugador, idJugadorSeguido: idTercerJugador};
    await request(servidor).post('/gamelog/seguidor')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosPrimerSeguido);
    await request(servidor).post('/gamelog/seguidor')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosSegundoSeguido);
    const Datos = {idJuego: 41437, nombre: "Fortnite battle royale",fechaDeLanzamiento: "2025-05-09"};
    await request(servidor).post('/gamelog/juego')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(Datos);
})

afterAll( async() =>
{
    const datosEliminacionPrimerJugador = {
        tipoDeUsuario: "Administrador",
        correo: "chrisresena@gmail.com"
    }
    const datosEliminacionSegundoJugador = {
        tipoDeUsuario: "Administrador",
        correo: "oscarresena@gmail.com"
    }
    const datosEliminacionTercerJugador = {
        tipoDeUsuario: "Administrador",
        correo: "marioresena@gmail.com"
    }
    await request(servidor).delete(`/gamelog/acceso/${idPrimerJugador}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEliminacionPrimerJugador);
    await request(servidor).delete(`/gamelog/acceso/${idSegundoJugador}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEliminacionSegundoJugador);
    await request(servidor).delete(`/gamelog/acceso/${idTercerJugador}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEliminacionTercerJugador); 
    await request(servidor).delete(`/gamelog/seguidor/${idPrimerJugador}/${idSegundoJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
    await request(servidor).delete(`/gamelog/seguidor/${idPrimerJugador}/${idTercerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
    await request(servidor).delete(`/gamelog/juego/${41437}`)
            .set({"access_token": `Bearer ${token}`}); 
    servidor.close();
})

describe('TEST para el servicio de reseñas donde se encuentran los métodos de busca, inserción y eliminación', ()=>
{
    test('POST /reseña - Ingresa una nueva reseña dentro del sistema', async() => 
    {
        const DatosReseñaPrimerJugador = {
            idJugador: idPrimerJugador,
            idJuego: 41437,
            opinion: "Me parece un juego bastante entretenido",
            calificacion: 3.5
        };
        const DatosReseñaSegundoJugador = {
            idJugador: idSegundoJugador,
            idJuego: 41437,
            opinion: "De mis juegos favoritos",
            calificacion: 4.5
        };
        const DatosReseñaTercerJugador = {
            idJugador: idTercerJugador,
            idJuego: 41437,
            opinion: "De mis juegos favoritos",
            calificacion: 4.5
        };
        const resPrimerInsercion = await request(servidor).post('/gamelog/resena')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosReseñaPrimerJugador); 
        const resSegundaInsercion = await request(servidor).post('/gamelog/resena')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosReseñaSegundoJugador); 
        const resTerceraInsercion = await request(servidor).post('/gamelog/resena')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosReseñaTercerJugador); 
        expect(resPrimerInsercion.statusCode).toBe(200);
        expect(resSegundaInsercion.statusCode).toBe(200);
        expect(resTerceraInsercion.statusCode).toBe(200);
    })
    
    test('POST /reseña - Ingresa una nueva reseña repetida', async() => 
    {
        const DatosReseñaPrimerJugador = {
            idJugador: idPrimerJugador,
            idJuego: 41437,
            opinion: "Me parece un juego bastante entretenido",
            calificacion: 3.5
        };
        const resPrimerInsercion = await request(servidor).post('/gamelog/resena')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosReseñaPrimerJugador); 
        expect(resPrimerInsercion.statusCode).toBe(400);
    })

    test('POST /reseña - Ingresa una nueva reseña con datos inválidos', async() => 
    {
        const DatosReseñaPrimerJugador = {
            idJugador: "kmnjhasd",
            idJuego: "41437",
            opinion: "´2+p3o01'¿32131¿+",
            calificacion: 3.5
        };
        const resPrimerInsercion = await request(servidor).post('/gamelog/resena')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosReseñaPrimerJugador); 
        expect(resPrimerInsercion.statusCode).toBe(400);
    })

    test('POST /reseña - Ingresar una reseña sin pasar datos como parámetros', async() =>
    {
        const resInsercion = await request(servidor).post('/gamelog/resena')
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resInsercion.statusCode).toBe(400);
    })

    test('GET /jugador/:idJugador?idJugadorBuscador - Obtener las reseñas realizadas por un jugador', async() =>
    {
        const resConsulta = await request(servidor).get(`/gamelog/resena/jugador/${idPrimerJugador}?idJugadorBuscador=${idPrimerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resConsulta.statusCode).toBe(200);
        expect(resConsulta.body).toHaveProperty("reseñas");
    })

    test('GET /jugador/:idJugado?idJugadorBuscador- Obtener reseñas inexistentes de un jugador', async() =>
    {
        const resConsulta = await request(servidor).get(`/gamelog/resena/jugador/${100}?idJugadorBuscador=${100}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resConsulta.statusCode).toBe(404);
        expect(resConsulta.body).toHaveProperty("mensaje");
    })

    test('GET /jugador/:idJugador?idJugadorBuscador - Obtener reseñas con parámetros inválidos', async() =>
    {
        const IdJugador = "AJIUI"
        const resConsulta = await request(servidor).get(`/gamelog/resena/jugador/${IdJugador}?idJugadorBuscador=${idPrimerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resConsulta.statusCode).toBe(400);
    })

    test('GET /Juego/:idJuego?idJugadorBuscador - Obtener reseñas generales de un juego en especifico por ID', async() =>
    {
        console.log("Buscar reseñas de un juego")
        const resConsulta = await request(servidor).get(`/gamelog/resena/juego/${41437}?idJugadorBuscador=${idTercerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(200);
        expect(resConsulta.body).toHaveProperty("reseñas");
        idPrimerReseña = resConsulta.body.reseñas[0].idResenia;
        idSegundaReseña = resConsulta.body.reseñas[1].idResenia;
        idTercerReseña = resConsulta.body.reseñas[2].idResenia;

    })

    test('GET /Juego/:idJuego?idJugadorBuscador - Obtener reseñas generales inexistentes de un juego en especifico por ID', async() =>
    {
        const resConsulta = await request(servidor).get(`/gamelog/resena/juego/${90909}?idJugadorBuscador=${idPrimerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resConsulta.statusCode).toBe(404);
        expect(resConsulta.body).toHaveProperty("mensaje");
    })

    test('GET /Juego/:idJuego?idJugadorBuscador - Obtener reseñas generales por parámetros inválidos', async() =>
    {
        const idJuego = "pkmsndauis"
        const resConsulta = await request(servidor).get(`/gamelog/resena/juego/${idJuego}?idJugadorBuscador=${idPrimerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resConsulta.statusCode).toBe(400);
    })

    test('GET /Juego/:idJuego/seguidos - Obtener reseñas creadas por usuarios seguidos', async() =>
    {
        const resConsulta = await request(servidor).get(`/gamelog/resena/juego/${41437}/seguidos?idJugador=${idPrimerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(200);
        expect(resConsulta.body).toHaveProperty("reseñas");
    })

    test('GET /Juego/:idJuego/seguidos - Obtener reseñas inexistentes creadas por usuarios seguidos', async() =>
    {
        const resConsulta = await request(servidor).get(`/gamelog/resena/juego/${41437}/seguidos?idJugador=${idSegundoJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resConsulta.statusCode).toBe(404);
        expect(resConsulta.body).toHaveProperty("mensaje");
    })

    test('GET /Juego/:idJuego/seguidos - Obtener reseñas mediante parámetros inválidos', async() =>
    {
        const IdJugador = "AMKDOISA"
        const resConsulta = await request(servidor).get(`/gamelog/resena/juego/${IdJugador}/seguidos?idJugador=${idSegundoJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resConsulta.statusCode).toBe(400);
    })

    test('DELETE /reseña/:idJuego/:idResena - Eliminar una reseña a través de su ID', async() =>
    {
        const resPrimerEliminacion = await request(servidor).delete(`/gamelog/resena/${41437}/${idPrimerReseña}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        const resSegundaEliminacion = await request(servidor).delete(`/gamelog/resena/${41437}/${idSegundaReseña}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        const resTercerEliminacion = await request(servidor).delete(`/gamelog/resena/${41437}/${idTercerReseña}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resPrimerEliminacion.statusCode).toBe(200);
        expect(resSegundaEliminacion.statusCode).toBe(200);
        expect(resTercerEliminacion.statusCode).toBe(200);
    })

    test('DELETE /reseña/:idJuego/:idResena  - Eliminar una reseña inexistente a través de su ID', async() =>
    {
        const resPrimerEliminacion = await request(servidor).delete(`/gamelog/resena/${41437}/${789}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resPrimerEliminacion.statusCode).toBe(400);
    })

    test('DELETE /reseña/:idJuego/:idResena  - Tratar de eliminar una reseña a través de datos inválidos', async() =>
    {
        const IdReseña = "AMDOM"
        const resPrimerEliminacion = await request(servidor).delete(`/gamelog/resena/${12902}/${IdReseña}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resPrimerEliminacion.statusCode).toBe(400);
    })
})