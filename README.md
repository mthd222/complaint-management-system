# Complaint Management System 📋

A full-stack web application built with the MERN stack that allows users to submit complaints and enables administrators to manage them effectively.

---

## Features

-   **User Authentication**: Secure user registration and login system with session management.
-   **Role-Based Access Control**: Differentiates between regular **Users** and **Admins**.
-   **Complaint Submission**: Logged-in users can submit complaints through a clean, easy-to-use form.
-   **User Dashboard**: Users can view a history of their own submitted complaints and track their status.
-   **Admin Dashboard**: Admins have access to a dashboard to view all user complaints. They can filter complaints by status (Pending, In Progress, Closed).
-   **Status Management**: Admins can update the status of any complaint.
-   **Email Notifications**: Users automatically receive email confirmations when they submit a complaint and when an admin updates its status.

---

## 💻 Tech Stack

-   **Frontend**: React, React-Bootstrap, React Router
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose
-   **Authentication**: Express Session
-   **Email**: Nodemailer

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### **Prerequisites**

-   Node.js (v14 or higher)
-   npm
-   MongoDB (either running locally or a cloud instance like MongoDB Atlas)

### **Installation & Setup**

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/complaint-management-system.git](https://github.com/your-username/complaint-management-system.git)
    cd complaint-management-system
    ```

2.  **Backend Setup:**
    ```sh
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install

    # Create a .env file in the /server directory and add the following variables
    # (use .env.example as a template if provided)
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    SESSION_SECRET=a_very_strong_secret_key

    # For email functionality
    EMAIL_USER=your_test_email@example.com
    EMAIL_PASS=your_email_password_or_app_password

    # Start the backend server
    npm start
    ```

3.  **Frontend Setup:**
    ```sh
    # Open a new terminal and navigate to the client directory
    cd client

    # Install dependencies
    npm install

    # Start the frontend React app
    npm start
    ```
The application will be available at `http://localhost:3000`.

---

### **Creating an Admin User**

By default, all registered users have the `user` role. To create an admin:

1.  Register a new user through the application's UI.
2.  Connect to your MongoDB database using a tool like MongoDB Compass or the shell.
3.  Navigate to the `complaint_system` database and open the `users` collection.
4.  Find the user you just created and edit their document.
5.  Change the `role` field from `"user"` to `"admin"`.
6.  Log in with this user's credentials to access the admin dashboard.
