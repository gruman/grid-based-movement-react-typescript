import React, { useState, useEffect } from 'react';
import frog from './img/frog.png';
import truck from './img/truck.png';
import './App.css';

// Define the types for coordinates and squares
interface Coordinates {
  x: number;
  y: number;
}

interface Square {
  coordinates: Coordinates;
  id: number;
}

function App() {
  // State hooks for squares, frog position, and truck position
  const [squares, setSquares] = useState<Square[]>();
  const [frogPos, setFrogPos] = useState<Coordinates | null>(null);
  const [truckPos, setTruckPos] = useState<Coordinates | null>(null);

  useEffect(() => {
    // Initialize the game when the component mounts
    initializeGame();
  }, []);

  // Function to initialize the game state
  const initializeGame = () => {
    let newSquares = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        // Generate squares with random IDs and coordinates
        newSquares.push({
          id: Math.floor(Math.random() * 10000),
          coordinates: { x: i, y: j },
        });
      }
    }
    // Set the initial game state with squares, frog position, and a random truck position
    setSquares(newSquares);
    setFrogPos({ x: 3, y: 0 }); // Assuming initial frog position is at the bottom left
    setTruckPos(generateRandomPosition(newSquares));
  };

  // Function to calculate the Manhattan distance between two positions
  const calculateDistance = (pos1: Coordinates, pos2: Coordinates): number => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  };

  // Function to generate a random position that is not equal to the frog's position
  const generateRandomPosition = (excludedSquares: Square[]): Coordinates => {
    let randomSquare;
    do {
      randomSquare =
        excludedSquares[Math.floor(Math.random() * excludedSquares.length)];
    } while (
      frogPos &&
      calculateDistance(frogPos, randomSquare.coordinates) === 0
    );
    return randomSquare.coordinates;
  };

  // Function to handle the click event on a square
  const handlePosition = (coordinates: Coordinates) => {
    // Check if the frog can move to the clicked square (distance is 1) or if it's the initial move
    if (!frogPos || calculateDistance(frogPos, coordinates) === 1) {
      setFrogPos(coordinates);
      // Set a new random position for the truck after the frog moves
      setTruckPos(generateRandomPosition(squares!));
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Frogger</h1>
      </header>
      <main>
        <div className="grid-container">
          {/* Map through squares to render the grid */}
          {squares &&
            squares.map((item, index) => {
              return (
                <div
                  key={item.id}
                  onClick={() =>
                    handlePosition({
                      x: item.coordinates.x,
                      y: item.coordinates.y,
                    })
                  }
                >
                  {/* Render frog and truck images based on their positions */}
                  {frogPos &&
                    frogPos.x === item.coordinates.x &&
                    frogPos.y === item.coordinates.y && (
                      <img src={frog} className="frog" alt="frog" />
                    )}
                  {truckPos &&
                    truckPos.x === item.coordinates.x &&
                    truckPos.y === item.coordinates.y && (
                      <img src={truck} className="truck" alt="truck" />
                    )}
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}

export default App;
