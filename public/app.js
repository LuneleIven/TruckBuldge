const API_URL = '/api/expenses';
const expenseList = document.getElementById('expense-list');

// Function to fetch and render expenses
async function fetchAndRenderExpenses() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch expenses');
        }
        const expenses = await response.json();

        // Clear current list
        expenseList.innerHTML = '';

        expenses.forEach(expense => {
            const expenseItem = document.createElement('div');
            expenseItem.className = 'expense-item';

            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'expense-details';

            const amountSpan = document.createElement('span');
            amountSpan.className = 'expense-amount';
            amountSpan.textContent = `$${expense.amount.toFixed(2)}`;

            const infoSpan = document.createElement('span');
            const categoryStrong = document.createElement('strong');
            categoryStrong.textContent = expense.category;
            infoSpan.appendChild(categoryStrong);
            infoSpan.appendChild(document.createTextNode(` - ${expense.description}`));

            const metaSpan = document.createElement('span');
            metaSpan.className = 'expense-meta';
            metaSpan.textContent = expense.date;

            detailsDiv.appendChild(amountSpan);
            detailsDiv.appendChild(infoSpan);
            detailsDiv.appendChild(metaSpan);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteExpense(expense.id);

            expenseItem.appendChild(detailsDiv);
            expenseItem.appendChild(deleteBtn);

            expenseList.appendChild(expenseItem);
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

// Function to delete an expense
async function deleteExpense(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete expense');
        }

        // Re-render the list
        await fetchAndRenderExpenses();
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

const expenseForm = document.getElementById('expense-form');

// Handle form submission
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount, category, date, description })
        });

        if (!response.ok) {
            throw new Error('Failed to add expense');
        }

        // Clear the form
        expenseForm.reset();

        // Re-render the list
        await fetchAndRenderExpenses();
    } catch (error) {
        console.error('Error adding expense:', error);
    }
});

// Initial fetch
fetchAndRenderExpenses();