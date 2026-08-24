# Creator SN

The repository is now split into two deployable parts:

- `ui/`: the existing Vue/Vite frontend and its Nginx image configuration.
- `backend/`: a FastAPI/Tortoise backend based on `DAIR_Portal_BE`.

The first backend slice contains the core application, database initialization and backup, user management, and member/product resource management. Other management domains remain unregistered for now.

The Creator SN Portal now also includes DAIR-style invited registration, JWT login, profile editing, password changes, avatar upload/cropping, and a branded default avatar. The frontend Axios client uses `/api` in development and Docker; `npm run api` regenerates the Swagger client from the backend OpenAPI document.

Run both services with:

```powershell
docker compose up --build
```

- Frontend: `http://localhost:60081`
- Backend: `http://localhost:60031`
