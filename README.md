# Node JS Ecommerce Webservice 


## Table of Contents
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Live Server](#live-server)


## Introduction
This is a Node.js E-commerce application that provides a web service for managing an online store. It includes features such as user authentication, product management, order processing, and more.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (running locally or a MongoDB Atlas account)

## Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/ecommerce-app.git
   cd ecommerce-app
   ```

2. **Install dependencies:**

```sh
    npm install
```

## Configuration

Create a config.env file in the root directory and add the following environment variables:

```
# Server
PORT=
NODE_ENV=
BASE_URL=

# Database
DB_PASSWORD=
DB_USER=
DB_NAME=
DB_URI=

# JWT token
JWT_SECRET=
JWT_EXPIRES_IN=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=

# Stripe payment gateway settings
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

```
## Running the Application

In the package.json you will find the start scripts for development
```
 "scripts": {
    "start:dev": "nodemon index.js",
    "start": "NODE_ENV=production node index.js"
  }

```
Run this command in the terminal:

```
npm run start:dev

```

## API Endpoints

Here's the published APIs Collection on postman:

https://documenter.getpostman.com/view/29107157/2sAXqy3zBa


## Live Server

Server is hosted and deployed on Vercel

Live Server's Link: https://node-js-e-commerce-app.vercel.app/

You can add a production environemnt in your postman collection and test it with the base_url of https://node-js-e-commerce-app.vercel.app/ 


### How to deploy and run on vercel:

1. **Make an account on vercel.com**

2. **In your terminal run the command:**

```sh
    vercel deploy
```
Follow the instructions of Vercel CLI deployemnt 

3. **Go to your projects on Vercel**

You can connect the project's source code on github to your project
Any changes on the main branch on github will trigger a build on vercel's server

After making a change and pushing changes to main, you need to run this in your terminal:

```sh
    vercel --prod
```

