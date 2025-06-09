# 🖥 Meeting Room Management (Backend)

**_Meeting Room Management System_** is a web-based application designed to facilitate the process of managing and booking meeting rooms in an organization.

## Features

- 📅 **Room Booking** : Users can make room reservations based on available dates and times in real-time.
- 📂 **Room Data Management** : Admin can add, edit, and delete room data, including capacity, facilities, and room location.
- 📝 **Auto Booking** : The system provides an automatic booking feature based on routine schedules or specific needs, reducing schedule conflicts and increasing efficiency.
- 📊 **Room Usage Report** : A report feature is available that displays room usage history, usage statistics based on time, users, and rooms, for monitoring and evaluation needs.
- 🕔 **Auto Cancel** : This feature can cancel user bookings if there is no attendance verification for 15 minutes after the booking start time.

## Project Structure

This is the structure folder of the projects

```bash
backend-booking
┣ src
┃  ┣ config               # for configuration
┃  ┣ controller           # controller handler
┃  ┣ middleware           # middleware handler
┃  ┣ model                # for query bussiness logic
┃  ┣ routes               # routing express
┃  ┣ service              # for adding services function
┃  ┣ utils                # for utility function
┗  ┗ app.js              # main script for run project
```

## Getting Started

### Clone Repository

```bash
git clone https://github.com/freakymind12/backend-booking.git
cd backend-booking
```

### Install dependencies

```bash
npm install
```

### Setup MySQL Database

Execute the `init.sql` file in your MySQL database to initialize the database and table schema.

### Environtment Variable

See `.env.example` for template making your environtment variable on file `.env`

### Run Application

Development Mode

```bash
npm run dev
```

Run with docker-compose

```bash
docker compose up -d
```

Access the REST API with your port config based on `.env` file you've been making

## Requirements

- NodeJS v20 or latest
- MySQL Database
