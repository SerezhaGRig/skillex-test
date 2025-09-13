# Skillex Test

## Quick Start

### Start the MySQL Container

```bash
docker run --name local-mysql \
  -e MYSQL_ROOT_PASSWORD=yourRootPassword \
  -e MYSQL_USER=yourUsername \
  -e MYSQL_PASSWORD=yourPassword \
  -e MYSQL_DATABASE=dbName \
  -p 3306:3306 \
  -d mysql:8.0
```

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Production

```bash
npm run build
npm start
```

### Migration Sample file

```bash
npm run migration
```
## API docs
- Located in docs/swagger.yml
- Open with online editor: https://editor-next.swagger.io/ 

### Run tests

```bash
npm run test
```