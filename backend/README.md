# Creator SN Backend

This backend is based on the structure of `DAIR_Portal_BE` and currently includes:

- FastAPI + Tortoise ORM application shell
- SQLite database initialization and monthly backup helper
- JWT authentication, response/request models, and user management
- Resource management for members and products, including product reviews, attributes, and images

Other DAIR management controllers (news, publications, education, awards, teams, and taxonomy maintenance) are intentionally not registered yet.

Run locally from this directory:

```powershell
python -m uvicorn app:app --reload
```
