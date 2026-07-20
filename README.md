# 💉 VacunAppMX

Sistema integral de gestión y control de esquemas de vacunación basado en la normatividad oficial mexicana. Esta plataforma permite el registro de pacientes, centros de salud, administración de vacunas y cálculo automático de esquemas según la edad del paciente (desde recién nacidos hasta adultos mayores).

## 🏗 Arquitectura del Proyecto

El proyecto está dividido en dos aplicaciones principales y gestionado a través de contenedores:

| Entorno | Tecnología Principal | Descripción |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Single Page Application (SPA) para la interfaz de usuario. |
| **Backend** | Node.js + Express | API RESTful que maneja la lógica de negocio y la base de datos. |
| **Base de Datos** | MySQL | Sistema de gestión de bases de datos relacional. |
| **DevOps** | Docker + Compose | Orquestación de contenedores para entornos de desarrollo. |

## 🚀 Requisitos Previos

*   [Docker](https://www.docker.com/products/docker-desktop) y Docker Compose instalados.
*   [Node.js](https://nodejs.org/) (v20 o superior) - Opcional, solo si se desea ejecutar fuera de Docker.
*   Git para el control de versiones.

## 🛠 Instalación y Despliegue (Docker)

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd VacunAppMX
    ```

2.  **Configurar variables de entorno:**
    *   Crea un archivo `.env` en la carpeta `/backend` basándote en un posible `.env.example`.
    *   Crea un archivo `.env` en la carpeta `/frontend` para la URL de la API.

3.  **Levantar los contenedores:**
    ```bash
    docker compose up --build
    ```
    Este comando levantará la base de datos MySQL, el servidor Backend en el puerto 4000 y el Frontend en el puerto especificado por Vite.

## 👥 Contribución
Para contribuir, por favor crea una rama (`feature/nueva-funcionalidad`), realiza tus commits y abre un Pull Request.