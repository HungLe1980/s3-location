# Location Service

This project is a RESTful API for managing location data, developed using Node.js with the NestJS framework and TypeScript. The API supports CRUD operations for locations.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contact](#contact)


## Features

- Create, Read, Update, and Delete (CRUD) operations for locations.
- Support for hierarchical location data (location tree).
- Data validation for incoming requests.
- Exception handling to manage errors effectively.
- Detailed logging for requests and responses.

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (or your preferred database)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/HungLe1980/s3-location
2. Install dependencies:

   ```bash
   npm install
3. Run the application:

   ```bash
   npm run start

## Usage

This project includes Swagger documentation to provide an interactive interface for exploring the API endpoints. Swagger allows you to test the API directly from your browser.

After starting the application, you can access the Swagger UI at the following URL: http://localhost:3000/api

## API Endpoints

| Method | Endpoint            | Description                              |
|--------|---------------------|------------------------------------------|
| GET    | /locations          | Retrieve all locations                   |
| GET    | /locations/{id}     | Retrieve a specific location by ID       |
| POST   | /locations          | Create a new location                    |
| PUT    | /locations/{id}     | Update an existing location by ID        |
| DELETE | /locations/{id}     | Delete a specific location by ID         |


## Contact
Hung Le - lechauhung80@gmail.com