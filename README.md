# StudyFlow

A comprehensive student productivity application built with React, TypeScript, and Firebase.

## Features

- **Authentication System**
  - Secure email/password authentication
  - Password strength validation
  - Comprehensive error handling

- **Study Logger**
  - Track study sessions with duration and productivity
  - View study statistics and analytics
  - Interactive and user-friendly interface

- **Grade Predictor**
  - Calculate potential grades
  - Track academic progress

- **Study Timer**
  - Set attainable study goals for yourself
  - 25 minute timer
  
- **GPA Calculator**
  - Calculate GPA with ease based on credits and grade

    
- **Assignment Calender**
  - Keep track of future assignments 
  - Set priority for due date
  

## Tech Stack

- React 18
- TypeScript
- Vite
- Firebase (Authentication & Firestore)
- Material-UI
- React Hook Form
- Yup Validation
- date-fns

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14 or higher)
- npm or yarn
- A Firebase project

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/studyflow.git
cd studyflow
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Start the development server:
```bash
npm run dev
```

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Enable Firestore Database
4. Copy your Firebase configuration to the `.env` file

## Deployment to Vercel

### Prerequisites
- Vercel Account
- Firebase Project (for environment variables)

### Deployment Steps
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy to Vercel:
```bash
vercel
```

### Environment Variables
Set the following environment variables in Vercel Dashboard:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## Vercel Deployment Configuration

### Project Setup
1. Go to [Vercel Dashboard](https://vercel.com/)
2. Import GitHub repository
3. Configure Project Settings:
   - **Root Directory**: `studyflow-react`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Environment Variables
Set the following variables in Vercel Dashboard:

#### Firebase Configuration
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

#### Environment Scopes
- Production: Always set
- Preview: Recommended
- Development: Optional

### Troubleshooting
- Ensure all environment variables are correctly set
- Check Vercel build logs for any configuration issues
- Verify Firebase project settings match environment variables

### ⚠️ Security Warning for Environment Variables

**IMPORTANT**: 
- Never commit sensitive keys directly to your repository
- Use environment variable management in your deployment platform
- Rotate your Firebase API keys periodically

### Vercel Environment Variable Setup
1. Go to your Vercel Project Settings
2. Navigate to "Environment Variables"
3. Add these variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### Best Practices
- Use different Firebase configurations for Development, Staging, and Production
- Enable Firebase Security Rules
- Monitor your Firebase project's usage and security

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (if configured)

## Project Structure

```
studyflow-react/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── StudyLogger/
│   │   └── GradePredictor/
│   ├── contexts/
│   ├── config/
│   ├── styles/
│   └── pages/
├── public/
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - osmith26@adrian.edu
Project Link: [https://github.com/carved4/studyflow](https://github.com/carved4/studyflow)

## Acknowledgments

- Material-UI for the component library
- Firebase for authentication and database
- React community for inspiration and support
