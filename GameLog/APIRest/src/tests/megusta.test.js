import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/sql/AccesoModelo.js";
import { ModeloLogin } from "../api_rest/model/sql/LoginModelo.js";
import {ModeloSeguidor} from "../api_rest/model/sql/SeguidorModelo.js";
import {ModeloJuego} from "../api_rest/model/sql/JuegoModelo.js";
import {ModeloReseña} from "../api_rest/model/sql/ReseñaModelo.js"
import { ModeloMeGusta } from "../api_rest/model/sql/MeGustaModelo.js";

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
    const {server: servidorCreado} = CrearServidorTest({ModeloAcceso:ModeloAcceso,ModeloLogin:ModeloLogin,ModeloSeguidor:ModeloSeguidor,ModeloJuego:ModeloJuego,ModeloReseña:ModeloReseña,ModeloMeGusta:ModeloMeGusta});
    servidor = servidorCreado;
    const datosPrimerJugador =
    {
        correo: "chrisMeGusta@gmail.com",
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
        correo: "oscarMeGusta@gmail.com",
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
        correo: "marioMeGusta@gmail.com",
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
        correo: "chrisMeGusta@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        tipoDeUsuario: "Administrador"
    };
    const datosSegundoJugadorLogin =
    {
        correo: "oscarMeGusta@gmail.com",
        contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        tipoDeUsuario: "Administrador"
    };
    const datosTercerJugadorLogin =
    {
        correo: "marioMeGusta@gmail.com",
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
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosReseñaPrimerJugador); 
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosReseñaSegundoJugador); 
    await request(servidor).post('/gamelog/resena')
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(DatosReseñaTercerJugador);
    const resConsulta = await request(servidor).get(`/gamelog/resena/juego/${41437}?idJugadorBuscador=${idPrimerJugador}`)
                .set({
                    "access_token": `Bearer ${token}`
                })
    idPrimerReseña = resConsulta.body.reseñas[0].idResenia;
    idSegundaReseña = resConsulta.body.reseñas[1].idResenia;
    idTercerReseña = resConsulta.body.reseñas[2].idResenia;
})

