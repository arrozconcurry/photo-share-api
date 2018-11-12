db
```
POTATO=mongodb://test1:password1@ds159563.mlab.com:59563/photo-share-application-eve
```
potato b/c db_host is namespaced on my laptop and don't wanna deal with that. `MONGO_DB_HOST` would be better but not as fun for a tutorial

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