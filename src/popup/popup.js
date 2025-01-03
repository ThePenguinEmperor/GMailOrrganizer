document.addEventListener('DOMContentLoaded', function() {
    const reviewRulesButton = document.getElementById('review-rules');
    const createRuleButton = document.getElementById('create-rule');
    const rulesView = document.getElementById('rules-view');
    const createRuleView = document.getElementById('create-rule-view');
    const backToMainButton = document.getElementById('back-to-main');
    const backToMainFromCreateButton = document.getElementById('back-to-main-from-create');
    const ruleForm = document.getElementById('rule-form');
    const ruleKeySelect = document.getElementById('rule-key');
    const keyOptionsDiv = document.getElementById('key-options');
    const keyListSelect = document.getElementById('key-list');
    const addKeyButton = document.getElementById('add-key');
    const selectedKeysDiv = document.getElementById('selected-keys');
    const ruleActionSelect = document.getElementById('rule-action');
    const moveOptionsDiv = document.getElementById('move-options');
    const targetFolderSelect = document.getElementById('target-folder');
    const newFolderNameInput = document.getElementById('new-folder-name');
    const rulesList = document.getElementById('rules-list');

    let selectedKeys = [];

    // Hide key options and action options initially
    keyOptionsDiv.classList.add('hidden');
    ruleActionSelect.classList.add('hidden');
    moveOptionsDiv.classList.add('hidden');

    // Fetch email folders from Gmail
    function fetchEmailFolders() {
        // Placeholder for fetching folders from Gmail
        const folders = ['Inbox', 'Sent', 'Drafts', 'Spam', 'Trash'];
        targetFolderSelect.innerHTML = '';
        folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder;
            option.textContent = folder;
            targetFolderSelect.appendChild(option);
        });
        const createOption = document.createElement('option');
        createOption.value = 'create';
        createOption.textContent = 'Create new folder';
        targetFolderSelect.appendChild(createOption);
    }

    // Fetch and display active rules
    function fetchActiveRules() {
        chrome.storage.sync.get(['rules'], (result) => {
            const rules = result.rules || [];
            rulesList.innerHTML = '';
            rules.forEach(rule => {
                const li = document.createElement('li');
                li.textContent = `Folder: ${rule.folder}, Keys: ${rule.keys.join(', ')}, Action: ${rule.action}`;
                rulesList.appendChild(li);
            });
            reviewRulesButton.disabled = rules.length === 0;
        });
    }

    // Handle rule creation
    ruleForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const key = ruleKeySelect.value;
        const action = ruleActionSelect.value;
        let folder = null;
        if (action === 'move') {
            folder = targetFolderSelect.value === 'create' ? newFolderNameInput.value : targetFolderSelect.value;
        }

        const newRule = { key, keys: selectedKeys, action, folder };

        chrome.storage.sync.get(['rules'], (result) => {
            const rules = result.rules || [];
            rules.push(newRule);
            chrome.storage.sync.set({ rules }, () => {
                console.log('Rule saved:', newRule);
                fetchActiveRules();
                switchToMainView();
            });
        });

        // Clear form fields
        ruleForm.reset();
        keyOptionsDiv.classList.add('hidden');
        selectedKeysDiv.innerHTML = '';
        selectedKeys = [];
        ruleActionSelect.value = '';
        ruleActionSelect.classList.add('hidden');
        moveOptionsDiv.classList.add('hidden');
        newFolderNameInput.classList.add('hidden');
    });

    // Switch to main view
    function switchToMainView() {
        rulesView.classList.add('hidden');
        createRuleView.classList.add('hidden');
        reviewRulesButton.classList.remove('hidden');
        createRuleButton.classList.remove('hidden');
    }

    // Switch to rules view
    function switchToRulesView() {
        rulesView.classList.remove('hidden');
        createRuleView.classList.add('hidden');
        reviewRulesButton.classList.add('hidden');
        createRuleButton.classList.add('hidden');
    }

    // Switch to create rule view
    function switchToCreateRuleView() {
        rulesView.classList.add('hidden');
        createRuleView.classList.remove('hidden');
        reviewRulesButton.classList.add('hidden');
        createRuleButton.classList.add('hidden');
    }

    // Fetch unique keys from Gmail based on the selected key type
    function fetchUniqueKeys(keyType, callback) {
        chrome.runtime.sendMessage({ action: 'getAuthToken' }, (response) => {
            if (response.success) {
                const token = response.token;
                console.log('Token acquired:', token); // Add this line to log the token
                fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Messages data:', data); // Add this line to log the messages data
                    const messages = data.messages || [];
                    const uniqueKeys = new Set();
                    const fetchPromises = messages.map(message => {
                        return fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                        .then(response => response.json())
                        .then(email => {
                            console.log('Email data:', email); // Add this line to log the email data
                            if (keyType === 'author') {
                                const fromHeader = email.payload.headers.find(header => header.name === 'From');
                                if (fromHeader) uniqueKeys.add(fromHeader.value);
                            } else if (keyType === 'subject') {
                                const subjectHeader = email.payload.headers.find(header => header.name === 'Subject');
                                if (subjectHeader) uniqueKeys.add(subjectHeader.value);
                            } else if (keyType === 'content') {
                                if (email.snippet) uniqueKeys.add(email.snippet);
                            }
                        });
                    });
                    Promise.all(fetchPromises).then(() => {
                        console.log('Unique keys:', Array.from(uniqueKeys)); // Add this line to log the unique keys
                        callback(Array.from(uniqueKeys));
                    });
                })
                .catch(error => {
                    console.error('Error fetching messages:', error);
                });
            } else {
                console.error('Failed to get auth token:', response.error);
            }
        });
    }

    // Handle key selection change
    ruleKeySelect.addEventListener('change', function() {
        const key = ruleKeySelect.value;
        keyOptionsDiv.classList.remove('hidden');
        keyListSelect.innerHTML = '<option value="" disabled selected>Select Key Value</option>';
        fetchUniqueKeys(key, (keys) => {
            keys.forEach(k => {
                const option = document.createElement('option');
                option.value = k;
                option.textContent = k;
                keyListSelect.appendChild(option);
            });
        });
    });

    // Handle adding key
    addKeyButton.addEventListener('click', function() {
        const selectedKey = keyListSelect.value;
        if (selectedKey && !selectedKeys.includes(selectedKey)) {
            selectedKeys.push(selectedKey);
            const bubble = document.createElement('div');
            bubble.className = 'key-bubble';
            bubble.innerHTML = `<span>${selectedKey}</span><button type="button" class="remove-key">&times;</button>`;
            selectedKeysDiv.appendChild(bubble);
            bubble.querySelector('.remove-key').addEventListener('click', function() {
                selectedKeys = selectedKeys.filter(k => k !== selectedKey);
                selectedKeysDiv.removeChild(bubble);
                if (selectedKeys.length === 0) {
                    ruleActionSelect.classList.add('hidden');
                }
            });
            if (selectedKeys.length > 0) {
                ruleActionSelect.classList.remove('hidden');
            }
        }
    });

    // Handle action selection change
    ruleActionSelect.addEventListener('change', function() {
        if (ruleActionSelect.value === 'move') {
            moveOptionsDiv.classList.remove('hidden');
        } else {
            moveOptionsDiv.classList.add('hidden');
        }
    });

    // Handle target folder selection change
    targetFolderSelect.addEventListener('change', function() {
        if (targetFolderSelect.value === 'create') {
            newFolderNameInput.classList.remove('hidden');
            const suggestedName = selectedKeys[0] ? selectedKeys[0].split('@')[0] : '';
            newFolderNameInput.value = suggestedName;
        } else {
            newFolderNameInput.classList.add('hidden');
        }
    });

    // Event listeners for navigation buttons
    reviewRulesButton.addEventListener('click', switchToRulesView);
    createRuleButton.addEventListener('click', switchToCreateRuleView);
    backToMainButton.addEventListener('click', switchToMainView);
    backToMainFromCreateButton.addEventListener('click', switchToMainView);

    // Initial setup
    fetchEmailFolders();
    fetchActiveRules();
});