

function App() {
  const currentDate = new Date();


  return (
    <section>
      <div>
        <h1>Module 1.1 Hello World</h1>
        <h2>Now is {currentDate.toLocaleTimeString()}</h2>
        <hr />
      </div>
    </section>
  );
}

export default App;
