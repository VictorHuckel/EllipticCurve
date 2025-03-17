<template>
    <MyMenu />
    <div id="main">
      <div id="about-div">
        <h1>About</h1>
        <p>
          This is a simple elliptic curve visualizer. It allows you to visualize
          elliptic curves and their points. You can also perform point addition
          and scalar multiplication on elliptic curves.
        </p>
      </div>
      <div id="graph-div">
        <MyGraph />
      </div>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import MyMenu from "@/components/MyMenu.vue";
  import MyGraph from "@/components/MyGraph.vue";
  
  export default {
    name: "GraphView",
    components: {
      MyMenu,
      MyGraph,
    },
  };
  </script>