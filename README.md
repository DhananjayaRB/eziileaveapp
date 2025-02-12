# Resolve Leave Management

This project consists of a frontend built with Next.js, TypeScript, and Tailwind, and a backend built with Node.js, Express, Prisma, and PostgreSQL. The project uses Docker and Docker Compose to manage the containers for the frontend, backend, and PostgreSQL database.

## Requirements


Make sure the following are installed on your system:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Environment Variables

The following environment variables are required for the backend and PostgreSQL. These are passed via the docker-compose.yml file.

### Backend Environment Variables

- `DATABASE_URL`: The connection string for the PostgreSQL database, usually in the format `postgresql://<username>:<password>@db:5432/<database_name>?schema=public`.

### Example .env File for Local Development (Optional)

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
```

## Getting Started

1. Clone the Repository

```bash
cd project-name
```

2. Build and Run the Containers

To build and run the frontend, backend, and PostgreSQL containers, use the following command:

```bash
docker-compose up --build
```

The `--build` flag ensures that Docker rebuilds the images if there are any changes. After running this, the following services should be running:

- Frontend: http://localhost:3000
- Backend: https://qa-api.resolveindia.com/leave
- PostgreSQL: Exposed on port 5432, but not directly accessible unless using a database client like psql or typeorm.

3. Checking Database Persistence
   To ensure that your data persists after stopping and restarting the containers, follow these steps:

- Insert some data into the database.
- Stop the containers with:

```bash
docker-compose down
```

- Start the containers again with:

```bash
docker-compose up
```

- Check that the previously inserted data is still available by querying the database via your application.

4. Stopping the Containers
   To stop all running containers:

```bash
docker-compose down
```

This will stop the containers but preserve the data since it's stored in a Docker volume (postgres_data).

5. Accessing the Database
   If you want to access the PostgreSQL database directly (e.g., using psql), you can run the following command:

```bash
docker-compose exec db psql -U postgres -d postgres
```
