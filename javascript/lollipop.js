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
            document.getElementById('balance').innerText = data.balance;
        } else {
            console.error('Failed to fetch balance:', data.message);
            alert('Error fetching balance: ' + data.message);
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
        alert('Unable to fetch balance. Please try again later.');
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
            body: JSON.stringify({ lollipop })
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

// Add event listeners for lollipop buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for lollipop actions
    document.getElementById('ringpop-btn').addEventListener('click', () => handleLollipopAction('RINGPOP', async () => {
        alert('You chose Ringpop. A Japanese businessman offers you €1500.');
        return confirm('Do you accept the offer?');
    }));

    document.getElementById('moomin-btn').addEventListener('click', () => handleLollipopAction('MOOMIN', async () => {
        alert('You chose the Moomin lollipop. People are agitated around you.');
        return confirm('Do you stop sucking?');
    }));

    document.getElementById('jolly-btn').addEventListener('click', () => handleLollipopAction('JOLLY RANCHER', async () => {
        alert('You chose Jolly Rancher. A group mocks you but gives you money.');
        return true;
    }));

    document.getElementById('john-btn').addEventListener('click', () => handleLollipopAction('JOHN PLAYER SPECIAL', async () => {
        alert('You chose John Player Special. A stranger wants your lollipop.');
        return confirm('Do you give them the lollipop?');
    }));

    document.getElementById('salvia-btn').addEventListener('click', () => handleLollipopAction('SALVIA POP', async () => {
        alert('You chose Salvia Pop. You feel sugar rushed and confused.');
        return true;
    }));

    document.getElementById('chupa-btn').addEventListener('click', () => handleLollipopAction('CHUPACHUPS', async () => {
        alert('You chose ChupaChups and lost your wallet.');
        return true;
    }));

    // Fetch and display the balance on page load
    updateBalance();
});