afterAll( async() =>
{
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
    await request(servidor).delete(`/gamelog/resena/${41437}/${idPrimerReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${41437}/${idSegundaReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    await request(servidor).delete(`/gamelog/resena/${41437}/${idTercerReseña}`)
        .set({
            "access_token": `Bearer ${token}`
        }) 
    const datosEliminacionPrimerJugador = {
        tipoDeUsuario: "Administrador",
        correo: "chrisMeGusta@gmail.com"
    }
    const datosEliminacionSegundoJugador = {
        tipoDeUsuario: "Administrador",
        correo: "oscarMeGusta@gmail.com"
    }
    const datosEliminacionTercerJugador = {
        tipoDeUsuario: "Administrador",
        correo: "marioMeGusta@gmail.com"
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
    servidor.close();
})

describe('TEST para el servicio de MeGustas a reseñas, por parte de jugadores',() =>
{
    test('POST /MeGusta - Registrar un MeGusta a una reseña existente en la base de datos', async () =>
    {
        const DatosPrimerMeGusta = {
            idJugador: idPrimerJugador,
            idResena: idPrimerReseña,
            idJugadorAutor: idPrimerJugador,
            idJuego: 41437,
            nombreJuego: 'Fortnite-battle-royale'
        }
        const DatosSegundoMeGusta = {
            idJugador: idSegundoJugador,
            idResena: idPrimerReseña,
            idJugadorAutor: idPrimerJugador,
            idJuego: 41437,
            nombreJuego: 'Fortnite-battle-royale'
        }
        const resPrimerInsercion = await request(servidor).post('/gamelog/MeGusta')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosPrimerMeGusta); 
        const resSegundaInsercion = await request(servidor).post('/gamelog/MeGusta')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosSegundoMeGusta);
        expect(resPrimerInsercion.statusCode).toBe(200);
        expect(resSegundaInsercion.statusCode).toBe(200);
    })

    test('POST /MeGusta - Registrar un MeGusta a una reseña que ya se le ha dado MeGusta', async () =>
    {
        const DatosPrimerMeGusta = {
            idJugador: idPrimerJugador,
            idResena: idPrimerReseña,
            idJugadorAutor: idPrimerJugador,
            idJuego: 41437,
            nombreJuego: 'Fortnite-battle-royale'
        }
        const resPrimerInsercion = await request(servidor).post('/gamelog/MeGusta')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosPrimerMeGusta); 
        expect(resPrimerInsercion.statusCode).toBe(400);
    })

    test('POST /MeGusta - Registrar un MeGusta a una reseña inexistente', async () =>
    {
        const DatosPrimerMeGusta = {
            idJugador: idPrimerJugador,
            idResena: 9281,
            idJugadorAutor: idPrimerJugador,
            idJuego: 41437,
            nombreJuego: 'Fortnite-battle-royale'
        }
        const resPrimerInsercion = await request(servidor).post('/gamelog/MeGusta')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosPrimerMeGusta); 
        expect(resPrimerInsercion.statusCode).toBe(400);
    })

    test('POST /MeGusta - Registrar un MeGusta a una reseña con datos de parámetros inválidos', async () =>
    {
        const DatosPrimerMeGusta = {
            idJugador: "ASQOWE",
            idResena: "ASIJE",
            idJugadorAutor: "pokafsa",
            idJuego: "asdop",
            nombreJuego: 12134242
        }
        const resPrimerInsercion = await request(servidor).post('/gamelog/MeGusta')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosPrimerMeGusta); 
        expect(resPrimerInsercion.statusCode).toBe(400);
    })

    test('DELETE /MeGusta/:idJuego - Eliminar un MeGusta a una reseña existente en la base de datos', async () =>
    {
        const DatosPrimerEliminacion = {
            idJugador: idPrimerJugador,
            idResena: idPrimerReseña,
            idJugadorAutor: idPrimerJugador,
            nombreJuego: 'Fortnite-battle-royale'
        }
        const DatosSegundaEliminacion = {
            idJugador: idSegundoJugador,
            idResena: idPrimerReseña,
            idJugadorAutor: idPrimerJugador,
            nombreJuego: 'Fortnite-battle-royale'
        }
        const resPrimerEliminacion = await request(servidor).delete(`/gamelog/MeGusta/${41437}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosPrimerEliminacion); 
        const resSegundaEliminacion = await request(servidor).delete(`/gamelog/MeGusta/${41437}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosSegundaEliminacion);
        expect(resPrimerEliminacion.statusCode).toBe(200);
        expect(resSegundaEliminacion.statusCode).toBe(200);
    })

    test('DELETE /MeGusta/:idJuego - Tratar de eliminar un MeGusta a una reseña inexistente en la base de datos', async () =>
    {
        const DatosPrimerEliminacion = {
            idJugador: idTercerJugador,
            idResena: idPrimerReseña,
            idJugadorAutor: idPrimerJugador,
            nombreJuego: 'Fortnite-battle-royale'
        }
        const resPrimerEliminacion = await request(servidor).delete(`/gamelog/MeGusta/${41437}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosPrimerEliminacion); 
        expect(resPrimerEliminacion.statusCode).toBe(400);
    })

    test('DELETE /MeGusta/:idJuego - Tratar de eliminar un MeGusta a una reseña con datos inválidos', async () =>
    {
        const DatosPrimerEliminacion = {
            idJugador: 'KMAOISDNA',
            idResena: 'ASOIJDIO',
            idJugadorAutor: 'MASDIOANSDAD',
            nombreJuego: 12345
        }
        const resPrimerEliminacion = await request(servidor).delete(`/gamelog/MeGusta/${23545}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosPrimerEliminacion); 
        expect(resPrimerEliminacion.statusCode).toBe(400);
    })
})