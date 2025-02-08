# **Graphia - A Modern Social Media Platform**  

### **Introduction**  
Graphia is a feature-rich and scalable social media platform that empowers users to connect, share, and communicate in real time. Built with modern technologies, the platform ensures a seamless and secure user experience. Users can post updates, manage their profiles, engage in private or group chats, and discover other users through advanced search features.  

The project follows a modular approach with separate frontend and backend directories, ensuring maintainability and ease of development.

---

## **Features**  

### **Social Media Features:**  
- **CRUD Operations:** Create, read, update, and delete posts.  
- **User Profile:** View user information, user posts, and follow/unfollow other users.  
- **Search Functionality:** Easily search for users based on their username.  

### **Authentication & Security:**  
- **Secure Authentication:** JWT-based authentication with secure cookies for user login, signup, and logout.  

### **Messaging & Group Management:**  
- **Private and Group Messaging:**  
  - Real-time chat with both private and group chat options.  
  - Support for text messages and file sharing.  
- **Group Management:**  
  - Create, join, search, and leave groups.  

### **Live Chat:**  
- **Real-time Communication:** Powered by WebSockets and Django Channels for instant communication.  

---

## **Tech Stack**  

### **Frontend:**  
- React.js  
- Tailwind CSS  
- Axios  

### **Backend:**  
- Django  
- Django REST Framework  
- Django Channels  
- WebSockets  
- Redis  
- PostgreSQL

### **Authentication:**  
- JWT Auth with secure cookies  

---

## **Project Structure**  
```
Graphia/
│
├── frontend/             # Contains all frontend code built with React.js
├── backend/              # Contains backend code built with Django
├── requirements.txt       # Backend dependencies  
└── README.md              # Project documentation
```

---

## **Installation & Setup Instructions**  

### **Frontend Setup:**  
1. Clone the repository and navigate to the frontend directory:
   ```bash
   git clone https://github.com/Mohitranag18/Graphia.git
   cd Graphia/frontend
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start the development server:  
   ```bash
   npm start
   ```  

### **Backend Setup:**  
1. Navigate to the backend directory:  
   ```bash
   cd ../backend
   ```
2. Install backend dependencies:  
   ```bash
   pip install -r requirements.txt
   ```
3. Run database migrations:  
   ```bash
   python manage.py migrate
   ```
4. Start the Django development server:  
   ```bash
   python manage.py runserver
   ```

---

## **Usage Instructions**  

### **Authentication:**  
1. Register a new account or log in using existing credentials.  
2. Use the secure JWT-based cookie authentication for all further operations.  

### **Creating Posts:**  
1. Navigate to the post creation page and submit your content.  
2. Edit or delete posts as needed from your user profile section.  

### **Live Chat:**  
1. Engage in private or group chats in real-time.  
2. Share files and text messages seamlessly.  

### **Group Management:**  
1. Create, search, join, or leave groups as per your requirement.

---

## **Contribution Guidelines**  

We welcome contributions from the community! Please follow these steps to contribute:  

1. **Fork the repository:**  
   Click the fork button on the top-right of the repo page.  

2. **Clone your fork:**  
   ```bash
   git clone https://github.com/your-username/Graphia.git
   cd Graphia
   ```

3. **Create a feature branch:**  
   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make your changes and commit:**  
   ```bash
   git commit -m "Add your message here"
   ```

5. **Push your changes:**  
   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Create a pull request:**  
   Submit your changes for review by opening a pull request on GitHub.  

---

## **Future Plans:**  
- **Audio and Video Calling:** Using WebRTC for real-time communication.  
- **Unique Social Features:** To enhance user engagement.  

---

## **License:**  
This project is licensed under the [MIT License](LICENSE).  

---

## **GitHub Repository:**  
[Graphia GitHub Repository](https://github.com/Mohitranag18/Graphia.git)  

---
