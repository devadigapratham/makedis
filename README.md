# makedis: A Modern Deployment Framework

makedis is a feature-rich modern deployment framework designed to streamline application deployments, enhance static asset delivery, and enable scalable reverse proxy configurations. Built with robust and industry-standard technologies, Makedis offers a modular, efficient, and developer-friendly architecture that can be tailored to diverse use cases.

---

## **Why Makedis?**

Makedis stands out as a complete deployment and proxying solution, offering:  

1. **Seamless Deployment Workflow**  
   - Automatically handles code cloning, building, and deployment to Amazon S3, minimizing manual overhead.  

2. **Reverse Proxy for Static Assets**  
   - Efficiently maps subdomains and domains to static assets stored in S3, ensuring fast and reliable content delivery.  

3. **Scalability at its Core**  
   - Built using Docker and AWS, Makedis can handle dynamic traffic, large-scale projects, and complex application requirements.  

4. **Modular Design for Flexibility**  
   - Each service is designed as an independent module, making it easy to customize and extend functionality.  

5. **Developer-Friendly Setup**  
   - Clear setup instructions and minimal configuration requirements allow developers to focus on building rather than infrastructure.

---

## **Project Overview**

Makedis consists of the following services:  

### **1. API Server**  
The heart of the application, responsible for handling HTTP requests and orchestrating tasks like triggering builds and deployments.  

### **2. Build Server**  
A service dedicated to:  
- Cloning repositories.  
- Building Docker images.  
- Pushing static builds to Amazon S3 buckets.  

### **3. S3 Reverse Proxy**  
A reverse proxy service that:  
- Routes requests to appropriate S3 buckets.  
- Ensures seamless mapping of subdomains and domains to static assets.

---

## **How to Set Up Makedis Locally**

Follow these steps to get Makedis running locally:

### **1. Install Dependencies**  
In each service folder (`api-server`, `build-server`, `s3-reverse-proxy`), run:  
```bash
npm install
```

### **2. Build and Push Docker Image for Build Server**  
To build the `build-server` Docker image and push it to AWS ECR:  
```bash
docker build -t makedis-build-server .
docker tag makedis-build-server <aws-account-id>.dkr.ecr.<region>.amazonaws.com/makedis-build-server
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/makedis-build-server
```

### **3. Configure the API Server**  
Provide the necessary configuration details such as:  
- **TASK ARN**: The AWS task definition ARN.  
- **CLUSTER ARN**: The AWS ECS cluster ARN.  

### **4. Start Services**  
Run the following commands in their respective directories:  
```bash
# Start the API Server
cd api-server
node index.js

# Start the S3 Reverse Proxy
cd s3-reverse-proxy
node index.js
```

---

## **Service Overview**

| Service Name          | Description                                           | Port  |  
|-----------------------|-------------------------------------------------------|-------|  
| **API Server**        | Handles API requests and task orchestration.          | :9000 |  
| **Socket.IO Server**  | Facilitates real-time communications.                 | :9002 |  
| **S3 Reverse Proxy**  | Proxies requests to static assets stored in S3.       | :8000 |  

---

## **Features and Benefits**

### **1. Simplified Deployment**  
Makedis eliminates the need for complex pipelines, enabling rapid builds and deployments with minimal effort.  

### **2. Static Asset Delivery**  
With S3 as the backbone for static file hosting, Makedis ensures low-latency delivery and high availability for web assets.  

### **3. Real-Time Updates**  
The integrated Socket.IO server supports real-time communication, making it ideal for collaborative or dynamic applications.  

### **4. Built with Modern Tools**  
Makedis leverages Docker, AWS ECS, and Redis, ensuring reliability, scalability, and performance in production environments.  

### **5. Developer-Centric Design**  
The system is easy to configure and integrate with existing workflows, saving developers significant time and effort.  

---

## **Use Cases**

- **Web Application Hosting**  
  Makedis can deploy and serve single-page applications (SPAs), PWAs, and server-rendered applications with ease.  

- **Custom CI/CD Pipelines**  
  Use Makedis as a lightweight alternative to traditional CI/CD systems for streamlined workflows.  

- **Reverse Proxy for Multi-Tenant Systems**  
  Dynamically route subdomains and domains for SaaS applications and other multi-tenant setups.  

---

## **Future Enhancements**

- **Support for Additional Cloud Providers**  
  Extend support to platforms like Google Cloud Storage and Azure Blob Storage.  

- **Integrated Logging and Monitoring**  
  Add real-time logging and analytics dashboards for better debugging and performance monitoring.  

- **Multi-Region S3 Support**  
  Enable replication and distribution of static assets across multiple AWS regions for improved redundancy.  

---

## **Contributing to Makedis**

We’re excited to see how the community can improve Makedis! If you have ideas, issues, or enhancements:  

1. Fork this repository.  
2. Submit a pull request with your changes.  
3. Discuss your ideas in the issue tracker.  

Together, we can make Makedis a go-to deployment platform for developers worldwide.  

---

## **License**

Makedis is released under the MIT License, making it open and free to use for both personal and commercial projects.  

---

**Build, Deploy, Scale – All with Makedis 🚀**  