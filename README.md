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

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/studyflow](https://github.com/yourusername/studyflow)

## Acknowledgments

- Material-UI for the component library
- Firebase for authentication and database
- React community for inspiration and support
