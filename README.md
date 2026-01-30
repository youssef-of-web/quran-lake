# Holy Quran

[Demo](https://quran-lake.vercel.app)

A modern, feature-rich web application for listening to the Holy Quran and tracking prayer times. Built with Next.js and TypeScript, it offers a seamless experience with internationalization support and a responsive design.

![Holy Quran](./public/hero-page.png)

## Features

- **Quran Recitation**: Access a wide range of reciters and listen to high-quality audio.
- **Prayer Times**: Get accurate prayer times based on your current location, including Adhan notifications.
- **Localization**: Fully localized interface supporting both English and Arabic languages.
- **Theme Customization**: Toggle between Light and Dark modes to suit your preference.
- **Progressive Web App (PWA)**: Install the application on your device for a native-like experience.
- **Search Functionality**: Quickly find specific reciters and Surahs.

## Technologies Used

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React, Heroicons
- **Containerization**: Docker

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your system:
- Node.js (v18 or later recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/youssef-of-web/quran-lake.git
   ```

2. Navigate to the project directory:
   ```bash
   cd quran-lake
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker Support

This project includes Docker support for easy containerization.

To run the application using Docker Compose:

```bash
docker compose up --build
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components and feature-specific components.
- `src/lib`: Utility functions and API configurations.
- `src/messages`: Localization files (English and Arabic).
- `src/hooks`: Custom React hooks.
- `public`: Static assets.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
