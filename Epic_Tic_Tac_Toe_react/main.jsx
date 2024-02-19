import React from 'react';
import { draw_text, draw_rectangle, is_mouse_button_down, get_mouse_position, init_window, set_target_fps, begin_drawing, clear_background, end_drawing } from './shared'; // Importing necessary functions from shared module
import shared_vars from './shared_vars'; // Importing shared variables
import { LocalMultiplayerView } from './local_multiplayer'; // Importing LocalMultiplayerView component
import { OnlineMultiplayerView } from './online_multiplayer'; // Importing OnlineMultiplayerView component

// Component for the main menu view
const MainMenuView = () => {
    // Function to handle mode selection based on mouse click
    const handleModeSelection = () => {
        if (is_mouse_button_down(0)) { // Checking if left mouse button is clicked
            const mp = get_mouse_position(); // Getting mouse position
            // Checking if the click is within the bounds of Local Multiplayer option
            if (mp.x > 150 && mp.y > 150 && mp.x < 4 * 150 && mp.y < 2 * 150) {
                shared_vars.view = <LocalMultiplayerView />; // Setting view to LocalMultiplayerView component
            } else if (mp.x > 150 && mp.y > 150 * 3 && mp.x < 4 * 150 && mp.y < 4 * 150) {
                shared_vars.view = <OnlineMultiplayerView />; // Setting view to OnlineMultiplayerView component
            }
        }
    };

    // Rendering UI elements
    return (
        <div>
            {draw_text("Welcome to EPIC TIC TAC TOE (name subject to change)", 150, 50, 20, 'white')} // Rendering welcome text
            
            {draw_rectangle(150, 150, 150 * 3, 150, 'white')} // Rendering rectangle for Local Multiplayer option
            {draw_text("Local Multiplayer", 150, 150, 50, 'orange')} // Rendering text for Local Multiplayer option
            
            {draw_rectangle(150, 3 * 150, 150 * 3, 150, 'white')} // Rendering rectangle for Online Multiplayer option
            {draw_text("Online Multiplayer", 150, 3 * 150, 50, 'orange')} // Rendering text for Online Multiplayer option
            
            {handleModeSelection()} // Handling mode selection based on mouse click
        </div>
    );
};

// Initializing window and setting target frames per second
init_window(shared_vars.windowsize, shared_vars.windowsize, "EPIC TIC TAC TOE (name subject to change)");
set_target_fps(60);

// Setting initial view to the main menu
shared_vars.view = <MainMenuView />;
shared_vars.main_menu = <MainMenuView />;

// Main loop to continuously render the view
while (!window_should_close()) {
    begin_drawing(); // Begin drawing
    clear_background('rgba(48, 213, 200, 1)'); // Clear background with a specific color
    shared_vars.view; // Render current view
    end_drawing(); // End drawing
}
