# ResumeCraft.ai - AI-Powered Resume Optimization Platform

ResumeCraft.ai is an intelligent resume optimization platform that helps job seekers create ATS-friendly resumes tailored to specific job descriptions. Our AI-powered system analyzes job requirements and enhances your resume to increase your chances of landing interviews.

## Features

- 🤖 AI-powered resume optimization
- 📝 ATS-friendly resume generation
- 🎯 Job-specific tailoring
- 📊 Keyword optimization
- 📱 Professional PDF exports
- 🔄 Multiple resume versions
- 💼 Cover letter generation (Pro plan)
- 🔍 LinkedIn profile optimization (Enterprise plan)

## Tech Stack

- ⚡️ Vite
- 🔷 TypeScript
- ⚛️ React
- 🎨 shadcn-ui
- 🎯 Tailwind CSS
- 🔐 Supabase
- 🤖 OpenAI GPT-4

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone https://github.com/your-username/resumecraft-ai.git

# Navigate to the project directory
cd resumecraft-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React context providers
├── integrations/  # Third-party integrations
├── lib/          # Utility functions
└── types/        # TypeScript type definitions
```

## Deployment

The application can be deployed to any static hosting service that supports Node.js applications, such as:

- Vercel
- Netlify
- GitHub Pages
- AWS Amplify

### Production Build

```sh
npm run build
```

The build output will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@resumecraft.ai or join our Slack channel.
# resumecraftai
