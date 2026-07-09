# ☁️ Cloud Notes Application

A production-ready full-stack Notes Application built using **React.js**, **Node.js**, **MongoDB**, **Docker**, **Docker Compose**, **GitHub Actions**, **Nginx**, and **AWS EC2**.

The project demonstrates modern DevOps practices including containerization, CI/CD automation, cloud deployment, reverse proxy configuration, HTTPS security, and Linux server administration.

---

## 🚀 Features

- Create Notes
- Update Notes
- Delete Notes
- Responsive User Interface
- RESTful API
- MongoDB Database Integration
- Dockerized Application
- Multi-Container Deployment using Docker Compose
- Automated CI/CD Pipeline
- AWS EC2 Cloud Deployment
- Nginx Reverse Proxy
- HTTPS with Let's Encrypt SSL

---

# 🛠 Tech Stack

## Frontend

- React.js
- Axios
- CSS

## Backend

- Node.js
- Express.js

## Database

- MongoDB

## DevOps & Cloud

- Docker
- Docker Compose
- GitHub Actions
- AWS EC2
- Linux
- Nginx
- Let's Encrypt SSL
- SSH

---

# 📂 Project Structure

```
Cloud-Notes-App/
│
├── frontend/
├── backend/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 🏗 Architecture

```
             User
               │
               ▼
        Nginx Reverse Proxy
               │
      ┌────────┴────────┐
      ▼                 ▼
React Frontend     Node.js Backend
                         │
                         ▼
                     MongoDB
```

---

# ⚙️ Getting Started

## Clone Repository

```bash
git clone https://github.com/Kaushall12/Cloud-Notes-App.git
```

```bash
cd Cloud-Notes-App
```

---

## Start the Application

```bash
docker-compose up --build
```

---

## Stop the Application

```bash
docker-compose down
```

---

## Check Running Containers

```bash
docker ps
```

---

## View Container Logs

```bash
docker logs <container_name>
```

---

# ☁️ Deployment

The application is deployed on an AWS EC2 Linux server using Docker and Docker Compose.

Deployment workflow:

1. Push code to GitHub
2. GitHub Actions automatically starts
3. Connects securely to AWS EC2
4. Pulls the latest code
5. Stops existing containers
6. Builds updated Docker images
7. Starts new containers
8. Application is deployed automatically

No manual deployment is required.

---

# 🔄 CI/CD Pipeline

GitHub Actions automates the deployment process by:

- Checking out the latest source code
- Connecting to AWS EC2 using SSH
- Pulling the latest repository
- Building Docker containers
- Restarting services
- Deploying the latest version automatically

---

# 🔐 Security

- HTTPS using Let's Encrypt SSL
- Reverse Proxy with Nginx
- Secure SSH-based deployment
- Environment Variables for configuration
- Isolated Docker network

---

# 📚 What I Learned

This project helped me gain practical experience with:

- Docker & Docker Compose
- GitHub Actions CI/CD
- AWS EC2 Deployment
- Linux Server Administration
- Nginx Reverse Proxy
- SSL Certificate Configuration
- Production Deployment
- Docker Networking
- Application Troubleshooting

---

# 🚀 Future Enhancements

- User Authentication
- JWT Authorization
- Search Notes
- Categories & Tags
- Dark Mode
- File Upload Support
- Redis Caching
- Kubernetes Deployment
- Monitoring with Prometheus & Grafana

---

# 🧰 Technologies Used

| Category | Technologies |
|----------|--------------|
| Frontend | React.js, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| DevOps | Docker, Docker Compose, GitHub Actions |
| Cloud | AWS EC2 |
| Server | Ubuntu Linux |
| Web Server | Nginx |
| Security | Let's Encrypt SSL |

---

# 👨‍💻 Author

**Kaushal Patel**

📧 Email: kaushalpatel1284@gmail.com

🐙 GitHub: https://github.com/Kaushall12

💼 LinkedIn: https://www.linkedin.com/in/kaushal-patel

---

## ⭐ If you found this project helpful, consider giving it a star.

---

## 📄 License

This project is licensed under the MIT License.
