# 📘 Manual de Usuario – App de Fútbol Híbrida (AWS + Azure)


## Datos de los estudiantes      GRUPO No. 6
- **Nombre 1** - Tulio Jafeth Pirir Schuman--201700698
- **Nombre 2** - Juan Carlos Maldonado Solorzano--201222686
- **Nombre 3** - GEremias López Suruy--200313184
---

## 1️. Objetivos del Manual

- Proporcionar una guía clara y sencilla para que los usuarios puedan registrarse, consultar partidos, ver estadísticas y recibir notificaciones.  
- Explicar las funcionalidades principales de la aplicación de manera práctica y paso a paso.  
- Facilitar la experiencia del usuario para maximizar la interacción con la app.

---

## 2️. Breve Descripción de la Aplicación

La **App de Fútbol** es una plataforma interactiva destinada a **fanáticos, jugadores y equipos**, que permite:

- Consultar resultados y horarios de partidos.  
- Acceder a estadísticas de jugadores y equipos.  
- Subir fotos y videos de los partidos.  
- Recibir notificaciones en tiempo real sobre eventos importantes (goles, inicio de partidos, resultados).  
- Analizar el rendimiento de los equipos mediante reportes y gráficas.

La aplicación funciona tanto en **dispositivos móviles como en web**, y utiliza una **arquitectura híbrida en la nube** que combina **AWS y Azure** para ofrecer **rendimiento, seguridad y escalabilidad**.

---

## 3️. Pasos para Utilizar la Aplicación

### 3.1 Registro e Inicio de Sesión

1. Abrir la aplicación en el dispositivo.  
2. Seleccionar **“Registrarse”** si eres nuevo usuario o **“Iniciar sesión”** si ya tienes cuenta.  
3. Completar los datos: **nombre, correo electrónico, contraseña y rol** (fanático, jugador, administrador).  
4. Confirmar el registro mediante el **correo de verificación**.  

![appfutboll](img/appfutbol.JPG)


---

### 3.2 Consultar Partidos

1. Ir a la sección **“Partidos”** en el menú principal.  
2. Filtrar por **fecha, equipo o liga**.  
3. Seleccionar un partido para ver información detallada: **equipos, marcador, estadísticas de jugadores**.  

📸 **Captura sugerida:** Pantalla de listado de partidos y detalles del partido seleccionado.

---

### 3.3 Ver Estadísticas de Jugadores y Equipos

1. Acceder a la sección **“Estadísticas”**.  
2. Buscar un **jugador o equipo específico**.  
3. Revisar estadísticas individuales (**goles, asistencias, tarjetas**) y del equipo.  
4. Analizar **gráficas generadas por el sistema**.  

![buscar](img/buscar.JPG)

---

### 3.4 Subir Fotos y Videos

1. Ir a la sección **“Multimedia”**.  
2. Seleccionar **“Subir archivo”** y elegir la foto o video desde el dispositivo.  
3. Confirmar y esperar la **carga completa al servidor**.  
4. El contenido se almacena en **AWS S3** y se **replica en Azure Blob** para mayor disponibilidad.  

![busqueda](img/buscarporimagen.JPG)

![appfutboll](img/buscarjugador.JPG)
---

### 3.5 Recibir Notificaciones

1. Las notificaciones se reciben automáticamente en la app si están **activadas**.  
2. Pueden incluir: **goles, inicio de partidos, resultados y noticias importantes**.  
3. Administrar las preferencias desde **Configuración → Notificaciones**.  

📸 **Captura sugerida:** Pantalla de configuración de notificaciones.

---

### 3.6 Ajustes y Perfil de Usuario

1. Acceder a **Perfil** desde el menú principal.  
2. Actualizar información personal: **nombre, correo, contraseña y preferencias**.  
3. Guardar cambios y sincronizar con el servidor.  

📸 **Captura sugerida:** Pantalla de edición de perfil.

---

## 🛠️ Nota Técnica

Esta aplicación combina servicios de **AWS** y **Azure** para garantizar:
- Seguridad avanzada en los datos.  
- Almacenamiento eficiente de contenido multimedia.  
- Análisis de rendimiento en tiempo real.  

Todas las funcionalidades están diseñadas para ofrecer una experiencia **rápida, intuitiva y confiable**.

---

## ✅ Resumen de Pasos para Utilizar la Aplicación

| Sección | Acción Principal | Descripción | Captura Sugerida |
|----------|------------------|--------------|------------------|
| **3.1 Registro e Inicio de Sesión** | Crear o acceder a la cuenta | Registro e ingreso mediante verificación por correo | Pantalla de registro/inicio |
| **3.2 Consultar Partidos** | Buscar partidos | Filtros por fecha, equipo o liga | Listado y detalles de partido |
| **3.3 Ver Estadísticas** | Revisar rendimiento | Estadísticas y gráficas de jugadores/equipos | Pantalla de estadísticas |
| **3.4 Subir Multimedia** | Cargar fotos/videos | Contenido almacenado en AWS S3 y Azure Blob | Carga de archivos multimedia |
| **3.5 Notificaciones** | Recibir alertas | Configurar alertas de eventos en tiempo real | Configuración de notificaciones |
| **3.6 Perfil de Usuario** | Editar información personal | Actualizar datos y preferencias | Edición de perfil |

---

**Versión:** 1.0  
**Autor:** Equipo de Desarrollo – App de Fútbol Híbrida (AWS + Azure)  
**Última actualización:** Octubre 2025
