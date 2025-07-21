# Complaint Management System 📋

A full-stack MERN application designed to streamline the entire lifecycle of complaint resolution within an organization or educational institution. This system provides a centralized, transparent, and efficient platform for users, staff, and administrators.

---

## ✨ Key Features

-   **Multi-Level Role System (User, Staff, Admin):**
    -   **Users:** Can submit complaints, upload images, track status, and view a complete history and audit trail of their submissions.
    -   **Staff:** Can view and manage complaints specifically assigned to them, submit resolution notes, and mark issues as 'Resolved'.
    -   **Admins:** Have full oversight. They can view all complaints, manage departments, assign complaints to staff, and give final approval to close resolved issues.

-   **Advanced Complaint Workflow:**
    -   **Submission & Assignment:** Users submit complaints to a specific department. Admins can then assign the complaint to a relevant staff member.
    -   **Two-Step Resolution:** Staff members resolve the issue and submit it for review. Admins have the final authority to approve the resolution and close the complaint.
    -   **Status Tracking:** Complaints move through a clear lifecycle: `Pending` → `In Progress` → `Resolved` → `Closed`.

-   **Comprehensive Dashboards:**
    -   **User Dashboard:** Features statistical widgets (total, pending, closed), a doughnut chart visualizing complaint statuses, a submission form, and a detailed history list.
    -   **Staff Dashboard:** A dedicated view showing only the complaints assigned to the logged-in staff member.
    -   **Admin Dashboard:** An all-in-one control panel with analytics (complaints per department), full-text search, status filtering, and complete management capabilities.

-   **Accountability & Transparency:**
    -   **Activity Log (Audit Trail):** Every significant action (creation, status change, assignment) is time-stamped and logged for each complaint, visible to both users and admins.
    -   **Automated Email Notifications:** Users are automatically notified via email upon complaint submission and on every status update, ensuring they are always kept in the loop.

-   **Rich Content & Management:**
    -   **Image Uploads:** Users can upload an image with their complaint to provide clear visual context.
    -   **Department Management:** Admins have a dedicated interface to create and manage the various departments within the system.

---

## 💻 Tech Stack

| Layer       | Technology/Library     | Purpose                                       |
|-------------|------------------------|-----------------------------------------------|
| **Frontend**| React                  | Building the user interface                   |
|             | React-Bootstrap        | Responsive UI components                      |
|             | React Router           | Client-side routing                           |
|             | Axios                  | Making HTTP requests to the backend           |
|             | Chart.js               | Data visualization for dashboards             |
| **Backend** | Node.js                | JavaScript runtime environment                |
|             | Express.js             | Web application framework for the API         |
|             | Mongoose               | Object Data Modeling for MongoDB              |
|             | Express Session        | Session-based authentication                  |
|             | Nodemailer             | Sending automated email notifications         |
|             | Multer                 | Handling file uploads                         |
|             | Concurrently           | Running backend and frontend with one command |
| **Database**| MongoDB                | NoSQL database to store application data      |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### **Prerequisites**

-   Node.js (v18.x or higher)
-   npm (v9.x or higher)
-   MongoDB (running locally or a cloud instance like MongoDB Atlas)

### **Installation & Setup**

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Backend Setup:**
    ```sh
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install

    # Create a .env file in the /server directory and add the following:
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    SESSION_SECRET=your_super_secret_key

    # (Optional) For email functionality
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_app_password
    ```

3.  **Frontend Setup:**
    ```sh
    # From the root directory, navigate to the client folder
    cd ../client

    # Install dependencies
    npm install
    ```

4.  **Run the Application:**
    ```sh
    # From the root project directory
    npm install concurrently -D # If not already installed
    npm run dev
    ```
    This single command will start both the backend server (on port 5000) and the frontend React app (on port 3000).

---

### **Admin and Staff Setup**

By default, all registered users have the `user` role. To create an admin or staff member:

1.  Register a new user through the application's UI.
2.  Connect to your MongoDB database.
3.  Navigate to the `users` collection.
4.  Find the user you just created and edit their document.
5.  Change the `role` field from `"user"` to either `"admin"` or `"staff"`.
6.  Log in with this user's credentials to access the appropriate dashboard.
