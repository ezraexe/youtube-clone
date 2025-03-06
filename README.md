
# YouTube Clone

A full-stack video sharing platform built with modern web technologies.

## Technologies Used

### Frontend
- **Next.js 14**
  - React framework for production
  - Server-side rendering
  - File-based routing
  - `/app` directory structure

- **TypeScript**
  - Static type checking
  - Enhanced code reliability
  - Type definitions for data models

### Authentication & Backend
- **Firebase**
  - User authentication with Google Sign-In
  - Cloud Functions for serverless operations
  - Security Rules for data protection

- **Firestore**
  - NoSQL database for scalable storage
  - Video metadata management
  - User data persistence
  - Collections: 'videos', 'users'

### Cloud Infrastructure (Google Cloud)
- **Cloud Storage**
  - Raw videos bucket for uploads
  - Processed videos bucket for transcoded content
  - Signed URLs for secure file handling

- **Cloud Run**
  - Containerized video processing service
  - Automatic scaling
  - Managed infrastructure

- **Pub/Sub**
  - Asynchronous message handling
  - Video processing event triggers

### Video Processing
- **FFmpeg**
  - Video transcoding capabilities
  - Resolution standardization
  - Format conversion

### Testing
- **Playwright**
  - End-to-end testing
  - Navigation flow verification
  - UI interaction testing

### Development Tools
- **Docker**
  - Application containerization
  - Cross-platform compatibility
- **npm/Node.js**
  - Package management
  - JavaScript runtime environment

## Project Runthrough 

### Landing Page
![Website Screenshot](https://drive.google.com/uc?export=view&id=1RTzKVZR3TVeYVeda3HxI3kUKiilwkbwf)
When loading up the website, users are introduced with all videos added. Videos are able to be viewed whether the user is logged in or not logged in.

### Signed In Page
![Website Screenshot](https://drive.google.com/uc?export=view&id=1yAjI7ZtlQ87RPE_CikuaMtKb7JEew_y7)
This is what the user sees when logging into the website. When the user pressed Sign In, the user is redirected to log in with Google. Log in information of the user is stored in Firebase authentication and a Firestore collection named "users". Videos are able to be uploaded by the user when logged in. 

### Bucket Transfer
![Website Screenshot](https://drive.google.com/uc?export=view&id=16kwpGFshX1frsEIcVmmBBJfvWqNCMI8D)
When videos are uploaded by the users, the video is stored onto Google Cloud in a raw bucket. The user is then notified on the website that the upload was successful. After being uploaded to the raw bucket, the video begins to process in 360p. After done processing the video is placed in a new bucket on Firestore as seen below. 

![Website Screenshot](https://drive.google.com/uc?export=view&id=1alaG8-1dkN4zIQtwgCiCHvfVc1z1r75m)


### Firestore
![Website Screenshot](https://drive.google.com/uc?export=view&id=1XKrEodfuMdBHL3j8Wr_s0ZpLv3k7bJzN)
After the video is processed and stored into the processed bucket, the video information is stored into Firestore and is ready to be displayed on the webclient.

### Watch Page
![Website Screenshot](https://drive.google.com/uc?export=view&id=1PF_omsrfK_T9CMdU7OwOmcOqR5R7rMIw)
The video is now rendered and ready to view on the website. 
