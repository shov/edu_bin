# Contracts

## Auth API

### Login

`POST /login`

body

```JSON
{
  "email": "string email",
  "password": "password"
}
```

response

```JSON
{
  "token": "JWT"
}
```

codes

- `200 OK`
- `401 Unauthorized`

### Sign in

`POST /login`

body

```JSON
{
  "email": "string email",
  "password": "password"
}
```

response

```JSON
{
  "token": "JWT"
}
```

codes

- `200 OK`
- `403 Forbidden`
- `401 Unauthorized`

## File API

### Create

`POST /file`

body

```JSON
{
  "name": "unique file name",
}
```

response

```JSON
{
  "id": "134314",
  "name": "unique fime name",
  "text": "",
  "createdAt": "2024-01-06T00:00:00Z",
  "updatedAt": "2024-01-06T00:00:00Z"
}
```

### List

`GET /file`

response

```JSON
[
  {
    "id": "134314",
    "name": "unique fime name",
    "text": "",
    "createdAt": "2024-01-06T00:00:00Z",
    "updatedAt": "2024-01-06T00:00:00Z"
  }
]
```

codes

- `200 Created`
- `401 Unauthorized`

### Get one
`GET /file/{id}`

response
```JSON
{
  "id": "134314",
  "name": "unique fime name",
  "text": "",
  "createdAt": "2024-01-06T00:00:00Z",
  "updatedAt": "2024-01-06T00:00:00Z"
}
```

codes

- `200 OK`
- `404 Not Found`
- `403 Forbidden`
- `401 Unauthorized`

### Delete

`DELETE /file/{id}`

codes

- `204 No Content`
- `404 Not Found`
- `403 Forbidden`
- `401 Unauthorized`


## Share API

### Invite to file

`GET /invite/{email}/{file id}`

codes

- `200 OK`
- `404 Not Found`
- `403 Forbidden`
- `401 Unauthorized`