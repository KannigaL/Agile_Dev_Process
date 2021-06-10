<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/shifts">Shifts</router-link> |
      <router-link to="/sick">Sickness</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 15px; /* original: 30px*/
  background-color: var(--primary-light);
  font-size: 2em;
}
#nav a {
  font-weight: bold;
  color: var(--on-primary);
}
#nav a.router-link-exact-active {
  color: var(--secondary-dark);
}
</style>
