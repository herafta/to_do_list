// To-Do List App JavaScript
class TodoApp {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.apiBaseUrl = window.location.origin + '/api';
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadTasksOnStartup();
    }

    initializeElements() {
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.saveTasksBtn = document.getElementById('saveTasksBtn');
        this.loadTasksBtn = document.getElementById('loadTasksBtn');
        this.tasksTableBody = document.getElementById('tasksTableBody');
        this.messageContainer = document.getElementById('messageContainer');
        this.emptyState = document.getElementById('emptyState');
    }

    attachEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.addNewTask());
        this.saveTasksBtn.addEventListener('click', () => this.saveTasks());
        this.loadTasksBtn.addEventListener('click', () => this.loadTasks());
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveTasks();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.addNewTask();
            }
        });
    }

    async loadTasksOnStartup() {
        this.showMessage('Loading tasks...', 'info');
        await this.loadTasks();
    }

    addNewTask() {
        const task = {
            id: this.taskIdCounter++,
            folderPath: '',
            taskBrief: '',
            notes: ''
        };
        
        this.tasks.push(task);
        this.renderTask(task, true);
        this.updateEmptyState();
        
        // Focus on the first editable field of the new task
        setTimeout(() => {
            const newRow = this.tasksTableBody.lastElementChild;
            const firstEditable = newRow.querySelector('.editable');
            if (firstEditable) {
                firstEditable.focus();
            }
        }, 100);
    }

    renderTask(task, isNew = false) {
        const row = document.createElement('tr');
        if (isNew) {
            row.classList.add('task-row-new');
        }
        
        row.innerHTML = `
            <td>
                <span class="row-number">${this.tasks.indexOf(task) + 1}</span>
            </td>
            <td>
                <div class="editable" 
                     contenteditable="true" 
                     data-field="folderPath" 
                     data-task-id="${task.id}"
                     data-placeholder="Enter folder path (e.g., C:\\Projects\\MyProject)">${this.escapeHtml(task.folderPath)}</div>
                ${task.folderPath ? `<div class="mt-1">
                    <a href="file://${task.folderPath}" class="folder-link" target="_blank">
                        <i class="bi bi-folder2-open"></i>
                        Open Folder
                    </a>
                </div>` : ''}
            </td>
            <td>
                <div class="editable" 
                     contenteditable="true" 
                     data-field="taskBrief" 
                     data-task-id="${task.id}"
                     data-placeholder="Enter task description...">${this.escapeHtml(task.taskBrief)}</div>
            </td>
            <td>
                <div class="editable" 
                     contenteditable="true" 
                     data-field="notes" 
                     data-task-id="${task.id}"
                     data-placeholder="Enter additional notes...">${this.escapeHtml(task.notes)}</div>
            </td>
            <td>
                <button class="action-btn btn-danger-outline" onclick="todoApp.deleteTask(${task.id})" title="Delete Task">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        this.tasksTableBody.appendChild(row);
        this.attachEditableListeners(row);
    }

    attachEditableListeners(row) {
        const editables = row.querySelectorAll('.editable');
        
        editables.forEach(editable => {
            // Handle content changes
            editable.addEventListener('blur', (e) => {
                this.updateTaskField(e.target);
                this.updateFolderLink(e.target);
            });
            
            editable.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.target.blur();
                } else if (e.key === 'Tab') {
                    e.preventDefault();
                    this.focusNextEditable(e.target);
                }
            });

            // Handle paste events to clean HTML
            editable.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text');
                document.execCommand('insertText', false, text);
            });
        });
    }

    updateTaskField(element) {
        const taskId = parseInt(element.dataset.taskId);
        const field = element.dataset.field;
        const value = element.textContent.trim();
        
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task[field] = value;
        }
    }

    updateFolderLink(element) {
        if (element.dataset.field === 'folderPath') {
            const taskId = parseInt(element.dataset.taskId);
            const task = this.tasks.find(t => t.id === taskId);
            const row = element.closest('tr');
            const folderLinkContainer = row.querySelector('td:nth-child(2)');
            
            // Remove existing folder link
            const existingLink = folderLinkContainer.querySelector('.folder-link');
            if (existingLink) {
                existingLink.parentElement.remove();
            }
            
            // Add new folder link if path exists
            if (task && task.folderPath.trim()) {
                const linkDiv = document.createElement('div');
                linkDiv.className = 'mt-1';
                linkDiv.innerHTML = `
                    <a href="file://${task.folderPath}" class="folder-link" target="_blank">
                        <i class="bi bi-folder2-open"></i>
                        Open Folder
                    </a>
                `;
                folderLinkContainer.appendChild(linkDiv);
            }
        }
    }

    focusNextEditable(currentElement) {
        const allEditables = Array.from(document.querySelectorAll('.editable'));
        const currentIndex = allEditables.indexOf(currentElement);
        const nextEditable = allEditables[currentIndex + 1];
        
        if (nextEditable) {
            nextEditable.focus();
        } else if (allEditables.length > 0) {
            // If at the end, focus the first editable of the next row or add new task
            this.addNewTask();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.renderAllTasks();
            this.updateEmptyState();
            this.showMessage('Task deleted successfully', 'info');
        }
    }

    renderAllTasks() {
        this.tasksTableBody.innerHTML = '';
        this.tasks.forEach(task => this.renderTask(task));
        this.updateRowNumbers();
    }

    updateRowNumbers() {
        const rowNumbers = this.tasksTableBody.querySelectorAll('.row-number');
        rowNumbers.forEach((element, index) => {
            element.textContent = index + 1;
        });
    }

    updateEmptyState() {
        const hasTask = this.tasks.length > 0;
        this.emptyState.style.display = hasTask ? 'none' : 'block';
        document.querySelector('.table-container').style.display = hasTask ? 'block' : 'none';
    }

    async saveTasks() {
        this.setButtonLoading(this.saveTasksBtn, true);
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tasks: this.tasks })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showMessage(data.message, 'success');
            } else {
                this.showMessage(data.message, 'danger');
            }
        } catch (error) {
            this.showMessage(`Error saving tasks: ${error.message}`, 'danger');
        } finally {
            this.setButtonLoading(this.saveTasksBtn, false);
        }
    }

    async loadTasks() {
        this.setButtonLoading(this.loadTasksBtn, true);
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/tasks`);
            const data = await response.json();
            
            if (data.success) {
                this.tasks = data.tasks || [];
                
                // Update ID counter to avoid conflicts
                if (this.tasks.length > 0) {
                    this.taskIdCounter = Math.max(...this.tasks.map(t => t.id || 0)) + 1;
                }
                
                // Ensure all tasks have IDs
                this.tasks.forEach(task => {
                    if (!task.id) {
                        task.id = this.taskIdCounter++;
                    }
                });
                
                this.renderAllTasks();
                this.updateEmptyState();
                this.showMessage(data.message, 'success');
            } else {
                this.showMessage(data.message, 'danger');
            }
        } catch (error) {
            this.showMessage(`Error loading tasks: ${error.message}`, 'danger');
        } finally {
            this.setButtonLoading(this.loadTasksBtn, false);
        }
    }

    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showMessage(message, type = 'info') {
        // Clear existing messages
        this.messageContainer.innerHTML = '';
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            <strong>${type === 'success' ? 'Success!' : type === 'danger' ? 'Error!' : 'Info:'}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        this.messageContainer.appendChild(alertDiv);
        
        // Auto-hide success and info messages after 3 seconds
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 3000);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Export functionality
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tasks-export.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showMessage('Tasks exported successfully', 'success');
    }

    // Import functionality
    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    this.tasks = importedTasks;
                    this.renderAllTasks();
                    this.updateEmptyState();
                    this.showMessage(`Imported ${importedTasks.length} tasks successfully`, 'success');
                } else {
                    this.showMessage('Invalid file format', 'danger');
                }
            } catch (error) {
                this.showMessage('Error reading file: ' + error.message, 'danger');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Handle folder link clicks for better cross-platform support
document.addEventListener('click', (e) => {
    if (e.target.closest('.folder-link')) {
        e.preventDefault();
        const link = e.target.closest('.folder-link');
        const folderPath = link.href.replace('file://', '');
        
        // Try to open the folder (this may not work in all browsers due to security restrictions)
        try {
            window.open(link.href, '_blank');
        } catch (error) {
            todoApp.showMessage('Unable to open folder automatically. Please copy the path manually: ' + folderPath, 'info');
        }
    }
});

// Add keyboard shortcuts info
document.addEventListener('DOMContentLoaded', () => {
    console.log('Keyboard shortcuts:');
    console.log('Ctrl+S: Save tasks');
    console.log('Ctrl+N: Add new task');
    console.log('Tab: Move to next field');
    console.log('Enter: Save current field');
});