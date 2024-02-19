import React, { useEffect, useState } from 'react';
import { Player, Square } from './shared'; // Assuming shared_vars contains these variables
import { gameLogic } from './gameLogic'; // Assuming the existence of gameLogic function
import { game_over_screen } from './gameOverScreen'; // Assuming the existence of game_over_screen component
import shared_vars from './shared_vars'; // Assuming shared_vars is a module with shared state
import axios from 'axios'; // Using axios for making HTTP requests

// Define a class representing an online multiplayer game
class OnlineMultiplayerGame {
    // Define the website URL for the game
    website_name = "http://localhost:8000";

    // Constructor to initialize the game
    constructor(game_number = null, passcode = null) {
        this.squares = [
            [Square.EMPTY, Square.EMPTY, Square.EMPTY],
            [Square.EMPTY, Square.EMPTY, Square.EMPTY],
            [Square.EMPTY, Square.EMPTY, Square.EMPTY]
        ];

        let error = null;
        if (!game_number || !passcode) {
            [this.game_number, this.passcode, error] = OnlineMultiplayerGame.newgame();
        } else {
            this.game_number = game_number;
            this.passcode = passcode;
        }

        this.turn_history = [];
        this.human_players_here = [];
        this.rematch_requested = false;
        this.rematch_accepted = false;
        this.game_quit = false;
        this.other_quit = false;

        if (error) {
            console.error("Error in constructor:", error);
            this.constructor(); // Reinitialize if there's an error
        } else {
            const x_or_o = OnlineMultiplayerGame.am_i_x_or_o(this.game_number, this.passcode);
            if (x_or_o.error) {
                console.error("Error in constructor:", x_or_o.error);
                this.constructor(); // Reinitialize if there's an error
            } else {
                this.human_players_here.push(x_or_o.player);
            }
        }
    }

    // Method to make a move in the game
    async doMove(player, move) {
        try {
            const response = await axios.get(`${this.website_name}/move?game=${this.game_number}&key=${this.passcode}&move=${move}`);
            this.turn_history.push(new Move(player, move));
            this.squares[Math.floor((move - 1) / 3)][(move - 1) % 3] = player;
        } catch (error) {
            console.error("Error in doMove:", error);
        }
    }

    // Method to determine whose turn it is
    seeWhosTurnItIs() {
        return this.turn_history.length === 0 ? Player.X :
            this.turn_history[this.turn_history.length - 1].player === Player.X ? Player.O : Player.X;
    }

    // Method to wait for the other player's move
    async wait_for_other_player() {
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100 milliseconds
        try {
            const response = await axios.get(`${this.website_name}/lastmove?game=${this.game_number}&key=${this.passcode}`);
            const new_move = OnlineMultiplayerGame.parse_move(response.data);
            if (new_move) {
                for (const move of this.turn_history) {
                    if (move.position === new_move.position) return;
                }
                this.turn_history.push(new_move);
                this.squares[(new_move.position - 1) / 3][(new_move.position - 1) % 3] = new_move.player;
            }
        } catch (error) {
            console.error("Error in wait_for_other_player:", error);
        }
    }

    // Method to quit the game
    async quitGame() {
        try {
            await axios.get(`${this.website_name}/move?game=${this.game_number}&key=${this.passcode}&move=q`);
            this.game_quit = true;
        } catch (error) {
            console.error("Error in quitGame:", error);
        }
    }

    // Method to parse the move data received from the server
    static parse_move(text) {
        const match = text.match(/Player:[XO] Position:[0-9]/);
        if (match) {
            const player = match[0].charAt(7);
            const position = parseInt(match[0].charAt(17));
            return new Move(player === 'X' ? Player.X : Player.O, position);
        } else {
            return null;
        }
    }

    // Method to create a new game
    static async newgame() {
        try {
            const response = await axios.get(`${this.website_name}/newgame`);
            if (response.data.match(/Game Number:[0-9]* Passcode:[0-9]*/)) {
                const game_number = response.data.match(/Game Number:[0-9]*/)[0].split(':')[1].trim();
                const passcode = response.data.match(/Passcode:[0-9]*/)[0].split(':')[1].trim();
                return [game_number, passcode, null];
            } else if (response.data.match(/Error:/)) {
                return [null, null, response.data];
            } else {
                return [null, null, "Error: Something's wrong with the website"];
            }
        } catch (error) {
            console.error("Error in newgame:", error);
            return [null, null, "Error: Something's wrong with the website"];
        }
    }

    // Method to determine if the player is X or O
    static async am_i_x_or_o(game_number, key) {
        try {
            const response = await axios.get(`${this.website_name}/am-i-x-or-o?game=${game_number}&key=${key}`);
            if (response.data.match(/You are [XO]./)) {
                const player = response.data.match(/You are [XO]./)[0].charAt(8);
                return { player: player === 'X' ? Player.X : Player.O, error: null };
            } else if (response.data.match(/Error:/)) {
                return { player: null, error: response.data };
            } else {
                return { player: null, error: "Error: Something's wrong with the website" };
            }
        } catch (error) {
            console.error("Error in am_i_x_or_o:", error);
            return { player: null, error: "Error: Something's wrong with the website" };
        }
    }
}

// Define a functional component representing the online multiplayer view
const OnlineMultiplayerView = () => {
    // Declare a state variable to hold the game state
    const [game, setGame] = useState(null);

    // Initialize the game if it is not already initialized
    useEffect(() => {
        if (!game) {
            setGame(new OnlineMultiplayerGame());
        }
    }, [game]);

    // Check if the game is over
    const game_over = gameLogic(game);

// Render the game over screen if the game is over
if (game_over) {
    return (
        <div>
            <game_over_screen game={game} />
            {game.rematch_accepted && setGame(new OnlineMultiplayerGame())}
        </div>
    );
} else {
    return null; // Return null if the game is not over

}
