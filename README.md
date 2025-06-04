# Documentation API CookLikeGranny

### 1. Obtenir la liste des recettes (recipes)

/recipes

#### Post :

```json
{
  "title": "Tiramisu",
  "description": "Dessert Italien",
  "img_vignette": "",
}

Mettre le token dans le header:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMwLCJpZGVudGlmaWFudCI6InRlc3RkZWNhY2EiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0OTAyMjAzMSwiZXhwIjoxNzQ5MTA4NDMxfQ.GwKYws79P6Qca7LIR_5nSTD7lX6o3cGCAaL6h2jBhXI"
```

#### Delete :

```json
{
  "id_recipe":1
}

Mettre le token dans le header:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMwLCJpZGVudGlmaWFudCI6InRlc3RkZWNhY2EiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0OTAyMjAzMSwiZXhwIjoxNzQ5MTA4NDMxfQ.GwKYws79P6Qca7LIR_5nSTD7lX6o3cGCAaL6h2jBhXI"
```

### 2. Obtenir la liste des recettes (users)

/users

#### Post :

```json
{
  "identifiant": "testdutest2",
  "password": "testdutest2",
  "role": "user"
}

return un access token
```
