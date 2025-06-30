# Career Guidance Guild

A magical career guidance platform that helps users discover their professional path through an engaging, interactive experience.

## Features

- 🌟 Magical Quest flow with animated UI elements
- 🌍 Multilingual support (Ukrainian, English, Hindi)
- 📱 Fully responsive design
- 🔮 Interactive survey with progress tracking
- 🤖 ChatGPT integration for personalized recommendations
- 🔥 Firebase integration for session management
- 🎨 Beautiful, modern UI with magical theme

## Tech Stack

- Next.js 14
- TypeScript
- TailwindCSS
- Framer Motion
- Firebase (Auth + Firestore)
- i18next
- OpenAI API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── components/        # Reusable components
│   ├── magical-quest/     # Magical Quest flow
│   └── ...
├── config/                # Configuration files
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── locales/              # Translation files
└── types/                # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
