const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const fileDetails = document.getElementById('file-details');
const editButtonsBtn = document.getElementById('edit-buttons-btn');
const buttonEditorModal = document.getElementById('button-editor-modal');
const saveButtonConfigBtn = document.getElementById('save-button-config');
const closeEditorModalBtn = document.getElementById('close-editor-modal');

let customButtons = JSON.parse(localStorage.getItem('customButtons') || '[]');
let filesArray = [];
let isEditing = false;
let editingIndex = -1;

let currentSort = {
    column: null,
    ascending: true
};

editButtonsBtn.addEventListener('click', () => {
    isEditing = false;
    editingIndex = -1;
    document.getElementById('new-button-label').value = '';
    document.getElementById('new-button-executable').value = '';
    document.getElementById('new-button-description').value = '';
    resetSaveButton();
    buttonEditorModal.style.display = 'flex';
});

closeEditorModalBtn.addEventListener('click', () => {
    buttonEditorModal.style.display = 'none';
});

fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

function getParentDirectory(path) {
    const parts = path.split(/[/\\]/);
    return parts.length > 1 ? parts.slice(0, -1).join("/") : "(root)";
}

function handleFiles(files) {
    const newFiles = Array.from(files);
    for (const newFile of newFiles) {
        const isDuplicate = filesArray.some(
            existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size
        );
        if (!isDuplicate) {
            filesArray.push(newFile);
        }
    }
    renderFileList();
}

function formatFileSize(sizeInBytes) {
    if (sizeInBytes < 1024) {
        return sizeInBytes + ' B';
    } else if (sizeInBytes < 1024 * 1024) {
        return (sizeInBytes / 1024).toFixed(1) + ' KB';
    } else {
        return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}

function showFileDetails(file, path, extension) {
    fileDetails.dataset.filename = file.name;
    if (extension === 'txt') {
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            fileDetails.innerHTML = `
                <h3 style="margin-top: 0;">${file.name}</h3>
                <pre style="white-space: pre-wrap; background: #fff; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; max-height: 300px; overflow-y: auto;">${content}</pre>
            `;
        };
        reader.readAsText(file);
    } else {
        fileDetails.innerHTML = `
            <h3 style="margin-top: 0;">${file.name}</h3>
            <p style="color: gray;">(Preview not available for this file type)</p>
        `;
    }
}

function getFileExtension(name) {
    const idx = name.lastIndexOf('.');
    return idx !== -1 ? name.slice(idx + 1).toLowerCase() : '(none)';
}

function truncateName(name, maxLength) {
    return name.length > maxLength ? name.slice(0, maxLength) + '…' : name;
}

let lastLoadedButtons = [];

fetch('http://localhost:8080/api/button-config')
    .then(res => res.json())
    .then(config => {
        lastLoadedButtons = config;
        customButtons = JSON.parse(localStorage.getItem('customButtons')) || [];
        buildCommandButtons(config);
    })
    .catch(err => alert('Failed to load buttons: ' + err));

buildCommandButtons([]);

function createSingleCommandButton(cmd, isCustom = false, index = -1) {
    const commandButtonsDiv = document.getElementById("command-buttons");
    const row = document.createElement("div");
    row.className = "command-row";
    const btn = document.createElement("button");
    btn.textContent = cmd.label;
    const desc = document.createElement("span");
    desc.className = "description";
    desc.textContent = cmd.description || '';
    row.appendChild(btn);
    row.appendChild(desc);

    if (isCustom) {
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️ Edit";
        editBtn.title = "Edit this button";
        editBtn.style.marginLeft = "10px";
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            document.getElementById('new-button-label').value = cmd.label;
            document.getElementById('new-button-executable').value = cmd.executable;
            document.getElementById('new-button-description').value = cmd.description;
            isEditing = true;
            editingIndex = index;
            resetSaveButton();
            buttonEditorModal.style.display = 'flex';
        });

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "🗑️ Delete";
        removeBtn.title = "Remove this button";
        removeBtn.style.marginLeft = "10px";
        removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            customButtons.splice(index, 1);
            localStorage.setItem('customButtons', JSON.stringify(customButtons));
            buildCommandButtons(lastLoadedButtons);
        });
        row.appendChild(editBtn);
        row.appendChild(removeBtn);
    }

    btn.addEventListener("click", () => {
        let endpoint, body;
        if (cmd.executable === 'upload-xml') {
            const xmlPath = prompt("Please enter the full path to the XML file:", "");
            if (!xmlPath) {
                alert("Operation cancelled: XML path is required.");
                return;
            }
            fetch('http://localhost:8080/api/upload-xml', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path: xmlPath })
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        data.forEach(fileData => {
                            if (fileData.error) {
                                alert(fileData.error);
                            } else {
                                const fileContent = atob(fileData.content);
                                const blob = new Blob([fileContent], { type: 'text/plain' });
                                const lastModifiedTimestamp = fileData.lastModified ? parseInt(fileData.lastModified) : new Date().getTime();
                                const newFile = new File([blob], fileData.fileName, { lastModified: lastModifiedTimestamp });
                                filesArray.push(newFile);
                            }
                        });
                        renderFileList();
                    } else {
                        alert('Invalid response from server.');
                    }
                })
                .catch(err => alert('Error: ' + err.message));
            return;
        } else {
            let params = [];
            if (cmd.params && cmd.params.length > 0) {
                for (let i = 0; i < cmd.params.length; i++) {
                    const paramName = cmd.params[i];
                    let userInput = prompt(`Enter value for parameter ${i + 1} (${paramName}):`, "");
                    if (userInput === null) {
                        alert("Execution cancelled: parameter required.");
                        return;
                    }
                    params.push(userInput.trim());
                }
            }
            endpoint = 'http://localhost:8080/api/execute';
            body = JSON.stringify({
                batchFile: cmd.executable,
                params: params
            });
        }

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
            .then(res => {
                if (!res.ok) throw new Error('Server responded with ' + res.status);
                if (cmd.executable === 'upload-xml') {
                    return res.json();
                } else {
                    return res.text();
                }
            })
            .then(data => {
                if (cmd.executable === 'upload-xml') {
                    if (Array.isArray(data)) {
                        data.forEach(fileData => {
                            if (fileData.error) {
                                alert(fileData.error);
                            } else {
                                const fileContent = atob(fileData.content);
                                const blob = new Blob([fileContent], { type: 'text/plain' });
                                const lastModifiedTimestamp = fileData.lastModified ? parseInt(fileData.lastModified) : new Date().getTime();
                                const newFile = new File([blob], fileData.fileName, { lastModified: lastModifiedTimestamp });
                                filesArray.push(newFile);
                            }
                        });
                        renderFileList();
                    } else {
                        alert('Invalid response from server.');
                    }
                } else {
                    alert(data);
                }
            })
            .catch(err => alert('Error: ' + err.message));
    });

    commandButtonsDiv.appendChild(row);
}

