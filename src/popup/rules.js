document.addEventListener('DOMContentLoaded', function() {
    const backToMainButton = document.getElementById('back-to-main');
    const rulesList = document.getElementById('rules-list');

    backToMainButton.addEventListener('click', function() {
        window.location.href = 'main.html';
    });

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
        });
    }

    fetchActiveRules();
});