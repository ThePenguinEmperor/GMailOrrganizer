document.addEventListener('DOMContentLoaded', function() {
    const reviewRulesButton = document.getElementById('review-rules');
    const createRuleButton = document.getElementById('create-rule');

    reviewRulesButton.addEventListener('click', function() {
        window.location.href = 'rules.html';
    });

    createRuleButton.addEventListener('click', function() {
        window.location.href = 'create.html';
    });
});