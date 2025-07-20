# To-Do List Web App

A modern, responsive web application for managing tasks with folder links, inline editing, and persistent storage.

## Features

✨ **Modern Interface**: Clean, responsive design using Bootstrap 5
📁 **Folder Links**: Clickable links to open local folders (Windows/Linux/Mac)
✏️ **Inline Editing**: Edit tasks directly in the table with intuitive controls
💾 **Persistent Storage**: Tasks saved to `tasks.json` file
🔄 **Auto-load**: Automatically loads existing tasks on page startup
⌨️ **Keyboard Shortcuts**: Efficient task management with keyboard controls
📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Architecture

- **Frontend**: HTML5, CSS3, JavaScript (ES6+) with Bootstrap 5
- **Backend**: Python Flask with CORS support
- **Storage**: JSON file-based storage (`tasks.json`)
- **API**: RESTful JSON API for task management

## Quick Start

### Prerequisites

- Python 3.7 or higher
- Modern web browser

### Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

### Task Management

- **Add Task**: Click "Add Task" button or press `Ctrl+N`
- **Edit**: Click on any field to edit inline
- **Save**: Click "Save Tasks" button or press `Ctrl+S`
- **Delete**: Click the trash icon to delete a task
- **Navigation**: Use `Tab` to move between fields, `Enter` to save current field

### Folder Links

1. Enter a folder path in the "Folder Link" column (e.g., `C:\Projects\MyProject` or `/home/user/projects`)
2. A clickable "Open Folder" link will appear automatically
3. Click the link to open the folder in your file manager

*Note: Folder opening may be restricted by browser security settings. If links don't work, copy the path manually.*

### Keyboard Shortcuts

- `Ctrl+S`: Save all tasks
- `Ctrl+N`: Add new task
- `Tab`: Move to next editable field
- `Enter`: Save current field and move to next
- `Shift+Enter`: Add line break in notes field

## API Endpoints

### GET /api/tasks
Retrieves all tasks from storage.

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "id": 1,
      "folderPath": "C:\\Projects\\MyProject",
      "taskBrief": "Complete documentation",
      "notes": "Add API examples and usage instructions"
    }
  ],
  "message": "Loaded 1 tasks successfully"
}
```

### POST /api/tasks
Saves the provided tasks to storage.

**Request:**
```json
{
  "tasks": [
    {
      "id": 1,
      "folderPath": "C:\\Projects\\MyProject",
      "taskBrief": "Complete documentation",
      "notes": "Add API examples and usage instructions"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Saved 1 tasks successfully"
}
```

## File Structure

```
├── app.py              # Flask backend server
├── index.html          # Main HTML file
├── static/
│   ├── style.css       # Custom CSS styles
│   └── script.js       # JavaScript functionality
├── requirements.txt    # Python dependencies
├── tasks.json          # Task storage (created automatically)
└── README.md          # This file
```

## Configuration

### Server Settings

The Flask server runs on:
- **Host**: `0.0.0.0` (accessible from network)
- **Port**: `5000`
- **Debug**: Enabled (for development)

To change these settings, modify the `app.run()` call in `app.py`.

### CORS

CORS is enabled for local development. For production deployment, configure CORS settings appropriately in `app.py`.

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Security Notes

1. **Folder Links**: Browser security may prevent automatic folder opening
2. **Local Access**: App designed for local use; secure appropriately for network deployment
3. **File Paths**: Validate folder paths for production use

## Troubleshooting

### Tasks not loading
- Check if `tasks.json` exists and has valid JSON format
- Verify Flask server is running and accessible
- Check browser console for error messages

### Folder links not working
- Ensure the folder path is correct and exists
- Try copying the path manually if automatic opening fails
- Check browser security settings for file:// protocol access

### Styling issues
- Ensure internet connection for Bootstrap CDN
- Check browser compatibility
- Clear browser cache and reload

## Development

### Adding Features

The modular structure makes it easy to extend:

- **Frontend**: Modify `script.js` for new functionality
- **Styling**: Update `style.css` for visual changes
- **Backend**: Extend `app.py` for new API endpoints
- **Storage**: Currently uses JSON; can be replaced with database

### Testing

Test the application with:
1. Various folder path formats
2. Large numbers of tasks
3. Special characters in task content
4. Different screen sizes and devices

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify all dependencies are installed correctly
