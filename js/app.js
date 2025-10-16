let todos = [];

function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const dateInput = document.getElementById('date-input');
    const todoText = todoInput.value.trim();
    const dueDate = dateInput.value;

    if (todoText === '') {
        showValidationError('Tolong masukkan Todo-List.');
        todoInput.focus();
        return;
    }

    if (todoText.length < 3) {
        showValidationError('To-do item harus minimal 3 karakter ges');
        todoInput.focus();
        return;
    }

    if (!dueDate) {
        showValidationError('Tolong pilih tanggal terlebih dahulu');
        dateInput.focus();
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (dueDate < today) {
        showValidationError('Tanggal tidak bisa dari hari yang lalu , sudah lewatttt');
        dateInput.focus();
        return;
    }

    const isDuplicate = todos.some(todo => todo.text.toLowerCase() === todoText.toLowerCase() && todo.date === dueDate);
    if (isDuplicate) {
        showValidationError('Sudah ada Todo-list.');
        todoInput.focus();
        return;
    }

    const todo = {
        id: Date.now(),
        text: todoText,
        date: dueDate,
        completed: false
    };

    todos.push(todo);
    todoInput.value = '';
    dateInput.value = '';
    displayTodos();
    showSuccessMessage('To-do item berhasil ditambah!');
}

function showValidationError(message) {
    const existingError = document.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 animate-fade-in';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            ${message}
        </div>
    `;

    const form = document.getElementById('todo-form');
    form.parentNode.insertBefore(errorDiv, form);

    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccessMessage(message) {
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 animate-fade-in';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            ${message}
        </div>
    `;

    const form = document.getElementById('todo-form');
    form.parentNode.insertBefore(successDiv, form);

    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

function displayTodos(filter = 'all') {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    let filteredTodos = todos;
    if (filter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    } else if (filter === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    filteredTodos.forEach(todo => {
        const tr = document.createElement('tr');
        tr.className = 'todo-item';
        if (todo.completed) {
            tr.classList.add('completed');
        }
        tr.innerHTML = `
            <td class="border border-gray-300 p-2">${todo.text}</td>
            <td class="border border-gray-300 p-2">${todo.date}</td>
            <td class="border border-gray-300 p-2">${todo.completed ? 'Completed' : 'Pending'}</td>
            <td class="border border-slate-300 p-2 md:p-3">
                <div class="flex flex-col sm:flex-row gap-2">
                    <button onclick="toggleComplete(${todo.id})" class="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg transition duration-300 transform hover:scale-105 shadow-md text-xs md:text-sm">${todo.completed ? 'Undo' : 'Complete'}</button>
                    <button onclick="deleteTodo(${todo.id})" class="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg transition duration-300 transform hover:scale-105 shadow-md text-xs md:text-sm">Delete</button>
                </div>
            </td>
        `;
        todoList.appendChild(tr);
    });
}

function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        displayTodos();
    }
}

let todoToDelete = null;

function deleteTodo(id) {
    todoToDelete = id;
    showDeleteModal();
}

function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    const modalContent = document.getElementById('modal-content');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function hideDeleteModal() {
    const modal = document.getElementById('delete-modal');
    const modalContent = document.getElementById('modal-content');
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 300);
}

function confirmDelete() {
    if (todoToDelete !== null) {
        todos = todos.filter(t => t.id !== todoToDelete);
        displayTodos();
        todoToDelete = null;
    }
    hideDeleteModal();
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newText = prompt('Edit To-Do:', todo.text);
        const newDate = prompt('Edit Due Date:', todo.date);
        if (newText !== null && newDate !== null) {
            todo.text = newText.trim();
            todo.date = newDate;
            displayTodos();
        }
    }
}

function filterTodos() {
    const filter = document.getElementById('filter-select').value;
    displayTodos(filter);
}

// Event listeners
document.getElementById('add-btn').addEventListener('click', addTodo);
document.getElementById('filter-select').addEventListener('change', filterTodos);
document.getElementById('cancel-delete').addEventListener('click', hideDeleteModal);
document.getElementById('confirm-delete').addEventListener('click', confirmDelete);


document.getElementById('delete-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideDeleteModal();
    }
});