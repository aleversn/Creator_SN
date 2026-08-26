# Creator SN

The repository is split into a Vue/Vite frontend and a FastAPI backend. For the
Docker deployment, the backend image builds and packages both parts:

- `ui/`: the Vue/Vite frontend.
- `backend/`: the FastAPI/Tortoise backend and the final runtime image.

The first backend slice contains the core application, database initialization and backup, user management, and member/product resource management. Other management domains remain unregistered for now.

The Creator SN Portal now also includes DAIR-style invited registration, JWT login, profile editing, password changes, avatar upload/cropping, and a branded default avatar. The frontend Axios client uses `/api` in development and Docker; `npm run api` regenerates the Swagger client from the backend OpenAPI document.

Build and run the integrated service with. The production reverse proxy can
continue forwarding the existing `60081` entry point to this service's port
`8000`; there is no separate frontend container anymore.

```powershell
docker compose up --build
```

- Frontend: `http://localhost:60081`
- Backend API: `http://localhost:60081/api`
