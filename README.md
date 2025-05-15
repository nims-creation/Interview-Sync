# Smart Interview Scheduling Platform

## Project Overview
The **Smart Interview Scheduling Platform** is a full-stack web application designed to simplify and automate interview scheduling for companies, recruiters, and candidates. It eliminates scheduling conflicts, manual communication, and missed reminders by integrating Google Calendar, video conferencing tools, and notification services.

## Features
- **Google OAuth** authentication for secure login
- **Google Calendar Integration** for seamless schedule management
- Automatic video interview link generation using **Zoom** or **Jitsi**
- Conflict-free time slot suggestions
- Email and SMS notifications with interview reminders
- Rescheduling and real-time updates through a centralized dashboard
- Modern UI styled with **Tailwind CSS** and **ShadCN/UI**

## Technologies Used
- Frontend: React.js, Tailwind CSS, ShadCN/UI
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: Google OAuth
- Video Conferencing: Zoom, Jitsi
- Notifications: Email & SMS services

## Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/roshan0202/Interview-Dashboard.git
Navigate into the project directory:

bash
Copy
Edit
cd Interview-Dashboard
Install dependencies for both frontend and backend:

bash
Copy
Edit
npm install
Setup environment variables (create .env file):

Database credentials

Google OAuth client ID and secret

Zoom/Jitsi API keys

Email and SMS service credentials

Run the development server:

bash
Copy
Edit
npm run dev
Usage
Access the platform via http://localhost:3000 and start scheduling interviews efficiently.

Contributing
Contributions are welcome! Please open an issue or submit a pull request for improvements and bug fixes.

License
This project is licensed under the MIT License.
