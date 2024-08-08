import Weather from "./components/Weather";

function App() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="app">
      <Weather />
      <p className="copyright">
        © {currentYear} Medha Rawat. All rights reserved.
      </p>
    </div>
  );
}

export default App;
