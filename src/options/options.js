document.getElementById('rules-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const author = document.getElementById('author').value;
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('content').value;
  
    const rule = { author, subject, content };
    chrome.storage.sync.set({ rule }, () => {
      console.log('Rule saved:', rule);
    });
  });