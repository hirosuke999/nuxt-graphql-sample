import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { persistCache } from 'apollo-cache-persist'

export default () => {
  const httpLink = new HttpLink({ uri: 'https://api.github.com/graphql' })

  // auth token
  const token = '6704f899c177c675c85f62f82051a8a76d910114'
  // set token
  const authLink = setContext((_, { _headers }) => {
    return {
      headers: { Authorization: `bearer ${token}` }
    }
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message},
          Location: ${locations}, Path: ${path}`
        )
      })
    }
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  const link = ApolloLink.from([authLink, httpLink, errorLink])

  const cache = new InMemoryCache()

  persistCache({
    cache,
    storage: window.localStorage
  })

  return {
    link,
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network'
      },
      query: {
        fetchPolicy: 'cache-and-network'
      }
    }
  }
}
