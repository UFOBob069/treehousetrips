# Firebase Setup for Treehouse Trips

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `treehouse-stays` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Optionally enable "Google" provider for social login

## 3. Create Firestore Database

1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location (choose closest to your users)
4. Click "Done"

## 4. Configure Security Rules

Replace the default Firestore rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Properties collection
    match /properties/{propertyId} {
      allow read: if true; // Anyone can read published properties
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.ownerId || 
         request.auth.uid == request.resource.data.ownerId);
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.guestId || 
         request.auth.uid == resource.data.hostId);
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 5. Get Firebase Configuration

1. Go to Project Settings (gear icon) → "General" tab
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Enter app nickname: `treehouse-stays-web`
5. Copy the Firebase config object

## 6. Update Environment Variables

Update your `.env.local` file with the Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 7. Enable Storage (Optional)

If you want to store images in Firebase Storage:

1. Go to "Storage" → "Get started"
2. Choose "Start in test mode"
3. Select a location
4. Update storage rules if needed

## 8. Test the Setup

1. Start your development server: `npm run dev`
2. Try creating an account on `/create` page
3. Check Firebase Console → Authentication to see the user
4. Check Firestore Database to see the user document

## 9. Production Considerations

### Security Rules for Production

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Properties - only published ones are public
    match /properties/{propertyId} {
      allow read: if resource.data.isPublished == true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.ownerId;
    }
    
    // Users - only own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bookings - only participants can access
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.guestId || 
         request.auth.uid == resource.data.hostId);
    }
  }
}
```

### Environment Variables for Production

```env
# Production Firebase (use production project)
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id
```

## 10. Database Structure

### Collections Overview

```
firestore/
├── properties/
│   ├── {propertyId}/
│   │   ├── title: string
│   │   ├── description: string
│   │   ├── location: string
│   │   ├── price: number
│   │   ├── images: string[]
│   │   ├── isPublished: boolean
│   │   ├── ownerId: string
│   │   └── createdAt: timestamp
├── users/
│   ├── {userId}/
│   │   ├── email: string
│   │   ├── displayName: string
│   │   ├── isHost: boolean
│   │   └── createdAt: timestamp
├── bookings/
│   └── {bookingId}/
└── payments/
    └── {paymentId}/
```

## 11. Authentication Flow

1. User signs up → Firebase Auth creates user
2. User document created in Firestore `/users/{userId}`
3. User can create properties → stored in `/properties`
4. Properties can be published (isPublished: true)
5. Published properties appear on public listings

## 12. Next Steps

- Set up Stripe for payments
- Configure email notifications
- Add image upload to Firebase Storage
- Set up monitoring and analytics
- Configure backup and security

