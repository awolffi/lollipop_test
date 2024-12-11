'use strict';

// Function to create modals dynamically without innerHTML
function createModal(id, title, message, callback = null) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = id;

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => closeModal(id));

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = title;

    const modalMessage = document.createElement('p');
    modalMessage.id = `${id}-message`;
    modalMessage.textContent = message;

    const okButton = document.createElement('button');
    okButton.id = `${id}-button`;
    okButton.textContent = 'OK';
    okButton.addEventListener('click', () => {
        if (callback) callback();
        closeModal(id);
    });

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalMessage);
    modalContent.appendChild(okButton);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);
}

// Show a modal
function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close a modal
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Utility function to fetch the player's balance and update the display
async function updateBalance() {
    try {
        const response = await fetch('/api/balance');
        if (!response.ok) {
            throw new Error(`Failed to fetch balance. Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            document.getElementById('balance').innerText = `Balance: €${data.balance}`;
        } else {
            console.error('Failed to fetch balance:', data.message);
            alert('Error fetching balance: ' + data.message);
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
        alert('Unable to fetch balance. Please try again later.');
    }
}

// Combat Step Handler
async function attackEnemy(action, salviaMode = false) {
    try {
        const response = await fetch('/combat_step', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, salvia_mode: salviaMode })
        });
        const result = await response.json();

        if (result.status === 'win' || result.status === 'lose') {
            alert(result.message);
            document.getElementById('combat-log').textContent = '';
            return; // End combat
        }

        // Update health and logs
        document.getElementById('player-health').textContent = `Health: ${result.player_health}`;
        document.getElementById('enemy-health').textContent = `Health: ${result.enemy_health}`;
        document.getElementById('combat-log').textContent = result.last_action;

    } catch (error) {
        console.error('Error during combat:', error);
    }
}

// Handle specific lollipop actions
async function handleLollipopAction(lollipop, functionality) {
    try {
        const userDecision = await functionality();
        if (!userDecision) return;

        const response = await fetch('/lollipop/select', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lollipop }) // Ensure correct payload structure
        });

        const data = await response.json();
        alert(data.message);

        if (data.balance !== undefined) {
            updateBalance();
        }
    } catch (error) {
        console.error(`Error with ${lollipop}:`, error);
        alert(`An error occurred with ${lollipop}: ${error.message}`);
    }
}

// Event Listeners
window.onload = () => {
    // Combat UI Setup
    document.getElementById('attack1').addEventListener('click', () => attackEnemy('Lollipop eye poke'));
    document.getElementById('attack2').addEventListener('click', () => attackEnemy('Lollipop throw'));
    document.getElementById('attack3').addEventListener('click', () => attackEnemy('Nut cracker'));

    // Fetch and display the balance on page load
    updateBalance();
};


// Lollipop-specific functionalities
async function ringpopFunctionality() {
    alert('You chose Ringpop, a classic choice. While sucking, you start talking to a Japanese businessman.');
    const userDecision = confirm('The businessman offers you €1500. Do you accept?');
    return userDecision ? true : false; // Only proceed if user accepts
}

async function moominFunctionality() {
    alert('You chose the Moomin lollipop. People around you are agitated.');
    const userDecision = confirm('An angry person asks you to stop and threatens to attack you. Do you stop sucking?');
    return !userDecision; // Proceed to action only if user refuses to stop
}

async function jollyRancherFunctionality() {
    alert('You chose Jolly Rancher. A group of guys mock you for your broke choice but then feel bad and give you money.');
    return true; // Always proceed for Jolly Rancher
}

async function johnPlayerFunctionality() {
    alert('You chose the John Player Special. A random stranger appears and is desperate for a lollipop.');
    const userDecision = confirm('Do you give her a lollipop?');
    return userDecision; // Proceed only if user gives the lollipop
}

async function salviaFunctionality() {
    alert('You chose the Salvia pop. You are sugar rushed and confused.');
    return true; // Always proceed for Salvia pop
}

async function chupaFunctionality() {
    alert('You chose ChupaChups, strong choice. While sucking, you lose your wallet.');
    return true; // Always proceed for ChupaChups
}

// Attach event listeners with specific lollipop actions
document.addEventListener('DOMContentLoaded', () => {
    // Create modals for each lollipop action
    createModal('ringpop-modal', 'Ringpop', 'Processing...');
    createModal('moomin-modal', 'Moomin', 'Processing...');
    createModal('jolly-rancher-modal', 'Jolly Rancher', 'Processing...');
    createModal('john-player-special-modal', 'John Player Special', 'Processing...');
    createModal('salvia-pop-modal', 'Salvia Pop', 'Processing...');
    createModal('chupa-modal', 'ChupaChups', 'Processing...');

    // Add event listeners for lollipop buttons
    document.getElementById('ringpop-btn').addEventListener('click', () => handleLollipopAction('RINGPOP', ringpopFunctionality));
    document.getElementById('moomin-btn').addEventListener('click', () => handleLollipopAction('MOOMIN', moominFunctionality));
    document.getElementById('jolly-btn').addEventListener('click', () => handleLollipopAction('JOLLY RANCHER', jollyRancherFunctionality));
    document.getElementById('john-btn').addEventListener('click', () => handleLollipopAction('JOHN PLAYER SPECIAL', johnPlayerFunctionality));
    document.getElementById('salvia-btn').addEventListener('click', () => handleLollipopAction('SALVIA POP', salviaFunctionality));
    document.getElementById('chupa-btn').addEventListener('click', () => handleLollipopAction('CHUPACHUPS', chupaFunctionality));

    // Fetch and display the balance on page load
    updateBalance();
});
