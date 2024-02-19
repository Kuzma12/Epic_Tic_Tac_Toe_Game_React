import React, { useEffect, useState } from 'react';
import { draw_circle, draw_line_ex, draw_text, get_mouse_position, is_key_pressed } from 'pyray'; // Import necessary functions from 'pyray'

// Define constants for key codes
const KEY_R = 82;
const KEY_Q = 81;

// Define Square class representing states of a square
class Square {
    static EMPTY = -1;
    static O = 0;
    static X = 1;
}

// Define Player class representing players
class Player {
    static O = 0;
    static X = 1;
}

// Define functional component for the game
const TicTacToeGame = () => {
    // Define state variables
    const [squares, setSquares] = useState([
        [Square.EMPTY, Square.EMPTY, Square.EMPTY],
        [Square.EMPTY, Square.EMPTY, Square.EMPTY],
        [Square.EMPTY, Square.EMPTY, Square.EMPTY]
    ]);
    const [gameOver, setGameOver] = useState(false);

    // Effect to check for game over
    useEffect(() => {
        const winningCombination = findWinningCombination(squares);
        if (winningCombination || isBoardFull(squares)) {
            setGameOver(true);
        }
    }, [squares]);

    // Function to handle mouse click
    const handleMouseClick = () => {
        const [row, col] = getMouseSquare();
        if (row !== null && col !== null && squares[row][col] === Square.EMPTY) {
            // Update the squares if it's a valid move
            const newSquares = [...squares];
            newSquares[row][col] = Player.X; // Assuming X is the human player
            setSquares(newSquares);
        }
    };

    // Function to handle rematch request
    const handleRematchRequest = () => {
        // Handle rematch request logic here
    };

    // Function to handle quitting the game
    const handleQuitGame = () => {
        // Handle quit game logic here
    };

    // Function to draw the board
    const drawBoard = () => {
        // Draw lines to create the Tic Tac Toe board
        draw_line_ex({ x: 150, y: 150 * 2 }, { x: 150 * 4, y: 150 * 2 }, 3, YELLOW);
        draw_line_ex({ x: 150, y: 150 * 3 }, { x: 150 * 4, y: 150 * 3 }, 3, YELLOW);
        draw_line_ex({ x: 150 * 2, y: 150 }, { x: 150 * 2, y: 150 * 4 }, 3, YELLOW);
        draw_line_ex({ x: 150 * 3, y: 150 }, { x: 150 * 3, y: 150 * 4 }, 3, YELLOW);
    };

    // Function to draw X and O symbols
    const drawSquares = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const centerX = 150 + 150 * j;
                const centerY = 150 + 150 * i;
                const square = squares[i][j];
                if (square === Square.O) {
                    draw_circle(centerX, centerY, 75, WHITE);
                } else if (square === Square.X) {
                    draw_line_ex({ x: centerX - 75, y: centerY - 75 }, { x: centerX + 75, y: centerY + 75 }, 3, ORANGE);
                    draw_line_ex({ x: centerX + 75, y: centerY - 75 }, { x: centerX - 75, y: centerY + 75 }, 3, ORANGE);
                }
            }
        }
    };

    // Function to find the winning combination
    const findWinningCombination = squares => {
        // Check rows
        for (const row of squares) {
            if (row[0] === row[1] && row[1] === row[2] && row[0] !== Square.EMPTY) {
                return [[squares.indexOf(row), 0], [squares.indexOf(row), 1], [squares.indexOf(row), 2]];
            }
        }

        // Check columns
        for (let col = 0; col < 3; col++) {
            if (squares[0][col] === squares[1][col] && squares[1][col] === squares[2][col] && squares[0][col] !== Square.EMPTY) {
                return [[0, col], [1, col], [2, col]];
            }
        }

        // Check diagonals
        if (squares[0][0] === squares[1][1] && squares[1][1] === squares[2][2] && squares[0][0] !== Square.EMPTY) {
            return [[0, 0], [1, 1], [2, 2]];
        }
        if (squares[0][2] === squares[1][1] && squares[1][1] === squares[2][0] && squares[0][2] !== Square.EMPTY) {
            return [[0, 2], [1, 1], [2, 0]];
        }

        return null;
    };

    // Function to check if the board is full
    const isBoardFull = squares => {
        for (const row of squares) {
            for (const square of row) {
                if (square === Square.EMPTY) {
                    return false;
                }
            }
        }
        return true;
    };

    // Function to get the row and column of the clicked square
    const getMouseSquare = () => {
        const { x, y } = get_mouse_position();
        if (x > 150 && y > 150 && x < 4 * 150 && y < 4 * 150) {
            const row = Math.floor((y - 150) / 150);
            const col = Math.floor((x - 150) / 150);
            return [row, col];
        }
        return [null, null];
    };

    // JSX rendering
    return (
        <div>
            {/* Draw the Tic Tac Toe board */}
            {drawBoard()}
            {/* Draw X and O symbols */}
            {drawSquares()}
            {/* Display game over screen if game is over */}
            {gameOver && (
                <div>
                    {/* Display winning combination, winner, or tie */}
                    {/* Display rematch option */}
                    {/* Display option to quit game */}
                </div>
            )}
        </div>
    );
};

export default TicTacToeGame;
