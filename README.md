# Jay Murlidhar Group - Full-Stack CRM & Website

A comprehensive enterprise-level platform for Jay Murlidhar Group, integrating a public-facing service website with an internal CRM dashboard for managing customers, invoices, quotations, and documents.

## Project Structure

The codebase is organized into a modular structure:

- `src/website/`: The public website pages, styles, and scripts.
- `src/crm/`: The internal CRM dashboard, split into feature modules (customer, invoice, quotation).
- `src/shared/`: Reusable UI components (Navbar, Sidebar, Footer, Modal) and global utility functions.
- `src/firebase/`: Firebase client SDK integrations.
- `src/backend/`: Server-side logic via Firebase Cloud Functions.
- `public/`: Static assets such as images and icons.

For a deeper dive into the architectural design, please refer to [docs/Architecture.md](docs/Architecture.md).

## Deployment Setup

This project is configured for deployment on multiple platforms.

### Firebase Hosting
Ensure you have the Firebase CLI installed:
```bash
npm install -g firebase-tools
```
Deploy the project:
```bash
firebase deploy --only hosting
```

### Vercel
The project includes a `vercel.json` for automatic routing and deployment on Vercel. Connect your repository to Vercel to trigger auto-deployments.

## Development

To run the project locally, you can use any static file server or Vite for a better developer experience:
```bash
npx serve .
```
Or if using Vite:
```bash
npm run dev
```

## Features

- **Public Website:** SEO-optimized, responsive pages detailing insurance, tech, and business services.
- **Admin CRM:** Secure panel to manage leads, generate GST-compliant PDF invoices, and process quotations.
- **Firebase Integration:** Real-time data storage, secure authentication, and cloud file storage for PDFs and images.
