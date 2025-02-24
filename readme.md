# Image Processor


## Overview

**Image Processor** is a scalable and efficient image processing pipeline built using **Node.js**, **Express**, **MongoDB**, **BullMQ**, and **Redis**. It supports bulk image processing, webhook notifications, and CSV report generation.

## Live Deployment

🔗 **API Base URL:** [https://your-deployment-link.com](https://your-deployment-link.com)

## Features

- Upload and process images asynchronously.
- Generate and store CSV reports for processed images.
- Webhook support for real-time notifications.
- Scalable architecture with Redis-based job queue (BullMQ).
- API endpoints with Postman collection.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Queue:** BullMQ, Redis
- **Database:** MongoDB
- **File Storage:** Local file system (can be extended to S3, ImgBB, etc.)
- **API Testing:** Postman

## Installation

### 1.Clone the Repository

```sh
 git clone https://github.com/harishgoudakkala/image-processor.git
 cd image-processor
```

### 2. Install Dependencies

```sh
 npm install
```

### 3️. Configure Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
MONGO_URI=mongodb://localhost:27017/image-processor
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=yourpassword
PORT=5000
```

### 4️⃣ Start the Application

```sh
 npm run dev
```