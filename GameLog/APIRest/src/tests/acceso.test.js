import request  from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/sql/AccesoModelo.js";
import { ModeloLogin } from "../api_rest/model/sql/LoginModelo.js";
import { Publicador } from "../api_rest/utilidades/Redis.js";

let servidor;
let token;

jest.setTimeout(15000);

beforeAll(async () => {
    const { server: servidorCreado } = CrearServidorTest({ModeloAcceso : ModeloAcceso,ModeloLogin:ModeloLogin});
    servidor = servidorCreado;
    servidor = servidorCreado;
    const datos = 
        {
            correo: "usuariopruebaacceso@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "pruebaAcceso",
            primerApellido: "prueba",
            segundoApellido: "prueba",
            nombreDeUsuario: "prueba",
            descripcion: "login",
            foto: "login.jpg",
            tipoDeUsuario: "Administrador"
        };
    await request(servidor).post("/gamelog/acceso").set("Content-Type","application/json").send(datos);
    const DatosUsuario = 
        {
            correo: "usuariopruebaacceso@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
    const resLogin = await request(servidor).post('/gamelog/login').set("Content-Type","application/json").send(DatosUsuario);
    token = resLogin.headers['access_token'];
});

afterAll(async () => {
    const correo = "usuariopruebaacceso@gmail.com";
    const tipoDeUsuario = "Administrador";
    const resIdUsuario = await request(servidor)
        .get(`/gamelog/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
        .set({
            "access_token": `Bearer ${token}`
        })
    const idAcceso = resIdUsuario.body.idAcceso;
    const datosEliminacion = {
            tipoDeUsuario: "Administrador",
            correo: "usuariopruebaacceso@gmail.com"
        }
    await request(servidor).delete(`/gamelog/acceso/${idAcceso}`)
        .set({
            "Content-Type": "application/json",
            "access_token": `Bearer ${token}`
        })
        .send(datosEliminacion);
    servidor.close();
});

describe('Tests para el servicio CRUD de cuentas e inicio de sesion', () => 
{
    test('POST /acceso - Se crea una nueva cuenta de acceso', async () => 
    {
        const datos = 
        {
            correo: "oscarcito666@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "Oscar",
            primerApellido: "Hizay",
            segundoApellido: "Apodaca",
            nombreDeUsuario: "Garcia",
            descripcion: " ",
            foto: "foto1.jpg",
            tipoDeUsuario: "Administrador"
        };
        const res = await request(servidor)
            .post("/gamelog/acceso")
            .set("Content-Type","application/json")
            .send(datos);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("mensaje");
        expect(res.body.mensaje).toBe("La nueva cuenta de acceso ha sido registrada correctamente.")
    })

    test('POST /acceso - Se crea una cuenta con datos duplicados', async () => 
        {
            const datos = 
            {
                correo: "oscarcito666@gmail.com",
                contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                estado: "Desbaneado",
                nombre: "Chris",
                primerApellido: "Vasquez",
                segundoApellido: "Zapata",
                nombreDeUsuario: "christolin555",
                descripcion: " ",
                foto: "pepe.png",
                tipoDeUsuario: "Administrador"
            };
            const res = await request(servidor)
                .post("/gamelog/acceso")
                .set("Content-Type","application/json")
                .send(datos);
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("mensaje");
            expect(res.body.mensaje).toBe("El correo ingresado ya se encuentra registrado.")
        })
    
    test('POST /acceso - Se intenta crear una cuenta sin pasar datos de entrada', async () => 
        {
            const res = await request(servidor)
                .post("/gamelog/acceso")
                .set("Content-Type","application/json");
            expect(res.statusCode).toBe(400);
        })

    test('GET /acceso/:correo - Obtiene el id de la cuenta a través del correo ingresado', async() => 
    {
        const correo = "oscarcito666@gmail.com";
        const tipoDeUsuario = "Administrador";
        const resIdUsuario = await request(servidor)
            .get(`/gamelog/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        expect(resIdUsuario.status).toBe(200);
        expect(resIdUsuario.body).toHaveProperty("idAcceso");
    })

    test('GET /acceso/:correo - Se intenta obtener el id de una cuenta inexistente', async() => 
        {
            const correo = "chrisvasquez404@gmail.com";
            const tipoDeUsuario = "Administrador";
            const resIdUsuario = await request(servidor)
            .get(`/gamelog/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
            .set({
                "access_token": `Bearer ${token}`
            })
            expect(resIdUsuario.status).toBe(404);
        })
    
    test('GET /acceso/:correo - Se intenta obtener el id de una cuenta sin datos ingresados', async() => 
        {
            const resIdUsuario = await request(servidor)
            .get(`/gamelog/acceso/${null}`)
            .set({
                "access_token": `Bearer ${token}`
            });
            expect(resIdUsuario.status).toBe(400);
        })

    test('PUT /acceso/:id - Se editan las credenciales de acceso de una cuenta existente', async () => 
    {
        const correo = "oscarcito666@gmail.com";
        const tipoDeUsuario = "Administrador";
        const resIdUsuario = await request(servidor)
            .get(`/gamelog/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        const idAcceso = resIdUsuario.body.idAcceso;
        const datosEdicion = {
            correo: "chrisvasquez777@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
        const resEdicion = await request(servidor)
            .put(`/gamelog/acceso/${idAcceso}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEdicion);
        expect(resEdicion.body.mensaje).toBe("Los datos de acceso al sistema han sido modificados con éxito.");
        expect(resEdicion.statusCode).toBe(200);
        expect(resEdicion.body).toHaveProperty("mensaje");
    })

    test('PUT /acceso/:id - Se tratan de editar credenciales de una cuenta inexistente', async () => 
    {
        const datosEdicion = {
            correo: "chrisvasquez777@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
        const resEdicion = await request(servidor)
            .put(`/gamelog/acceso/${24}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEdicion);
        expect(resEdicion.body.mensaje).toBe("El ID de la cuenta ingresada no existe.");
        expect(resEdicion.statusCode).toBe(400);
        expect(resEdicion.body).toHaveProperty("mensaje");
    })

    test('PUT /acceso/:id - Se tratan de editar credenciales de una cuenta sin datos a ingresar como parámetros', async () => 
        {
            const resEdicion = await request(servidor)
                .put(`/gamelog/acceso/${null}`)
                .set({
                    "access_token": `Bearer ${token}`
                });
            expect(resEdicion.statusCode).toBe(500);
        })

    test('PATCH /acceso/:id - Se edita el estado de la cuenta de acceso a Baneado o Desbaneado', async() => 
    {
        const correo = "chrisvasquez777@gmail.com";
        const tipoDeUsuario = "Administrador"
        const resIdUsuario = await request(servidor)
            .get(`/gamelog/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
            .set({
                "access_token": `Bearer ${token}`
            })
        const idAcceso = resIdUsuario.body.idAcceso;
        const datosEdicion = {
            idAcceso,
            tipoDeUsuario: "Administrador",
            estadoAcceso: "Baneado"
        }
        const resEdicion = await request(servidor)
            .patch(`/gamelog/acceso/${idAcceso}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEdicion);
        expect(resEdicion.body.mensaje).toBe("El estado de la cuenta ha sido modificada con éxito");
        expect(resEdicion.statusCode).toBe(200);
        expect(resEdicion.body).toHaveProperty("mensaje");
    })

    test("PATCH /acceso/:id - Se trata de editar el estado de una cuenta inexistente", async () => {
        const datosEdicion = {
            idAcceso: 24,
            tipoDeUsuario: "Administrador",
            estadoAcceso: "Baneado",
        };
        const resEdicion = await request(servidor)
            .patch(`/gamelog/acceso/${24}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEdicion);
        expect(resEdicion.body.mensaje).toBe(
            "El ID de la cuenta ingresada no existe."
        );
        expect(resEdicion.statusCode).toBe(400);
        expect(resEdicion.body).toHaveProperty("mensaje");
    });

    test("PATCH /acceso/:id - Se trata de editar el estado de una cuenta sin ingresar parámetros", async () => {
        const resEdicion = await request(servidor)
            .patch(`/gamelog/acceso/${null}`)
            .set({
                "access_token": `Bearer ${token}`
            });
        expect(resEdicion.statusCode).toBe(500);
    });

    test("PATCH /acceso/:id - Se intenta editar el estado de una cuenta sin un token de verificacion", async () => {
        const resEdicion = await request(servidor)
            .patch(`/gamelog/acceso/${null}`);
        console.log(resEdicion.body);
        expect(resEdicion.statusCode).toBe(401);
    });

    test("PATCH /acceso/:id - Se intenta editar el estado de una cuenta con un token de verificacion inválido", async () => {
        const tokeninvalido = process.env.TOKEN_INVALIDO;
        const resEdicion = await request(servidor)
            .patch(`/gamelog/acceso/${null}`)
            .set({
                "access_token": `Bearer ${tokeninvalido}`
            });
        console.log(resEdicion.body);
        expect(resEdicion.statusCode).toBe(401);
    });

    test("DELETE /acceso/:id - Elimina de la base de datos una cuenta", async () => {
        const correo = "chrisvasquez777@gmail.com";
        const tipoDeUsuario = "Administrador"
        const resIdUsuario = await request(servidor)
            .get(`/gamelog/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
            .set({
                "access_token": `Bearer ${token}`
            });
        const idAcceso = resIdUsuario.body.idAcceso;
        const datosEliminacion = {
            tipoDeUsuario: "Administrador",
            correo: "chrisvasquez777@gmail.com"
        }
        const resEliminacion = await request(servidor)
            .delete(`/gamelog/acceso/${idAcceso}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEliminacion);
        expect(resEliminacion.statusCode).toBe(200);
    })

    test("DELETE /acceso/:id - Eliminar una cuenta inexistente de la base de datos", async() => {
        const datosEliminacion = {
            tipoDeUsuario: "Administrador",
            correo: "chrisvasquez985@gmail.com"
        }
        const resEliminacion = await request(servidor)
            .delete(`/gamelog/acceso/${24}`)
            .set({
                "Content-Type": "application/json",
                "access_token": `Bearer ${token}`
            })
            .send(datosEliminacion);
        expect(resEliminacion.statusCode).toBe(400);
    })

    test("DELETE /acceso/:id - Eliminar una cuenta sin ingresar datos como parámetros", async() => {
        const resEliminacion = await request(servidor)
            .delete(`/gamelog/acceso/${null}`)
            .set({
                "access_token": `Bearer ${token}`
            });
        expect(resEliminacion.statusCode).toBe(500);
    })
})