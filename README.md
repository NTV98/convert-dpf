<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# DPS Convert PDF Service

A service for converting DOCX files to PDF using LibreOffice.

## Requirements

- Docker Desktop
- Docker Compose

## Setup Instructions

### Using Docker Compose (Recommended)

1. Make sure Docker Desktop is installed and running

2. Clone the repository
   ```bash
   git clone <repository-url>
   cd dps-convert-pdf
   ```

3. Run the setup script
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

   This will:
   - Create necessary directories
   - Set permissions
   - Build and start the Docker container

4. The service will be available at http://localhost:7000
   - API documentation: http://localhost:7000/api

### Manual Setup

If you prefer to set up manually:

1. Create necessary directories:
   ```bash
   mkdir -p temp public/pdf
   chmod -R 777 temp public/pdf
   ```

2. Build and start the Docker container:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

## Environment Variables

You can configure the service using environment variables:

- `PORT`: The port on which the service runs (default: 7000)
- `MINIO_SERVER`: MinIO server address
- `MINIO_ACCESS_KEY`: MinIO access key
- `MINIO_SECRET_KEY`: MinIO secret key
- `BUCKET`: MinIO bucket name for storing PDFs

## API Endpoints

### Convert DOCX to PDF

```
POST /convert/pdf
```

Request body:
```json
{
  "url": "https://example.com/document.docx"
}
```

Response:
```json
{
  "url": "https://minio-server/bucket/pdf/filename.pdf",
  "message": "File successfully converted and uploaded",
  "success": true
}
```

## Using Kafka

The service can also consume Kafka messages to convert documents:

1. Topic: `formatfile.to.pdf` - Listens for documents to convert
2. Message format:
   ```json
   {
     "url": "https://example.com/document.docx",
     "responseTopicId": "optional-response-topic"
   }
   ```

## License

[Add license information here]
# convert-pdf
