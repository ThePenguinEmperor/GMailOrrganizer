# Gmail Organizer Chrome Extension

Gmail Organizer is a Chrome extension that helps you manage your Gmail folders and create auto-sorting rules for your emails.

## Features

- Create sorting rules based on email author, subject, or content.
- Automatically move emails to specified folders.
- Review and manage existing sorting rules.

## Installation

1. Clone the repository or download the ZIP file.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the directory where you cloned or extracted the repository.

## Usage

1. Click on the Gmail Organizer extension icon in the Chrome toolbar.
2. Use the interface to create, review, and manage sorting rules for your Gmail account.

## Development

### Prerequisites

- Node.js and npm installed.
- A Google Cloud project with the Gmail API enabled.

### Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/gmail-organizer.git
    cd gmail-organizer
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Update the `manifest.json` file with your OAuth client ID:
    ```json
    "oauth2": {
      "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
      "scopes": [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify"
      ]
    }
    ```

4. Load the extension in Chrome:
    - Open Chrome and go to [chrome://extensions/](http://_vscodecontentref_/0).
    - Enable "Developer mode" by toggling the switch in the top right corner.
    - Click on "Load unpacked" and select the directory where you cloned the repository.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please contact [yipibell@gmail.com](mailto:yipibell@gmail.com).