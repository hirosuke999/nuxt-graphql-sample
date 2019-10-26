<template>
  <div>
    <input v-model="number" type="number" />
    <button @click="countUp">count up</button>
    <div v-if="$apollo.loading">Loading...</div>
    <ul v-if="!$apollo.loading">
      <li v-for="repo in repos" :key="repo.id">
        <a :href="repo.url">{{ repo.name }}</a>
        <span v-if="repo.viewerHasStarred">Starred</span>
        <button v-if="!repo.viewerHasStarred" @click="addStar(repo.id)">
          add star
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import getReposGql from '../apollo/gql/getRepos.gql'
import addStarGql from '../apollo/gql/addStar.gql'

export default {
  data() {
    return {
      number: 3,
      repos: []
    }
  },
  apollo: {
    repos: {
      query: getReposGql,
      variables() {
        return {
          number_of_repos: this.number
        }
      },
      update: ({ viewer }) => viewer.repositories.nodes
    }
  },
  methods: {
    countUp() {
      this.number++
    },
    async addStar(addStarId) {
      await this.$apollo.mutate({
        mutation: addStarGql,
        variables: {
          id: addStarId
        },
        refetchQueries: [
          {
            query: getReposGql,
            variables: {
              number_of_repos: 3
            }
          }
        ]
      })
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
