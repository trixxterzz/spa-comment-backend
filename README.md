# spa-comment-backend

This is backend part of Single Page Application that implements functionality of writing comments and replying to them with applicating text file or image. Application has its authorization system, pagination and different sort criterias.

## Stack
Express.jx, SQLite3, JWT, S3, Socket.io, Joi

## Installation

### Variant 1. Manual deployment
#### Tools requirements: SQLite3, NPM, configured for public object reading S3 bucket
1. Run `npm install`
2. Run `sqlite3 comment_db.db` and paste code from file **init.sql**
3. In **env-dev.sh** replace empty strings in fields with your credentials (JWT_KEY - generate your JWT certificate for tokens encription, S3_* variables - fill with your bucket data and credentials)
4. Run `. ./env-dev.sh`
5. Run `npm start`. Now your server should be deployed and is listening to 3000 port.

### Variant 2. Docker deployment
#### Tools requirements: Docker, configured for public object reading S3 bucket
1. Run `docker build -t backend .`
2. In **.env.dev** replace empty strings in fields with your credentials (JWT_KEY - generate your JWT certificate for tokens encription, S3_* variables - fill with your bucket data and credentials)
3. Run `docker run -p 3000:3000 --env-file .env.dev backend`. Now you can check your Docker interface, where new docker image and container should've been created.

