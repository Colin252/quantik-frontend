💼 Quantik Frontend – Cloud-Integrated Financial Web App

Quantik is a professional full-stack accounting and finance system designed for companies and professionals who require real-time financial control, client/supplier management, and secure cloud deployments.
This repository contains the React frontend, integrated with a Spring Boot + MySQL backend hosted on Google Cloud VM.

🌎 Deployment & Cloud Architecture
Environment	Platform	Description
Frontend – Production	Vercel
	Live production deployment with CI/CD from GitHub
Frontend – Preview Build	Vercel Preview
	Automatic preview deploy for each Git push
Backend – Cloud VM	Google Cloud Compute Instance
	Spring Boot 3 + MySQL 8 running on Ubuntu 22.04 (Server 8080)
Backend – Optional Service	Render (PaaS)	Secondary backend for HTTPS/CORS testing and redundancy

☁️ Architecture overview:

React frontend hosted on Vercel Production

Backend API deployed on Google Cloud VM

Continuous Integration & Delivery handled by GitHub Actions + Vercel Deploy

Optional HTTPS/CORS proxy testing via Render Service

⚙️ Tech Stack
Category	Technologies
Frontend Framework	React 18 (CRA)
Routing	React Router DOM v6
HTTP Client	Axios
UI & Reports	jspdf + jspdf-autotable + Recharts
Authentication	JWT token storage and validation
Build Tool	React Scripts / npm
CI/CD	GitHub Actions → Vercel Auto Deploy
Cloud Hosting	Google Cloud VM + Vercel + Render
Database (backend)	MySQL 8 running on Google Cloud
🧩 Main Features

✅ User authentication (login/register) via JWT integration

📊 Interactive dashboard with statistics and Recharts visualizations

💼 CRUD modules for clients, suppliers, products, and invoices

🧾 PDF invoice generation using jspdf-autotable

📈 Expense & income tracking with balance analytics

🌐 Responsive UI for desktop and mobile

🔐 Environment-based Axios configuration for secure API calls

🧪 CI/CD Pipeline

Each commit to the main branch triggers a GitHub Action workflow that:

Installs dependencies (npm ci)

Builds production bundle (npm run build)

Deploys automatically to Vercel Production

Runs build status checks before publish

This ensures Continuous Integration and Continuous Delivery through GitHub + Vercel.

💡 Development Experience

During the Quantik development, the following skills and technologies were implemented and tested:

🌍 Google Cloud VM setup: firewall rules, SSH access, Ubuntu server administration

🧰 Spring Boot integration: RESTful API connection between frontend and backend

⚙️ CORS & HTTPS testing: domain policies handled through Render proxy and Vercel

🔄 GitHub Actions for CI/CD: automated build and deploy pipelines

💾 MySQL database hosted on VM: used for persistent financial data

🧠 Future Scope & Goals

Quantik is designed to evolve into a fully integrated business accounting ecosystem.
Planned next phases include:

📉 Advanced financial analytics with Apache Spark integration

☁️ Microservices transition with Docker & Kubernetes on Google Cloud

🧾 Automated tax calculation modules

🧠 AI-based expense classification and forecasting

👤 Author

Helton Emerson Quiroz López
Full Stack Java + React Developer

📧 heltonquiroz@gmail.com

🌐 LinkedIn
Domains
https://quantik-frontend.vercel.app/

💻 Backend Repository
