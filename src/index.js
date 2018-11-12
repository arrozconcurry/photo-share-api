const { ApolloServer } = require("apollo-server");
const songs = [
  { id: '1', title: 'Under Pressure' , numberOne: true, performerId: '1' },
  { id: '2', title: 'Killer Queen', numberOne: false, performerId: '1' },
  { id: '3', title: 'Edge of Glory', numberOne: false, performerId: '2'}
]

const performers = [
  { id: '1', name: 'Queen'},
  { id: '2', name: 'Lady Gage'}
]

const typeDefs = `
  type Song {
    id: ID!
    title: String!
    numberOne: Boolean
    performer: Performer
  }

  type Performer {
    id: ID!
    name: String!
    songs: [Song!]!
  }

  type Query {
    allSongs: [Song!]!
    song(title: String): Song!
    allPerformers: [Performer!]!
    performer(name: String): Performer!
  }`

  // Add another Trivial Resolver for Peformer.songs

const resolvers = {
  Query: {
    allSongs: () => songs,
    song: (parent, {title}) => songs.find(s=> s.title === title),
    allPerformers: () => performers,
    performer: (parent, {name}) => performers.find(p => p.name === name)
  },
  Song: {
    performer: parent => 
      performers.find(p => parent.performerId === p.id.toString())
  },
  Performer: {
    songs: parent => songs.filter(s => parent.id.toString() === s.performerId)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(console.log);