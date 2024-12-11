// Function to create modals dynamically
function createModal(id, title, message, callback = null) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = id;

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="closeModal('${id}')">&times;</span>
            <h2>${title}</h2>
            <p id="${id}-message">${message}</p>
            <button id="${id}-button">OK</button>
        </div>
    `;

    document.body.appendChild(modal);

    if (callback) {
        document.getElementById(`${id}-button`).addEventListener('click', () => {
            callback();
            closeModal(id);
        });
    } else {
        document.getElementById(`${id}-button`).addEventListener('click', () => closeModal(id));
    }
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

// API call to handle lollipop actions
async function lollipopAction(lollipop, callback = null) {
    try {
        const response = await fetch('/lollipop/select', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lollipop })
        });
        const result = await response.json();
        if (callback) callback(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Individual lollipop action handlers
function handleRingPop() {
    lollipopAction('RINGPOP', (result) => {
        document.getElementById('ringpop-modal-message').innerText = result.message;
        showModal('ringpop-modal');
    });
}

function handleMoomin() {
    lollipopAction('MOOMIN', (result) => {
        document.getElementById('moomin-modal-message').innerText = result.message;
        showModal('moomin-modal');
    });
}

function handleJollyRancher() {
    lollipopAction('JOLLY RANCHER', (result) => {
        document.getElementById('jolly-modal-message').innerText = result.message;
        showModal('jolly-modal');
    });
}

function handleJohnPlayer() {
    lollipopAction('JOHN PLAYER SPECIAL', (result) => {
        document.getElementById('john-modal-message').innerText = result.message;
        showModal('john-modal');
    });
}

function handleSalviaPop() {
    lollipopAction('SALVIA POP', (result) => {
        document.getElementById('salvia-modal-message').innerText = result.message;
        showModal('salvia-modal');
    });
}

function handleChupaChups() {
    lollipopAction('CHUPACHUPS', (result) => {
        document.getElementById('chupa-modal-message').innerText = result.message;
        showModal('chupa-modal');
    });
}

// Initialize modals and events
document.addEventListener('DOMContentLoaded', () => {
    // Create modals
    createModal('ringpop-modal', 'Ringpop', 'Loading...');
    createModal('moomin-modal', 'Moomin', 'Loading...');
    createModal('jolly-modal', 'Jolly Rancher', 'Loading...');
    createModal('john-modal', 'John Player Special', 'Loading...');
    createModal('salvia-modal', 'Salvia Pop', 'Loading...');
    createModal('chupa-modal', 'ChupaChups', 'Loading...');

    // Event listeners for buttons
    document.getElementById('ringpop-btn').addEventListener('click', handleRingPop);
    document.getElementById('moomin-btn').addEventListener('click', handleMoomin);
    document.getElementById('jolly-btn').addEventListener('click', handleJollyRancher);
    document.getElementById('john-btn').addEventListener('click', handleJohnPlayer);
    document.getElementById('salvia-btn').addEventListener('click', handleSalviaPop);
    document.getElementById('chupa-btn').addEventListener('click', handleChupaChups);
});
