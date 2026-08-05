import axios from "axios";

// For current testing purposes, the base URL is set to "http://localhost:8000" to connect to the backend API.
function App() {
  async function testApi() {
    try {
      const response = await axios.post("http://localhost:8000/lessons", {
        subject: "Math",
        topic: "Fractions",
        grade: 5,
        duration_minutes: 45,
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <button onClick={testApi}>Test API</button>
    </div>
  );
}

export default App;