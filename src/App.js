import Map from "./Components/Map";
import SocketState from "./hooks/SocketState";

function App() {
  

  return (
    <SocketState>
    <Map/>
    </SocketState>
  );
}

export default App;
