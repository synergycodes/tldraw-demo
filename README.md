# Data Visualization with tldraw

This demo showcases a feature-rich application tailored for visualizing and editing family tree data with real-time collaboration and a clean, styled UI.

## Overview

The project serves as a template for creating interactive diagrams using tldraw, with the following key features:

- Authentication Layer
 Secure access behind Single Sign-On (SSO) login.
- Data Import & Parsing
 Uploads and parses custom-format datasets into diagram elements on the canvas.
- Custom Shapes & Business Data Integration
 Represents domain-specific entities (e.g., people in a family tree) with editable properties in a dedicated side panel.
- Automatic Layout
 Applies a tree-structured layout automatically after importing the data for optimal readability.
- Tldraw Core Tools Integration
 Use native tools like freehand annotations, text, shape styling, and more.
- Styled UI with Custom Component Library
 Incorporated the company's design system.
- Real-Time Multi-User Collaboration
 Collaborate live using Tldraw's multiplayer engine — see other users' cursors, co-edit diagrams, and track changes in real time.
- Custom Node Palette & Drag-and-Drop
 Easily add predefined domain-specific nodes to the canvas using an intuitive drag-and-drop interface.
- Undo / Redo Support
 Easily revert changes or step forward through editing history.

 This solution shows what's possible when combining the flexibility of the Tldraw SDK with custom business logic, tailored UX, and collaboration capabilities. Ideal for teams seeking advanced diagramming interfaces for their domain-specific workflows.
Interested in building something similar? Reach out to [Synergy Codes](https://www.synergycodes.com/) — we specialize in custom diagramming tools.

## Project Structure

```
/
├── apps/
│   ├── frontend/     # React application with tldraw
│   └── backend/      # Express.js server
├── package.json      # Root package.json
└── pnpm-workspace.yaml
```

## Technical Stack

### Frontend

- **Core Libraries:**
  - [tldraw](https://tldraw.dev/) - Interactive diagram creation
  - [ELK.js](https://github.com/kieler/elkjs) - Graph layout algorithms
  - [@synergycodes/axiom](https://github.com/synergycodes/axiom) - Additional utilities
- React
- Vite
- TypeScript

### Backend

- Express.js
- TypeScript
- tsx (for development)

## Data Structure

The project supports two ways of importing data:

1. JSON Structure (as in `src/nodeDataArray.json`):

```json
{
  "photo": "URL to Wikimedia Commons photo",
  "key": "unique identifier",
  "parent": "parent's key",
  "firstName": "first name",
  "lastName": "last name",
  "reign": "reign period",
  "birthDate": "birth date",
  "deathDate": "death date",
  "gender": "gender",
  "w": 250,
  "h": 60
}
```

2. tldraw Export Models - You can import existing tldraw diagrams

## Requirements

- Node.js (version 18 or higher)
- pnpm (version 8 or higher)

## Installation

```bash
# Install all dependencies
pnpm install
```

## Running the Project

### Frontend

```bash
# Run in development mode
pnpm frontend dev

# Build
pnpm frontend build


### Backend

```bash
# Run in development mode
pnpm backend dev

# Build
pnpm backend build

# Run built version
pnpm backend start
```

### Running Both Applications

```bash
# Run both frontend and backend in development mode
pnpm dev

# Build both applications
pnpm build

# Run linter on both applications
pnpm lint
```

## Scripts

- `pnpm dev` - runs both applications in development mode
- `pnpm build` - builds both applications
- `pnpm lint` - runs linter on both applications
- `pnpm frontend dev` - runs frontend only
- `pnpm backend dev` - runs backend only

## Acknowledgments

- Photos sourced from Wikimedia Commons
- Family tree data based on official royal family records

## License

MIT
