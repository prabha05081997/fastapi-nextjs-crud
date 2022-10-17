from http import HTTPStatus
from sre_constants import SUCCESS
import fastapi as _fastapi
import fastapi.security as _security

import sqlalchemy.orm as _orm
import services as _services
import schemas as _schemas
import database as _database
import models as _models

_models.Base.metadata.create_all(bind=_database.engine)

app = _fastapi.FastAPI()


# def create_database():
#     return _database.Base.metadata.create_all(bind=_database.engine)


@app.post('/api/users')
async def create_user(user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        print(db_user)
        raise _fastapi.HTTPException(
            status_code=400, detail="Email already exists")

    user = await _services.create_user(user, db)

    return await _services.create_token(user)


@app.post('/api/token')
async def generate_token(form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(), db: _orm.Session = _fastapi.Depends(_services.get_db)):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Credentials")

    return await _services.create_token(user)


@app.get("/api/users/me", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user


@app.post("/api/leads", response_model=_schemas.Lead)
async def create_lead(lead: _schemas.LeadCreate,
                      user: _schemas.User = _fastapi.Depends(
                          _services.get_current_user),
                      db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.create_lead(user=user, db=db, lead=lead)


@app.get("/api/leads", response_model=list[_schemas.Lead])
async def get_leads(user: _schemas.User = _fastapi.Depends(
        _services.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_leads(user=user, db=db)


@app.get("/api/leads/{lead_id}", status_code=HTTPStatus.OK)
async def get_lead(lead_id: int, user: _schemas.User = _fastapi.Depends(
        _services.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_lead(lead_id=lead_id, user=user, db=db)


@app.delete("/api/leads/{lead_id}", status_code=HTTPStatus.NO_CONTENT)
async def delete_lead(lead_id: int, user: _schemas.User = _fastapi.Depends(
        _services.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    await _services.delete_lead(lead_id, user, db)
    return {"message": "Successfully deleted"}


@app.put("/api/leads/{lead_id}", status_code=HTTPStatus.OK)
async def update_lead(lead_id: int, lead: _schemas.LeadCreate,
                      user: _schemas.User = _fastapi.Depends(
        _services.get_current_user),
        db: _orm.Session = _fastapi.Depends(_services.get_db)):
    await _services.update_lead(lead_id, lead, user, db)
    return {"message": "Successfully updated"}


@app.get("/api")
async def root():
    return {"message": "Awesome Leads Manager"}
