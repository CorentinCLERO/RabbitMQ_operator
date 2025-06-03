import { useState, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [operation, setOperation] = useState("add");
  const [results, setResults] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);

  const socket = io("http://localhost:3000");

  // function socketTrigger() {
  //   socket.emit("rabbitMQ", { data: "Test message from RabbitMQ" });
  // }

  socket.on("resultValue", () => {
    console.log("Calculation result received: with no data");
  });
  socket.on("resultValue", (data) => {
    console.log("Calculation result received:", data);
  });

  // Fonction pour gérer les entrées numériques
  const handleNumberInput = (value) => {
    if (activeInput === "first") {
      setFirstNumber(firstNumber + value);
    } else if (activeInput === "second") {
      setSecondNumber(secondNumber + value);
    }
  };

  // Fonction pour effacer le dernier chiffre
  const handleBackspace = () => {
    if (activeInput === "first") {
      setFirstNumber(firstNumber.slice(0, -1));
    } else if (activeInput === "second") {
      setSecondNumber(secondNumber.slice(0, -1));
    }
  };

  // Fonction pour effacer tout le champ
  const handleClear = () => {
    if (activeInput === "first") {
      setFirstNumber("");
    } else if (activeInput === "second") {
      setSecondNumber("");
    }
  };

  // Fonction pour valider que seuls les chiffres sont entrés
  const validateNumberInput = (e) => {
    const value = e.target.value;
    // Accepte uniquement les chiffres
    if (/^\d*$/.test(value)) {
      if (e.target === firstInputRef.current) {
        setFirstNumber(value);
      } else if (e.target === secondInputRef.current) {
        setSecondNumber(value);
      }
    }
  };

  // Fonction pour calculer les résultats
  const calculateResults = () => {
    setResults([
      ...results,
      {
        n1: firstNumber,
        n2: secondNumber,
        op: operation,
        result: "",
      },
    ]);
    socket.emit("calculateResults", {
      data: {
        n1: firstNumber,
        n2: secondNumber,
        op: operation,
      },
    });
  };

  // Fonction pour formater l'affichage des résultats
  // const formatOperation = (op) => {
  //   switch (op) {
  //     case "add":
  //       return "Addition";
  //     case "sub":
  //       return "Soustraction";
  //     case "mul":
  //       return "Multiplication";
  //     case "div":
  //       return "Division";
  //     default:
  //       return "";
  //   }
  // };

  return (
    <div className="container">
      <div className="calculator-container">
        <h1>Calculatrice</h1>

        <div className="input-container">
          <div className="input-group">
            <label>Premier nombre:</label>
            <input
              type="text"
              value={firstNumber}
              onChange={validateNumberInput}
              onFocus={() => setActiveInput("first")}
              ref={firstInputRef}
              placeholder="Entrez un nombre"
            />
          </div>

          <div className="operation-selector">
            <label>Opération:</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="add">Addition (+)</option>
              <option value="sub">Soustraction (-)</option>
              <option value="mul">Multiplication (×)</option>
              <option value="div">Division (÷)</option>
              <option value="all">Toutes les opérations</option>
            </select>
          </div>

          <div className="input-group">
            <label>Deuxième nombre:</label>
            <input
              type="text"
              value={secondNumber}
              onChange={validateNumberInput}
              onFocus={() => setActiveInput("second")}
              ref={secondInputRef}
              placeholder="Entrez un nombre"
            />
          </div>

          <button className="calculate-btn" onClick={calculateResults}>
            Calculer
          </button>
        </div>

        {/* Pavé numérique */}
        <div className={`numpad ${!activeInput && "disabled"}`}>
          <div className="numpad-row">
            <button onClick={() => handleNumberInput("7")}>7</button>
            <button onClick={() => handleNumberInput("8")}>8</button>
            <button onClick={() => handleNumberInput("9")}>9</button>
          </div>
          <div className="numpad-row">
            <button onClick={() => handleNumberInput("4")}>4</button>
            <button onClick={() => handleNumberInput("5")}>5</button>
            <button onClick={() => handleNumberInput("6")}>6</button>
          </div>
          <div className="numpad-row">
            <button onClick={() => handleNumberInput("1")}>1</button>
            <button onClick={() => handleNumberInput("2")}>2</button>
            <button onClick={() => handleNumberInput("3")}>3</button>
          </div>
          <div className="numpad-row">
            <button onClick={() => handleNumberInput("0")}>0</button>
            <button onClick={handleBackspace}>⌫</button>
            <button onClick={handleClear}>C</button>
          </div>
        </div>
      </div>
      <div className="result-container">
        {results.length === 0 ? (
          <div>Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>number 1</th>
                <th>operation</th>
                <th>number 2</th>
                <th>Result</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index}>
                  <td>{item.n1}</td>
                  <td>{item.operation}</td>
                  <td>{item.n2}</td>
                  <td>{item.result || "loading..."}</td>
                  <td>
                    <button
                      onClick={() =>
                        setResults(results.filter((_, i) => i !== index))
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
