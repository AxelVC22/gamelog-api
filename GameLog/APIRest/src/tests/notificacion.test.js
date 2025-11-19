import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/sql/AccesoModelo.js";
import { ModeloLogin } from "../api_rest/model/sql/LoginModelo.js";
import {ModeloSeguidor} from "../api_rest/model/sql/SeguidorModelo.js";
import {ModeloJuego} from "../api_rest/model/sql/JuegoModelo.js";
import {ModeloReseña} from "../api_rest/model/sql/ReseñaModelo.js"
import {ModeloNotificacion} from "../api_rest/model/sql/NotificacionModelo.js";
import {ModeloMeGusta} from "../api_rest/model/sql/MeGustaModelo.js"

let servidor;
let token;
let idPrimerJugador;
let idSegundoJugador;
let idTercerJugador;
let idPrimerReseña;
let idPrimerNotificacion;
let idSegundaNotificacion;
let idTercerNotificacion;

jest.setTimeout(15000);

beforeAll(async() =>
{
    const {server: servidorCreado} = CrearServidorTest({ModeloAcceso:ModeloAcceso,ModeloLogin:ModeloLogin,
                                    ModeloSeguidor:ModeloSeguidor,ModeloJuego:ModeloJuego,ModeloReseña:ModeloReseña,
                                    ModeloNotificacion:ModeloNotificacion,ModeloMeGusta:ModeloMeGusta});
        servidor = servidorCreado;
        const datosPrimerJugador =
        {
            correo: "chrisnotificacion@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "chris",
            primerApellido: "vasquez",
            segundoApellido: "zapata",
            nombreDeUsuario: "chrisnotificacion",
            descripcion: "soy el primer jugador :D",
            foto: "login.jpg",
            tipoDeUsuario: "Administrador"
        };
        const datosSegundoJugador =
        {
            correo: "oscarnotificacion@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "oscar",
            primerApellido: "hizay",
            segundoApellido: "apodaca",
            nombreDeUsuario: "oscarinnotificacion",
            descripcion: "soy el segundo jugador :D",
            foto: "login.jpg",
            tipoDeUsuario: "Administrador"
        };
        const datosTercerJugador =
        {
            correo: "marionotificacion@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "Mario Miguel",
            primerApellido: "Limon",
            segundoApellido: "Cabrera",
            nombreDeUsuario: "MarioFEInotificacion",
            descripcion: "soy el tercer jugador :D",
            foto: "login.jpg",
            tipoDeUsuario: "Administrador"
        };
        await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datosPrimerJugador);
        await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datosSegundoJugador);
        await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datosTercerJugador);
        const datosPrimerJugadorLogin =
        {
            correo: "chrisnotificacion@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        };
        const datosSegundoJugadorLogin =
        {
            correo: "oscarnotificacion@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        };
        const datosTercerJugadorLogin =
        {
            correo: "marionotificacion@gmail.com",
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
        const DatosPrimerSeguido = {idJugadorSeguidor: idSegundoJugador, idJugadorSeguido: idPrimerJugador};
        const DatosSegundoSeguido = {idJugadorSeguidor: idTercerJugador, idJugadorSeguido: idPrimerJugador};
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
        await request(servidor).post('/gamelog/resena')
                    .set({
                        "Content-Type": "application/json",
                        "access_token": `Bearer ${token}`
                    })
        .send(DatosReseñaPrimerJugador);
        const resConsulta = await request(servidor).get(`/gamelog/resena/jugador/${idPrimerJugador}?idJugadorBuscador=${idPrimerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        idPrimerReseña = resConsulta.body.reseñas[0].idResenia;
        const DatosPrimerMeGusta = {
            idJugador: idSegundoJugador,
            idResena: idPrimerReseña,
            idJugadorAutor: idPrimerJugador,
            idJuego: 41437,
            nombreJuego: 'Fortnite-battle-royale'
        }
        const DatosSegundoMeGusta = {
            idJugador: idTercerJugador,
            idResena: idPrimerReseña,
            idJugadorAutor: idPrimerJugador,
            idJuego: 41437,
            nombreJuego: 'Fortnite-battle-royale'
        }
        const DatosTercerMeGusta = {
            idJugador: idPrimerJugador,
            idResena: idPrimerReseña,
            idJugadorAutor: idPrimerJugador,
            idJuego: 41437,
            nombreJuego: 'Fortnite-battle-royale'
        }
        await request(servidor).post('/gamelog/MeGusta')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosPrimerMeGusta); 
        await request(servidor).post('/gamelog/MeGusta')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosSegundoMeGusta);
        const DatosEliminacionReseña = {
            idJugador: idSegundoJugador,
            idResena: idPrimerReseña,
            idJugadorAutor: idPrimerJugador,
        }
        await request(servidor).delete(`/gamelog/MeGusta/${41437}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosEliminacionReseña);
        await request(servidor).post('/gamelog/MeGusta')
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosTercerMeGusta);
})

