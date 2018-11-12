on localhost graphiql
```
mutation {
  postPhoto(
    name:"Seattle"
    description: "space needle"
  ) {
    id
    name
    description
  }
}
```