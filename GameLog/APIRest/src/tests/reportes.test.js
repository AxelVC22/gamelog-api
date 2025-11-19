import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/sql/AccesoModelo.js";
import { ModeloLogin } from "../api_rest/model/sql/LoginModelo.js";
import {ModeloSeguidor} from "../api_rest/model/sql/SeguidorModelo.js";
import {ModeloJuego} from "../api_rest/model/sql/JuegoModelo.js";
import {ModeloReseña} from "../api_rest/model/sql/ReseñaModelo.js"
import { ModeloReportesEstadisticos } from "../api_rest/model/sql/ReportesModelo.js";

let servidor;
let token;
let idPrimerJugador;
let idSegundoJugador;
let idTercerJugador;

jest.setTimeout(15000);

beforeAll( async() =>
{
    const {server: servidorCreado} = CrearServidorTest({ModeloAcceso:ModeloAcceso,
        ModeloLogin:ModeloLogin,
        ModeloSeguidor:ModeloSeguidor,
        ModeloJuego:ModeloJuego,
        ModeloReseña:ModeloReseña,
        ModeloReportesEstadisticos:ModeloReportesEstadisticos});
    servidor = servidorCreado;
    const datosPrimerJugador =
    {
        correo: "chrisreporte@gmail.com",
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
        correo: "oscarreporte@gmail.com",
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
        correo: "marioreporte@gmail.com",
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
    await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datosPrimerJugador);
    await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datosSegundoJugador);
    await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datosTercerJugador);
    const datosPrimerJugadorLogin =
    {
        correo: "chrisreporte@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        tipoDeUsuario: "Administrador"
    };
    const datosSegundoJugadorLogin =
    {
        correo: "oscarreporte@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        tipoDeUsuario: "Administrador"
    };
    const datosTercerJugadorLogin =
    {
        correo: "marioreporte@gmail.com",
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
    const Datos = {idJuego: 41437, nombre: "Fortnite battle royale",fechaDeLanzamiento: "2017-05-09"};
    const DatosSegundoJuego = {idJuego:10101, nombre: "Halo infinite",fechaDeLanzamiento: "2022-01-17"};
    const DatosTercerJuego = {idJuego:20202, nombre: "COD BO6",fechaDeLanzamiento: "2024-10-23"};
    const DatosCuartoJuego = {idJuego:30303, nombre: "Super Mario Bros",fechaDeLanzamiento: "1989-02-23"};
    const DatosQuintoJuego = {idJuego:40404, nombre: "GTA I",fechaDeLanzamiento: "1994-07-16"};
    const DatosSextoJuego = {idJuego:50505, nombre: "DOOM",fechaDeLanzamiento: "1997-09-13"};
    const insercionJuego = await request(servidor).post('/gamelog/juego')
    .set({
        "Content-Type": "application/json",
        "access_token": `Bearer ${token}`
    })
    .send(Datos);
    console.log(insercionJuego.body)
    await request(servidor).post('/gamelog/juego')
    .set({
        "Content-Type": "application/json",
        "access_token": `Bearer ${token}`
    })
    .send(DatosSegundoJuego);
    await request(servidor).post('/gamelog/juego')
    .set({
        "Content-Type": "application/json",
        "access_token": `Bearer ${token}`
    })
    .send(DatosTercerJuego);
    await request(servidor).post('/gamelog/juego')
    .set({
        "Content-Type": "application/json",
        "access_token": `Bearer ${token}`
    })
    .send(DatosCuartoJuego);
    await request(servidor).post('/gamelog/juego')
    .set({
        "Content-Type": "application/json",
        "access_token": `Bearer ${token}`
    })
    .send(DatosQuintoJuego);
    await request(servidor).post('/gamelog/juego')
    .set({
        "Content-Type": "application/json",
        "access_token": `Bearer ${token}`
    })
    .send(DatosSextoJuego);
    const DatosPrimerReseñaPrimerJugador = {
        idJugador: idPrimerJugador,
        idJuego: 41437,
        opinion: "Me parece un juego bastante entretenido",
        calificacion: 3.5
    };
    const DatosPrimerReseñaSegundoJugador = {
        idJugador: idSegundoJugador,
        idJuego: 41437,
        opinion: "De mis juegos favoritos",
        calificacion: 4.5
    };
    const DatosTercerReseñaTercerJugador = {
        idJugador: idTercerJugador,
        idJuego: 41437,
        opinion: "De mis juegos favoritos",
        calificacion: 4.5
    };
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosPrimerReseñaPrimerJugador); 
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosPrimerReseñaSegundoJugador); 
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosTercerReseñaTercerJugador); 
    const DatosSegundaReseñaPrimerJugador = {
        idJugador: idPrimerJugador,
        idJuego: 10101,
        opinion: "Me parece un juego bastante entretenido",
        calificacion: 3.5
    };
    const DatosSegundaReseñaSegundoJugador = {
        idJugador: idSegundoJugador,
        idJuego: 10101,
        opinion: "De mis juegos favoritos",
        calificacion: 4.5
    };
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosSegundaReseñaPrimerJugador); 
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosSegundaReseñaSegundoJugador); 
    const DatosTercerReseñaPrimerJugador = {
        idJugador: idPrimerJugador,
        idJuego: 20202,
        opinion: "Me parece un juego bastante entretenido",
        calificacion: 3.5
    };
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosTercerReseñaPrimerJugador); 
    const DatosCuartaReseñaPrimerJugador = {
        idJugador: idPrimerJugador,
        idJuego: 30303,
        opinion: "Me parece un juego bastante entretenido",
        calificacion: 3.5
    };
    const DatosCuartaReseñaSegundoJugador = {
        idJugador: idSegundoJugador,
        idJuego: 30303,
        opinion: "De mis juegos favoritos",
        calificacion: 4.5
    };
    const DatosCuartaReseñaTercerJugador = {
        idJugador: idTercerJugador,
        idJuego: 30303,
        opinion: "De mis juegos favoritos",
        calificacion: 4.5
    };
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosCuartaReseñaPrimerJugador); 
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosCuartaReseñaSegundoJugador); 
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosCuartaReseñaTercerJugador); 
    const DatosQuintaReseñaPrimerJugador = {
        idJugador: idPrimerJugador,
        idJuego: 40404,
        opinion: "Me parece un juego bastante entretenido",
        calificacion: 3.5
    };
    const DatosQuintaReseñaSegundoJugador = {
        idJugador: idSegundoJugador,
        idJuego: 40404,
        opinion: "De mis juegos favoritos",
        calificacion: 4.5
    };
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosQuintaReseñaPrimerJugador); 
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosQuintaReseñaSegundoJugador);
    const DatosSextaReseñaPrimerJugador = {
        idJugador: idPrimerJugador,
        idJuego: 50505,
        opinion: "Me parece un juego bastante entretenido",
        calificacion: 3.5
    };
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosSextaReseñaPrimerJugador);
})

