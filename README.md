# tug-calendar

A serverless TypeScript application that fetches Google Calendar events and sends formatted notifications via Telegram on a scheduled basis.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Lambda (Scheduled)                    │
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Daily      │    │   Weekly     │    │   Monthly    │      │
│  │  Handler     │    │   Handler    │    │   Handler    │      │
│  │  (6:00 AM)   │    │  (8:00 AM)   │    │  (6:30 AM)   │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                    │               │
│         └───────────────────┴────────────────────┘               │
│                             │                                    │
│                             ▼                                    │
│                  ┌──────────────────────┐                       │
│                  │  Google Calendar     │                       │
│                  │  Service             │                       │
│                  └──────────┬───────────┘                       │
│                             │                                    │
│                             ▼                                    │
│                  ┌──────────────────────┐                       │
│                  │  Notification        │                       │
│                  │  Service             │                       │
│                  └──────────┬───────────┘                       │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │  TUG-NS-V2 API       │
                   │  (Notification)      │
                   └──────────┬───────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │  Telegram Bot API    │
                   └──────────────────────┘

                   ┌──────────────────────┐
                   │  Elasticsearch       │
                   │  (Logs)              │
                   └──────────────────────┘
```

## Features

- **Scheduled Reports**: Daily, weekly, and monthly calendar summaries
- **TypeScript**: Fully typed codebase with strict mode enabled
- **Structured Logging**: Pino logger with Elasticsearch integration
- **Modern Stack**: Node.js 20.x, esbuild bundling, latest dependencies
- **Auto-deployment**: GitHub Actions with Dependabot integration
- **Serverless**: AWS Lambda with optimized cold start performance

## Prerequisites

- Node.js >= 20.0.0
- AWS Account with configured credentials
- Google Cloud Service Account with Calendar API access
- TUG Notification Service API credentials
- Elasticsearch Cloud (optional, for log aggregation)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
TUG_NS_API_URL=https://api.theuiguy.com/notify
TUG_NS_API_KEY=your-api-key
ELASTIC_CLOUD_ID=your-cloud-id
ELASTIC_API_KEY=your-api-key
SERVICE_NAME=tug-calendar
NODE_ENV=development
LOG_LEVEL=info
```

**Note:** The Google Calendar ID (`pcl9qikhvn522cqijuoitfse2s@group.calendar.google.com`) and service account path (`tug-calendar-93d646f8c570.json`) are hardcoded in the source code.

### 3. Google Service Account Setup

1. Create a service account in Google Cloud Console
2. Enable Google Calendar API
3. Download the service account JSON file
4. Place it in the project root as `tug-calendar-93d646f8c570.json`
5. Share your Google Calendar with the service account email

### 4. Build the Project

```bash
npm run build
```

## Development

### Local Testing

```bash
npm run start
```

This starts serverless-offline for local development.

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
npm run lint:fix
```

## Deployment

### AWS SSM Parameters

Configure the following SSM parameters in AWS:

```bash
aws ssm put-parameter --name TUG_NS_API_URL --value "https://api.theuiguy.com/notify" --type String
aws ssm put-parameter --name TUG_NS_API_KEY --value "your-api-key" --type SecureString
aws ssm put-parameter --name ELASTIC_CLOUD_ID --value "your-cloud-id" --type String
aws ssm put-parameter --name ELASTIC_API_KEY --value "your-api-key" --type SecureString
```

**Note:** Elasticsearch parameters are optional and only needed if you want log aggregation. See [docs/observability-setup.md](docs/observability-setup.md) for detailed setup.

### Deploy to AWS

```bash
npm run deploy
```

Or with a specific region:

```bash
serverless deploy --region eu-central-1
```

## Scheduled Executions

- **Daily Report**: Runs at 6:00 AM UTC, sends today's events
- **Weekly Report**: Runs at 8:00 AM UTC on Sundays, sends next 7 days
- **Monthly Report**: Runs at 6:30 AM UTC on 1st of month, sends full month

## Project Structure

```
tug-calendar/
├── src/
│   ├── handlers/           # Lambda function handlers
│   │   ├── daily.handler.ts
│   │   ├── weekly.handler.ts
│   │   └── monthly.handler.ts
│   ├── services/           # Business logic services
│   │   ├── google.service.ts
│   │   └── notification.service.ts
│   ├── utils/              # Utility functions
│   │   ├── calendar.utils.ts
│   │   ├── config.ts
│   │   ├── formatter.ts
│   │   └── logger.ts
│   └── types/              # TypeScript type definitions
│       ├── calendar.types.ts
│       ├── config.types.ts
│       └── index.ts
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       └── auto-merge-dependabot.yml
├── dist/                   # Compiled TypeScript output
├── .env.example
├── package.json
├── serverless.yml
└── tsconfig.json
```

## Telegram Message Format

Events are formatted with clear visual structure:

```
📅 Daily Report
──────────────────────────────
Date: Monday, October 18, 2025

⏰ 09:00 - 10:00
Team Standup
Duration: 60 minutes

⏰ 14:00 - 15:30
Client Review
Duration: 90 minutes
```

## Dependencies Management

Dependabot automatically checks for updates weekly and creates pull requests. Minor and patch updates are auto-merged after successful builds. Major version updates require manual review.

## License

ISC
