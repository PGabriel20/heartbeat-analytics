<template>
  <div>
    <h1>Home Page</h1>
    <p>Welcome to the home page!</p>

    <h1>Vue Hash Navigation Example</h1>
  
    <!-- Link to a specific section with a hash -->
    <a href="#section1">Go to Section 1</a>
    <a href="#section2">Go to Section 2</a>

    <!-- Content sections that you can link to -->
    <div id="section1">
      <h2>Section 1</h2>
      <p>This is the content for Section 1.</p>
    </div>

    <div id="section2">
      <h2>Section 2</h2>
      <p>This is the content for Section 2.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>