afterAll( async() => 
{
    let resConsultaPrimerJuego = await request(servidor).get(`/gamelog/resena/juego/${41437}?idJugadorBuscador=${idPrimerJugador}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    let idPrimerJuegoPrimerReseña = resConsultaPrimerJuego.body.reseñas[0].idResenia;
    let idPrimerJuegoSegundaReseña = resConsultaPrimerJuego.body.reseñas[1].idResenia;
    let idPrimerJuegoTercerReseña = resConsultaPrimerJuego.body.reseñas[2].idResenia;
    let resConsultaSegundoJuego = await request(servidor).get(`/gamelog/resena/juego/${10101}?idJugadorBuscador=${idPrimerJugador}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    let idSegundoJuegoPrimerReseña = resConsultaSegundoJuego.body.reseñas[0].idResenia;
    let idSegundoJuegoSegundaReseña = resConsultaSegundoJuego.body.reseñas[1].idResenia;
    let resConsultaTercerJuego =await request(servidor).get(`/gamelog/resena/juego/${20202}?idJugadorBuscador=${idPrimerJugador}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    let idTercerJuegoPrimerReseña = resConsultaTercerJuego.body.reseñas[0].idResenia;
    let resConsultaCuartoJuego = await request(servidor).get(`/gamelog/resena/juego/${30303}?idJugadorBuscador=${idPrimerJugador}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    let idCuartoJuegoPrimerReseña = resConsultaCuartoJuego.body.reseñas[0].idResenia;
    let idCuartoJuegoSegundaReseña = resConsultaCuartoJuego.body.reseñas[1].idResenia;
    let idCuartoJuegoTercerReseña = resConsultaCuartoJuego.body.reseñas[2].idResenia;
    let resConsultaQuintoJuego = await request(servidor).get(`/gamelog/resena/juego/${40404}?idJugadorBuscador=${idPrimerJugador}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    let idQuintoJuegoPrimerReseña = resConsultaQuintoJuego.body.reseñas[0].idResenia;
    let idQuintoJuegoSegundaReseña = resConsultaQuintoJuego.body.reseñas[1].idResenia;
    let resConsultaSextoJuego =await request(servidor).get(`/gamelog/resena/juego/${50505}?idJugadorBuscador=${idPrimerJugador}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    let idSextoJuegoPrimerReseña = resConsultaSextoJuego.body.reseñas[0].idResenia;
    await request(servidor).delete(`/gamelog/resena/${41437}/${idPrimerJuegoPrimerReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${41437}/${idPrimerJuegoSegundaReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${41437}/${idPrimerJuegoTercerReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${10101}/${idSegundoJuegoPrimerReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${10101}/${idSegundoJuegoSegundaReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${20202}/${idTercerJuegoPrimerReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${30303}/${idCuartoJuegoPrimerReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${30303}/${idCuartoJuegoSegundaReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${30303}/${idCuartoJuegoTercerReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${40404}/${idQuintoJuegoPrimerReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${40404}/${idQuintoJuegoSegundaReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${50505}/${idSextoJuegoPrimerReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    const datosEliminacionPrimerJugador = {
        tipoDeUsuario: "Administrador",
        correo: "chrisreporte@gmail.com"
    }
    const datosEliminacionSegundoJugador = {
        tipoDeUsuario: "Administrador",
        correo: "oscarreporte@gmail.com"
    }
    const datosEliminacionTercerJugador = {
        tipoDeUsuario: "Administrador",
        correo: "marioreporte@gmail.com"
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
    await request(servidor).delete(`/gamelog/juego/${41437}`)
        .set({"access_token": `Bearer ${token}`}); 
    await request(servidor).delete(`/gamelog/juego/${10101}`)
        .set({"access_token": `Bearer ${token}`}); 
    await request(servidor).delete(`/gamelog/juego/${20202}`)
        .set({"access_token": `Bearer ${token}`}); 
    await request(servidor).delete(`/gamelog/juego/${30303}`)
        .set({"access_token": `Bearer ${token}`}); 
    await request(servidor).delete(`/gamelog/juego/${40404}`)
        .set({"access_token": `Bearer ${token}`}); 
    await request(servidor).delete(`/gamelog/juego/${50505}`)
        .set({"access_token": `Bearer ${token}`}); 
    servidor.close();
})

describe('TEST para el servicio de obtención de información para la generación de reportes',()=>
{
    test('GET /reporte/tendencias/:fechaInicioBusqueda/:fechaFinBusqueda - Se buscan los juegos más reportados en las fechas seleccionadas',async() =>
    {
        const fechaInicioBusqueda = '2025-05-10';
        const fechaFinBusqueda = '2025-06-20';
        const resConsulta = await request(servidor).get(`/gamelog/reporte/tendencias/${fechaInicioBusqueda}/${fechaFinBusqueda}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(200);
        expect(resConsulta.body).toHaveProperty('juegos');
    })

    test('GET /reporte/tendencias/:fechaInicioBusqueda/:fechaFinBusqueda - No se obtienen resultados para reseñas realizadas en las fechas seleccionadas',async() =>
    {
        const fechaInicioBusqueda = '2025-03-17';
        const fechaFinBusqueda = '2025-04-12';
        const resConsulta = await request(servidor).get(`/gamelog/reporte/tendencias/${fechaInicioBusqueda}/${fechaFinBusqueda}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(404);
        expect(resConsulta.body).toHaveProperty('mensaje');
    })
    
    test('GET /reporte/tendencias/:fechaInicioBusqueda/:fechaFinBusqueda - Se ingresan datos inválidos que no son acorde a un tipo de fecha',async() =>
    {
        const fechaInicioBusqueda = '¿p123123';
        const fechaFinBusqueda = 120904;
        const resConsulta = await request(servidor).get(`/gamelog/reporte/tendencias/${fechaInicioBusqueda}/${fechaFinBusqueda}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(400);
    })

    test('GET /reporte/revivalretro/:fechaInicioBusqueda/:fechaFinBusqueda - Se buscan los juegos retro más reseñados en las fechas seleccionadas',async() =>
    {
        const fechaInicioBusqueda = '2025-05-10';
        const fechaFinBusqueda = '2025-06-20';
        const resConsulta = await request(servidor).get(`/gamelog/reporte/revivalretro/${fechaInicioBusqueda}/${fechaFinBusqueda}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(200);
        expect(resConsulta.body).toHaveProperty('juegos');
    })

    test('GET /reporte/revivalretro/:fechaInicioBusqueda/:fechaFinBusqueda - No se obtienen resultados para reseñas a juegos retro realizadas en las fechas seleccionadas',async() =>
    {
        const fechaInicioBusqueda = '2025-03-17';
        const fechaFinBusqueda = '2025-04-12';
        const resConsulta = await request(servidor).get(`/gamelog/reporte/revivalretro/${fechaInicioBusqueda}/${fechaFinBusqueda}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(404);
        expect(resConsulta.body).toHaveProperty('mensaje');
    })
    
    test('GET /reporte/revivalretro/:fechaInicioBusqueda/:fechaFinBusqueda - Se ingresan datos inválidos que no son acorde a un tipo de fecha',async() =>
    {
        const fechaInicioBusqueda = '¿p123123';
        const fechaFinBusqueda = 120904;
        const resConsulta = await request(servidor).get(`/gamelog/reporte/revivalretro/${fechaInicioBusqueda}/${fechaFinBusqueda}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(400);
    })
})