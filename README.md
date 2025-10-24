# LSE Study Hub

A comprehensive study platform designed for LSE Economics students to manage lecture slides, annotate PDFs, take notes, and interact with an AI study assistant.

## Features

### 📚 Module Management
- Create and organize modules by course
- Upload lecture slides (PDFs) with cloud storage
- Drag-and-drop file uploads
- View all slides organized by module

### 📝 Deep Focus Mode
- **PDF Viewer (2/3 screen)**: 
  - View lecture slides with zoom and navigation
  - Highlight tool with text detection
  - Pen tool for drawing annotations
  - Persistent annotations saved to cloud
  - Drag-and-drop to import PDFs

- **Study Sidebar (1/3 screen)**:
  - **Questions & Notes**: Block-based note-taking system for quick capture of questions or concepts
  - **AI Study Assistant**: Chat with GPT connected to your PDF content using RAG (Retrieval-Augmented Generation)
  - Customizable system prompt for AI behavior

### 🤖 AI Features
- Context-aware chatbot that reads your lecture materials
- Answers questions based on PDF content
- Customizable AI personality/instructions

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Express, tRPC
- **Database**: MySQL with Drizzle ORM
- **Storage**: Manus Cloud Storage
- **AI**: Manus Forge API (OpenAI-compatible)
- **UI**: Tailwind CSS, Radix UI, shadcn/ui
- **PDF**: react-pdf, pdf-parse

## Prerequisites

- Node.js 18+ and pnpm
- MySQL database
- Manus Platform account (for authentication and API access)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/lse-study-hub.git
cd lse-study-hub
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# App Configuration
VITE_APP_ID=your-manus-app-id

# JWT Secret (generate a random string)
JWT_SECRET=your-random-jwt-secret-here

# Database (MySQL)
DATABASE_URL=mysql://user:password@host:port/database

# OAuth (Manus Platform)
OAUTH_SERVER_URL=https://auth.manus.im
OWNER_OPEN_ID=your-owner-open-id

# Manus Forge API
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key

NODE_ENV=development
```

### 4. Database Setup

Run database migrations:

```bash
pnpm db:push
```

### 5. Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5000`

## Deployment

### Vercel Deployment

1. **Prepare for Deployment**:
   - Ensure all environment variables are set
   - Commit all changes to Git
   - Push to GitHub

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard

3. **Build Settings**:
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

4. **Environment Variables** (add these in Vercel):
   - `VITE_APP_ID`
   - `JWT_SECRET`
   - `DATABASE_URL`
   - `OAUTH_SERVER_URL`
   - `OWNER_OPEN_ID`
   - `BUILT_IN_FORGE_API_URL`
   - `BUILT_IN_FORGE_API_KEY`
   - `NODE_ENV=production`

### Database Recommendations

For production, use a managed MySQL service:
- **PlanetScale**: Serverless MySQL, generous free tier
- **AWS RDS**: Reliable and scalable
- **Railway**: Simple deployment with MySQL
- **DigitalOcean**: Managed databases

## Project Structure

```
lse-study-hub/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and tRPC client
├── server/                # Backend Express + tRPC server
│   ├── _core/            # Core server utilities
│   ├── db.ts             # Database operations
│   ├── routers.ts        # tRPC API routes
│   └── storage.ts        # Cloud storage integration
├── drizzle/              # Database schema and migrations
├── shared/               # Shared types and constants
└── package.json
```

## Usage Guide

### Creating Your First Module

1. Log in to the application
2. Click "My Modules" from the home page
3. Click "New Module"
4. Enter module details (name, code, description)
5. Click "Create Module"

### Uploading Lecture Slides

**Method 1: Through Module Card**
1. Find your module card
2. Click "Upload Slide"
3. Select a PDF file
4. Enter a title for the slide
5. Click "Upload"

**Method 2: Drag and Drop**
1. Drag a PDF file over any module card
2. Drop the file
3. Confirm the title and upload

### Using Deep Focus Mode

1. Click on any slide to enter Deep Focus mode
2. **PDF Viewer** (left side):
   - Use zoom buttons (+/-) to adjust view
   - Navigate pages with Previous/Next
   - Click "Highlighter" to enable text highlighting
   - Click "Pen" to enable freehand drawing
   - All annotations are automatically saved

3. **Questions Section** (top right):
   - Type your question or note
   - Press Enter to save
   - Hover to delete any question

4. **AI Assistant** (bottom right):
   - Ask questions about the lecture material
   - The AI has context from your PDF
   - Click settings to customize the AI's behavior

## API Reference

### Modules API

- `modules.list`: Get all user modules
- `modules.create`: Create a new module
- `modules.delete`: Delete a module

### Slides API

- `slides.listByModule`: Get slides for a module
- `slides.getById`: Get slide details
- `slides.upload`: Upload a new slide
- `slides.delete`: Delete a slide

### Annotations API

- `annotations.list`: Get annotations for a slide
- `annotations.create`: Create new annotation
- `annotations.delete`: Delete annotation

### Questions API

- `questions.list`: Get questions for a slide
- `questions.create`: Create new question
- `questions.delete`: Delete question

### Chat API

- `chat.getOrCreateSession`: Get or create chat session
- `chat.getMessages`: Get chat messages
- `chat.sendMessage`: Send message to AI
- `chat.updateSystemPrompt`: Update AI instructions

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Run production server
- `pnpm check` - Type check
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run tests
- `pnpm db:push` - Run database migrations

### Adding New Features

1. **Frontend**: Add components in `client/src/components/`
2. **Backend**: Add routes in `server/routers.ts`
3. **Database**: Update schema in `drizzle/schema.ts`
4. **Types**: Share types in `shared/types.ts`

## Troubleshooting

### PDF Not Loading
- Check browser console for errors
- Verify PDF file is not corrupted
- Ensure storage credentials are correct

### AI Not Responding
- Verify `BUILT_IN_FORGE_API_KEY` is set
- Check API key permissions
- Review server logs for errors

### Annotations Not Saving
- Check database connection
- Verify user authentication
- Check browser console for errors

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database server is running
- Ensure network connectivity

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

MIT License - feel free to use this for your studies!

## Author

Created by an LSE Economics student for better study management.

## Acknowledgments

- Built with Manus Platform
- UI components from shadcn/ui
- PDF rendering by Mozilla's PDF.js
- Icons by Lucide

---

**Happy Studying! 📚✨**

