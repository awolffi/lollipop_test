'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const resultContainer = document.getElementById('lollipop_result');
    const businessmanModal = document.getElementById('businessman-modal');
    const randomMoneyElement = document.getElementById('random-money');
    const acceptButton = document.getElementById('accept-offer');
    const declineButton = document.getElementById('decline-offer');

    // Helper function to make GET requests
    async function getRequest(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            return { status: 'error', message: 'Network error' };
        }
    }

    // Helper function to make POST requests
    async function postRequest(url, data = {}) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return await response.json();
        } catch (error) {
            return { status: 'error', message: 'Network error' };
        }
    }

    // Update the result container with a message
    function updateResult(message) {
        resultContainer.textContent = message;
    }

    // Event listeners for each lollipop button
    document.getElementById('button_1').addEventListener('click', async () => {
        // Ringpop logic
        const data = await getRequest('/api/ring-pop');
        if (data.money) {
            randomMoneyElement.textContent = data.money;
            businessmanModal.style.display = 'block';
        } else {
            updateResult('Failed to fetch the Ringpop offer.');
        }
    });

    acceptButton.addEventListener('click', async () => {
        const response = await postRequest('/api/ring-pop/accept');
        businessmanModal.style.display = 'none';
        if (response.success) {
            updateResult('You accepted the offer and added money to your balance!');
        } else {
            updateResult('Something went wrong when accepting the offer.');
        }
    });

    declineButton.addEventListener('click', () => {
        businessmanModal.style.display = 'none';
        updateResult('You declined the offer.');
    });

    document.getElementById('button_2').addEventListener('click', async () => {
        // Moomin logic
        const response = await getRequest('/moomin');
        updateResult(response.message || 'Something went wrong with the Moomin interaction.');
    });

    document.getElementById('button_3').addEventListener('click', async () => {
        // Jolly Rancher logic
        const response = await getRequest('/jolly');
        updateResult(response.message || 'Something went wrong with the Jolly Rancher interaction.');
    });

    document.getElementById('button_4').addEventListener('click', async () => {
        // John Player Special logic
        const response = await getRequest('/john_player');
        updateResult(response.message || 'Something went wrong with the John Player interaction.');
    });

    document.getElementById('button_5').addEventListener('click', async () => {
        // Salvia Pop logic
        const response = await getRequest('/salvia');
        updateResult(response.message || 'Something went wrong with the Salvia Pop interaction.');
    });

    document.getElementById('button_6').addEventListener('click', async () => {
        // ChupaChups logic
        const response = await getRequest('/chupa');
        updateResult(response.message || 'Something went wrong with the ChupaChups interaction.');
    });
});
