import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/sql/AccesoModelo.js";
import { ModeloLogin } from "../api_rest/model/sql/LoginModelo.js";
import { ModeloJugador } from "../api_rest/model/sql/JugadorModelo.js";

let servidor;
let token;
let idJugadorCreado;

jest.setTimeout(15000);

beforeAll(async () =>
{
    const {server: servidorCreado} = CrearServidorTest({ModeloAcceso:ModeloAcceso,ModeloLogin:ModeloLogin,ModeloJugador:ModeloJugador});
    servidor = servidorCreado;
    const datos = 
        {
            correo: "usuariopruebajugador@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "pruebaJugador",
            primerApellido: "prueba",
            segundoApellido: "prueba",
            nombreDeUsuario: "pruebaJugador",
            descripcion: "login",
            foto: "login.jpg",
            tipoDeUsuario: "Administrador"
        };
    await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datos);
    const DatosUsuario = 
        {
            correo: "usuariopruebajugador@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
    const resLogin = await request(servidor).post('/gamelog/login').set("Content-Type","application/json").send(DatosUsuario);
    token = resLogin.headers['access_token'];
    idJugadorCreado = resLogin.body.cuenta[0].idJugador;
    console.log(idJugadorCreado)
})

afterAll(async() => 
{
    const correo = "usuariopruebajugador@gmail.com";
    const tipoDeUsuario = "Administrador";
    const resIdUsuario = await request(servidor)
        .get(`/gamelog/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    const idAcceso = resIdUsuario.body.idAcceso;
    const datosEliminacion = {
            tipoDeUsuario: "Administrador",
            correo: "usuariopruebajugador@gmail.com"
        }
    await request(servidor).delete(`/gamelog/acceso/${idAcceso}`)
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(datosEliminacion);
    servidor.close();
})

describe('Tests para el servicio de Jugadores donde se encuentra la modificacion, busqueda y eliminacion', () =>
{
    test('GET /jugador/:nombreDeUsuario - Obtener los datos de un jugador buscandolo por su nombre de usuario', async() => 
    {
        let nombreDeUsuario = "pruebaJugador";
        const res = await request(servidor)
            .get(`/gamelog/jugador/${nombreDeUsuario}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("cuenta");
    })

    test('GET /jugador/:nombreDeUsuario - Intentar obtener los datos de un jugador inexistente por su nombre de usuario',async() =>
    {
        let nombreDeUsuario = "pepito777";
        const res = await request(servidor)
            .get(`/gamelog/jugador/${nombreDeUsuario}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(res.statusCode).toBe(404);
    })

    test('GET /jugador/:nombreDeUsuario - Obtener jugador con datos inválidos',async() =>
        {
            const NombreDeUsuario = '{ñ,lkop´{.,ñ'
            const res = await request(servidor)
                .get(`/gamelog/jugador/${NombreDeUsuario}`)
                .set({
                    "access_token": `Bearer ${token}`
                })
            expect(res.statusCode).toBe(400);
        })

    test('PUT /jugador/:idJugador - Modificar los datos del perfil de un jugador existente en la base de datos', async() => 
    {
        const datosEdicion = {
            nombre: "christolin",
            primerApellido: "pruebaModificado",
            nombreDeUsuario: "pruebaJugadores",
            foto: "fotito.jpg",
        };
        const resEdicion = await request(servidor)
            .put(`/gamelog/jugador/${idJugadorCreado}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEdicion);
        expect(resEdicion.statusCode).toBe(200);
        expect(resEdicion.body).toHaveProperty("mensaje");
    })

    test('PUT /jugador/:idJugador - Intentar modificar los datos de un perfil inexistente en la base de datos', async() => 
    {
        const datosEdicion = {
            nombre: "christolin",
            primerApellido: "pruebaModificado",
            nombreDeUsuario: "pruebaJugador",
            foto: "fotito.jpg",
        };
        const resEdicion = await request(servidor)
            .put(`/gamelog/jugador/${58}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEdicion);
        expect(resEdicion.statusCode).toBe(400);
    })

    test('PUT /jugador/:idJugador - Modificar los datos del perfil de un jugador con datos invalidos', async() => 
        {
            const datosEdicion = {
                nombre: "chris{+12¿¿'0tolin",
                primerApellido: "´09p´ñ{l,´{",
                nombreDeUsuario: "{.l´p´.+}",
                foto: "fotito.jpg",
            };
            const resEdicion = await request(servidor)
                .put(`/gamelog/jugador/${idJugadorCreado}`)
                .set({
                    "Content-Type": "application/json",
                    "access_token": `Bearer ${token}`
                })
                .send(datosEdicion);
            expect(resEdicion.statusCode).toBe(400);
        })

    test('DELETE /jugador/:idJugador - Eliminar un jugador registrado en la base de datos',async()=> 
    {
        const resEliminacion = await request(servidor)
            .delete(`/gamelog/jugador/${idJugadorCreado}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resEliminacion.status).toBe(200);
    })

    test('DELETE /jugador/:idJugador - Intentar eliminar un jugador inexistente en la base de datos',async()=> 
    {
        const resEliminacion = await request(servidor)
            .delete(`/gamelog/jugador/${59}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resEliminacion.status).toBe(400);
    })

    test('DELETE /jugador/:idJugador - Intentar eliminar un jugador sin pasar datos como parámetros',async()=> 
        {
            const resEliminacion = await request(servidor)
                .delete(`/gamelog/jugador/${null}`)
                .set({
                    "access_token": `Bearer ${token}`
                })
            expect(resEliminacion.status).toBe(400);
        })
})