afterAll(async() =>
{
    const datosEliminacionPrimerJugador = {
        tipoDeUsuario: "Administrador",
        correo: "chrisnotificacion@gmail.com"
    }
    const datosEliminacionSegundoJugador = {
        tipoDeUsuario: "Administrador",
        correo: "oscarnotificacion@gmail.com"
    }
    const datosEliminacionTercerJugador = {
        tipoDeUsuario: "Administrador",
        correo: "marionotificacion@gmail.com"
    }
    await request(servidor).delete(`/gamelog/seguidor/${idSegundoJugador}/${idSegundoJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
    await request(servidor).delete(`/gamelog/seguidor/${idTercerJugador}/${idTercerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            })
    await request(servidor).delete(`/gamelog/juego/${41437}`)
            .set({"access_token": `Bearer ${token}`}); 
    const DatosEliminacionPrimerMegustaReseña = {
        idJugador: idSegundoJugador,
        idResena: idPrimerReseña,
        idJugadorAutor: idPrimerJugador,
        nombreJuego: 'Fortnite-battle-royale'
    }
    const DatosEliminacionSegundoMeGustaReseña = {
        idJugador: idSegundoJugador,
        idResena: idPrimerReseña,
        idJugadorAutor: idPrimerJugador,
        nombreJuego: 'Fortnite-battle-royale'
    }
    await request(servidor).delete(`/gamelog/resena/${41437}/${idPrimerReseña}`)
            .set({
                "access_token": `Bearer ${token}`
            })
    await request(servidor).delete(`/gamelog/MeGusta/${41437}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosEliminacionPrimerMegustaReseña); 
    await request(servidor).delete(`/gamelog/MeGusta/${41438}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(DatosEliminacionSegundoMeGustaReseña);
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

describe('TEST para el servicio de notificaciones, donde se encuentran los métodos de consulta y eliminación', () =>
{
    test('GET /notificacion/jugador/:idJugador - Obtener las notificaciones de un jugador', async () =>
    {
        const resConsulta = await request(servidor).get(`/gamelog/notificacion/jugador/${idPrimerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            }); 
        console.log(resConsulta.body);
        idPrimerNotificacion = resConsulta.body.notificaciones[0].idNotificacion;
        idSegundaNotificacion = resConsulta.body.notificaciones[1].idNotificacion;
        idTercerNotificacion = resConsulta.body.notificaciones[2].idNotificacion;
        expect(resConsulta.statusCode).toBe(200);
    })

    test('GET /notificacion/jugador/:idJugador - Obtener notificaciones inexistentes de un jugador', async () =>
    {
        const resConsulta = await request(servidor).get(`/gamelog/notificacion/jugador/${idTercerJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            }); 
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(404);
    })

    test('GET /notificacion/jugador/:idJugador - Tratar de obtener notificaciones de un jugador, pasando parámetros inválidos', async () =>
    {
        const idJugador = "APKSONJBDAIO"
        const resConsulta = await request(servidor).get(`/gamelog/notificacion/jugador/${idJugador}`)
            .set({
                "access_token": `Bearer ${token}`
            }); 
        console.log(resConsulta.body);
        expect(resConsulta.statusCode).toBe(400);
    })

    test('DELETE /notificacion/:idNotificacion - Eliminar notificaciones existentes de un jugador', async() =>
    {
        const resPrimerEliminacion = await request(servidor).delete(`/gamelog/notificacion/${idPrimerNotificacion}`)
            .set({
                "access_token": `Bearer ${token}`
            }); 
        const resSegundaEliminacion = await request(servidor).delete(`/gamelog/notificacion/${idSegundaNotificacion}`)
            .set({
                "access_token": `Bearer ${token}`
            }); 
        const resTercerEliminacion = await request(servidor).delete(`/gamelog/notificacion/${idTercerNotificacion}`)
            .set({
                "access_token": `Bearer ${token}`
            });
        expect(resPrimerEliminacion.statusCode).toBe(200);
        expect(resSegundaEliminacion.statusCode).toBe(200);
        expect(resTercerEliminacion.statusCode).toBe(200);
    })

    test('DELETE /notificacion/:idNotificacion - Eliminar notificaciones inexistente de un jugador', async() =>
    {
        const resPrimerEliminacion = await request(servidor).delete(`/gamelog/notificacion/${89}`)
            .set({
                "access_token": `Bearer ${token}`
            }); 
        expect(resPrimerEliminacion.statusCode).toBe(400);
    })

    test('DELETE /notificacion/:idNotificacion - Tratar de eliminar una notificación pasando parámetros inválidos', async() =>
    {
        const idNotificacion = "APKSONJBDAIO"
        const resPrimerEliminacion = await request(servidor).delete(`/gamelog/notificacion/${idNotificacion}`)
            .set({
                "access_token": `Bearer ${token}`
            }); 
        expect(resPrimerEliminacion.statusCode).toBe(400);
    })
})