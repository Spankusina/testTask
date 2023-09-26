<template>
  <router-view/>
</template>

<script>
 export default {
    name: 'App',
 }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.refresh {
    display: inline-block;
    vertical-align: bottom;
    width: 30px;
    height: 30px;
    border: none;
    background: url("./assets/button.png");
    background-size: contain;
    cursor: pointer;
    margin-bottom: 5px;
    margin-right: 20px;
}

.refresh:hover {
    background: url("./assets/button-hover.png");
    background-size: contain;
}

.refresh:active {
    background: url("./assets/button-active.png");
    background-size: contain;
}

.refresh:disabled {
    background: url("./assets/button-disabled.png");
    background-size: contain;
    cursor: default;
}
</style>
