# PhotoStory

PhotoStory is a browser-based app that lets you upload a photo and receive a detailed description using OpenAI's GPT-4o Vision model. All processing happens in your browser—no backend required!

## Features

- 📸 Upload any photo (JPG, PNG, etc.)
- 🤖 Get a detailed description using OpenAI's GPT-4o Vision
- 🔑 Enter your own OpenAI API key (not stored or sent anywhere except OpenAI)
- 💻 100% client-side, privacy-friendly
- 🖌️ Modern, clean UI built with React, Vite, and Tailwind CSS

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/photostory.git
cd photostory
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

This will create a `dist` folder with the production-ready build of your application.

### 5. Preview the production build
```bash
npm run preview
```

This will serve the production build locally for testing before deployment.

## Usage
1. Enter your OpenAI API key (you can get one at https://platform.openai.com/api-keys)
2. Upload a photo
3. Click **Generate Story**
4. View the AI-generated story below

> **Note:** Your API key is only used in your browser to call OpenAI's API. It is never stored or sent anywhere else.

## Tech Stack
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI GPT-4o Vision API](https://platform.openai.com/docs/guides/vision)

## License
MIT
