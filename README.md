# AI Tour Writer - Booking Engine

An intelligent travel booking platform powered by AI that creates personalized trip itineraries and provides comprehensive travel management capabilities.

## 🌟 Features

### User Experience
- **AI-Powered Trip Creation**: Generate custom travel itineraries using Google's Gemini AI
- **Personalized Recommendations**: Tailored suggestions based on travel style, interests, and budget
- **Interactive Dashboard**: Real-time analytics and trip management
- **User Authentication**: Secure login and user management via Appwrite
- **Responsive Design**: Beautiful, modern UI that works on all devices

### Admin Features
- **Comprehensive Dashboard**: View user statistics, trip analytics, and growth trends
- **User Management**: Monitor and manage user accounts and activities
- **Trip Analytics**: Visualize trip trends by travel style, destinations, and time periods
- **Data Tables**: Interactive tables for users and trips with advanced filtering

### Technical Features
- **Real-time Data**: Live updates using Appwrite backend
- **Advanced Charts**: Data visualization with Syncfusion components
- **Image Integration**: Automatic trip images from Unsplash
- **Error Handling**: Robust error management and user feedback
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Custom Components
- **Backend**: Appwrite (Database, Authentication, Storage)
- **AI Integration**: Google Gemini AI
- **Charts & Data**: Syncfusion Components
- **Image Service**: Unsplash API
- **Monitoring**: Sentry for error tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Appwrite account and project
- Google Gemini API key
- Unsplash API key (optional, for trip images)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd booking-engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=your_user_collection_id
   NEXT_PUBLIC_APPWRITE_TRIPS_COLLECTION_ID=your_trips_collection_id

   # AI Configuration
   GEMINI_API_KEY=your_gemini_api_key

   # Image Service (Optional)
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key

   # Sentry (Optional)
   SENTRY_DSN=your_sentry_dsn
   ```

4. **Set up Appwrite Collections**
   Create the following collections in your Appwrite database:
   - **Users Collection**: Store user profiles and metadata
   - **Trips Collection**: Store trip details and itineraries

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Application Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin dashboard routes
│   ├── api/               # API routes
│   └── sign-in/           # Authentication pages
├── components/            # Reusable UI components
├── appwrite/             # Appwrite service functions
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── providers/            # Context providers
├── constants/            # Application constants
└── styles/               # Global styles
```

## 🔑 Key Components

### Trip Creation Flow
1. User provides trip preferences (destination, style, interests, budget)
2. AI generates personalized itinerary using Gemini
3. System fetches relevant images from Unsplash
4. Trip is saved to Appwrite database
5. User is redirected to the new trip page

### Admin Dashboard
- **Statistics Cards**: Total users, trips, and active users with growth trends
- **Interactive Charts**: User growth and trip analytics visualization
- **Data Tables**: Latest users and recent trips with detailed information
- **Real-time Updates**: Live data from Appwrite backend

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on each push

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check the [Issues](../../issues) page
- Review the Appwrite and Next.js documentation
- Ensure all environment variables are correctly configured

---

Built with ❤️ using Next.js, Appwrite, and AI technology
