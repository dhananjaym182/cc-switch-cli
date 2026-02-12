# CC-Switch Web UI

A modern web interface for the cc-switch CLI tool - switch between coding AI providers with a graphical interface.

## Features

- **Provider Switching**: Easily switch between Claude, Gemini, and Codex
- **Status Monitoring**: View current provider status and configuration
- **Quick Actions**: Access common commands with one click
- **Interactive Console**: Real-time command output and feedback
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Using Serve (Recommended)

```bash
npm start
```

This will start a local server on http://localhost:8080

### Using Other Static Servers

You can use any static file server:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve . -p 8080

# PHP
php -S localhost:8080
```

## Usage

1. Open your browser and navigate to http://localhost:8080
2. Click on a provider card (Claude, Gemini, or Codex) to switch
3. Use quick action buttons to check config, list providers, etc.
4. View command output in the interactive console

## Provider Cards

### Claude
Anthropic's AI assistant with strong reasoning capabilities.

### Gemini
Google's multimodal AI model.

### Codex
OpenAI's coding assistant (requires OpenAI API key).

## Quick Actions

- **Check Config**: Verify configuration file and current settings
- **List Providers**: Show all available AI providers
- **Get Env Vars**: Display environment variable configuration
- **Help**: Show usage information and commands

## Project Structure

```
cc-switch-web-ui/
├── index.html      # Main HTML file
├── styles.css      # Styling and layout
├── app.js          # Application logic
├── package.json    # Dependencies and scripts
└── README.md       # This file
```

## Technical Details

- **Framework**: Vanilla JavaScript (no dependencies)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Icons**: Font Awesome 6.4.0 (CDN)
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## Development

To modify the web UI:

1. Edit HTML in `index.html` for structure changes
2. Edit CSS in `styles.css` for styling
3. Edit JavaScript in `app.js` for functionality

## Integration with CLI

This web UI provides a graphical interface to complement the cc-switch CLI tool. The actual provider switching is handled by the underlying CLI which this UI simulates and visualizes.

For full CLI functionality, refer to the main cc-switch documentation.

## License

MIT License - See main project LICENSE file