function buildCommandButtons(commandConfig) {
    const commandButtonsDiv = document.getElementById("command-buttons");
    commandButtonsDiv.innerHTML = "";
    commandConfig.forEach(cmd => {
        createSingleCommandButton(cmd);
    });
    customButtons.forEach((cmd, index) => {
        createSingleCommandButton(cmd, true, index);
    });
}

closeEditorModalBtn.addEventListener('click', () => {
    buttonEditorModal.style.display = 'none';
    resetSaveButton();
});

function resetSaveButton() {
    saveButtonConfigBtn.onclick = () => {
        const label = document.getElementById('new-button-label').value.trim();
        const executable = document.getElementById('new-button-executable').value.trim();
        const description = document.getElementById('new-button-description').value.trim();

        if (!label || !executable) {
            alert('Label and Executable are required.');
            return;
        }

        const newButton = { label, executable, description };

        if (isEditing && editingIndex > -1) {
            customButtons[editingIndex] = newButton;
        } else {
            customButtons.push(newButton);
        }

        localStorage.setItem('customButtons', JSON.stringify(customButtons));
        buildCommandButtons(lastLoadedButtons);

        buttonEditorModal.style.display = 'none';
        isEditing = false;
        editingIndex = -1;

        document.getElementById('new-button-label').value = '';
        document.getElementById('new-button-executable').value = '';
        document.getElementById('new-button-description').value = '';
    };
}

document.querySelectorAll('th[data-sort]').forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
        const column = header.dataset.sort;
        if (currentSort.column === column) {
            currentSort.ascending = !currentSort.ascending;
        } else {
            currentSort.column = column;
            currentSort.ascending = true;
        }

        document.querySelectorAll('th[data-sort]').forEach(h => {
            h.textContent = h.dataset.label;
        });

        header.textContent = header.dataset.label + (currentSort.ascending ? " ↑" : " ↓");

        filesArray.sort((a, b) => {
            let aVal, bVal;
            switch (currentSort.column) {
                case 'name':
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                    break;
                case 'modified':
                    aVal = a.lastModified;
                    bVal = b.lastModified;
                    break;
                case 'size':
                    aVal = a.size;
                    bVal = b.size;
                    break;
                case 'directory':
                    aVal = getParentDirectory(a.webkitRelativePath || a.name).toLowerCase();
                    bVal = getParentDirectory(b.webkitRelativePath || b.name).toLowerCase();
                    break;
                default:
                    return 0;
            }
            if (aVal < bVal) return currentSort.ascending ? -1 : 1;
            if (aVal > bVal) return currentSort.ascending ? 1 : -1;
            return 0;
        });

        renderFileList();
    });
});

function renderFileList() {
    fileList.innerHTML = '';
    filesArray.forEach((file) => {
        const row = document.createElement('tr');
        const modifiedDate = new Date(file.lastModified).toLocaleString();
        const sizeDisplay = formatFileSize(file.size);
        const fullPath = file.webkitRelativePath || file.name;
        const parentDir = getParentDirectory(fullPath);

        row.file = file;
        row.innerHTML = `
            <td title="${file.name}">${truncateName(file.name, 20)}</td>
            <td>${parentDir}</td>
            <td>${modifiedDate}</td>
            <td>${sizeDisplay}</td>
            <td><button class="delete-btn" title="Remove file">❌</button></td>
        `;

        row.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const rowToDelete = e.target.closest('tr');
            filesArray = filesArray.filter(f => f !== rowToDelete.file);
            renderFileList();
        });

        row.addEventListener('click', () => {
            const fileToDisplay = row.file;
            const extension = getFileExtension(fileToDisplay.name);
            showFileDetails(fileToDisplay, fileToDisplay.webkitRelativePath || fileToDisplay.name, extension);
        });

        fileList.appendChild(row);
    });
}

document.getElementById("browse-btn").addEventListener("click", () => {
    document.getElementById("file-input").click();
});

document.getElementById("filter-large-files-btn").addEventListener("click", () => {
    filesArray = filesArray.filter(file => file.size > 15);
    renderFileList();
});