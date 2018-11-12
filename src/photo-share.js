const { ApolloServer } = require('apollo-server')
const { MongoClient } = require('mongodb')
const users = require('../data/users')
require('dotenv').config()

const typeDefs = `
  type User {
    githubLogin: ID!
    name: String
    postedPhotos: [Photo!]!
  }

  type Photo {
    id: ID!
    name: String!
    description: String
    category: PhotoCategory!
    url: String!
    postedBy: User!
  }

  enum PhotoCategory {
    PORTRAIT
    LANDSCAPE
    ACTION
    SELFIE
  }

  type Mutation {
    postPhoto(name: String! description: String PhotoCategory=PORTRAIT): Photo!
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
    totalUsers: Int!
    allUsers: [Users!]!
  }
`

const resolvers = {
  Query: {
    totalPhotos: (parent, args, { photos }) => photos.countDocuments(),
    allPhotos: (parent, args, {photos}) => photos.find().toArray(),
    totalUsers: (parent, args, {users}) => users.find().countDocuments(),
    allUsers: (parent, args, {users}) => users.find().toArray()
    // countDocuments is a mongodb function for length
  },
  Mutation: {
    postPhoto: async (parent, args, { photos }) => {
      const newPhoto = {...args}
      const {insertedId} = await photos.insertOne(newPhoto)
      newPhoto.id = insertedId.toString()
      return newPhoto
    }
  },
  Photo: {
    id: parent => parent.id || parent._id.toString(),
    url: parent => `/img/${parent._id}.jpg`,
    postedBy: (parent, args, {users}) =>
      users.findOne({githubLogin: parent._id})
  },
  User: {
    postedPhotos: (parent, args, {photos}) =>
      photos.find({userID: parent.githubLogin}).toArray()
  }
}

const start = async () => {
  const client = await MongoClient.connect(process.env.POTATO, { useNewUrlParser: true })

  const db = client.db()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
      photos: db.collection('photos'),
      users: db.collection('users')
    }
  })

  server.listen().then(console.log)
}

start()