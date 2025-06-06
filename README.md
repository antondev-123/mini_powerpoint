# 🖥️ Mini PowerPoint (Frontend)

This is the frontend for **Mini PowerPoint**, a lightweight Markdown-based presentation app built with React.

## 🔗 Live Demo

- 🌐 App: [https://mini-powerpoint.netlify.app](https://mini-powerpoint.netlify.app)
- 📘 Storybook: [https://mini-powerpoint-storybook.netlify.app](https://mini-powerpoint-storybook.netlify.app)

## 🚀 Features

- Render Markdown content as slides
- Syntax-highlighted code blocks (via `react-markdown` + `react-syntax-highlighter`)
- Create, edit, delete slides
- Choose between slide layouts
- Keyboard navigation (← / →)
- Reusable components with Storybook support

## 🛠 Tech Stack

- React
- Axios
- React Markdown
- Storybook
- Netlify (for deployment)

## 📦 Setup

```bash
npm install
npm start
```

## 🧪 Storybook

```bash
npm run storybook
```

## 📦 Build for Production

```bash
npm run build
```
## ⚙️ API Configuration

```bash
const API_URL = "https://mini-powerpoint-backend.onrender.com";
```

## 📁 Project Structure

```bash
src/
├── components/
│   ├── SlideView/
│   ├── SlideEditor/
│   ├── SlideControls/
│   └── ProgressBar/
├── App.js
└── index.js
```