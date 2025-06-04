import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3000");

function App() {
  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [operation, setOperation] = useState("add");
  const [results, setResults] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);

  useEffect(() => {
    socket.on("resultValue", (data) => {
      console.log("Calculation result received:", data);

      setResults((prevResults) => {
        return prevResults.map((item) => {
          if (
            +item.n1 === +data.n1 &&
            +item.n2 === +data.n2 &&
            item.op === data.operator
          ) {
            return { ...item, result: data.result };
          }
          return item;
        });
      });
    });

    return () => {
      socket.off("resultValue");
    };
  }, []);

  useEffect(() => {
    console.log("Results updated:", results);
  }, [results]);

  const handleNumberInput = (value) => {
    if (activeInput === "first") {
      setFirstNumber(firstNumber + value);
    } else if (activeInput === "second") {
      setSecondNumber(secondNumber + value);
    }
  };

  const handleBackspace = () => {
    if (activeInput === "first") {
      setFirstNumber(firstNumber.slice(0, -1));
    } else if (activeInput === "second") {
      setSecondNumber(secondNumber.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (activeInput === "first") {
      setFirstNumber("");
    } else if (activeInput === "second") {
      setSecondNumber("");
    }
  };

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
        n1: +firstNumber,
        n2: +secondNumber,
        op: operation,
      },
    });
  };

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
          <div>Tu peux faire des calculs</div>
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
                  <td>{item.op}</td>
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
