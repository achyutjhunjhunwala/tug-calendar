# Elasticsearch Observability Setup

Documentation of Elasticsearch configuration for `logs-tug.calendar-production` data stream.

---

## Infrastructure Details

- **Elasticsearch Version**: 8.19.3
- **Data Stream**: `logs-tug.calendar-production`
- **Index Mode**: `logsdb` (optimized for logs, 70% storage savings)
- **Retention**: 90 days (hot phase only)
- **Rollover**: Daily or 50GB primary shard size

---

## 1. ILM Policy

```json
PUT _ilm/policy/logs-tug.calendar-policy
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_age": "1d",
            "max_primary_shard_size": "50gb"
          }
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
```

---

## 2. Index Template

```json
PUT _index_template/logs-tug.calendar
{
  "index_patterns": ["logs-tug.calendar-*"],
  "data_stream": {},
  "priority": 500,
  "template": {
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 1,
      "index.mode": "logsdb",
      "index.lifecycle.name": "logs-tug.calendar-policy",
      "index.codec": "best_compression"
    },
    "mappings": {
      "properties": {
        "@timestamp": {
          "type": "date"
        },
        "message": {
          "type": "text"
        },
        "level": {
          "type": "keyword"
        },
        "service": {
          "properties": {
            "name": {
              "type": "keyword"
            },
            "environment": {
              "type": "keyword"
            }
          }
        },
        "requestId": {
          "type": "keyword"
        },
        "event": {
          "properties": {
            "source": {
              "type": "keyword"
            },
            "detail-type": {
              "type": "keyword"
            }
          }
        },
        "eventCount": {
          "type": "integer"
        },
        "reportType": {
          "type": "keyword"
        },
        "result": {
          "properties": {
            "status": {
              "type": "keyword"
            },
            "message": {
              "type": "text"
            }
          }
        },
        "error": {
          "properties": {
            "message": {
              "type": "text"
            },
            "stack": {
              "type": "text"
            },
            "name": {
              "type": "keyword"
            },
            "code": {
              "type": "keyword"
            }
          }
        },
        "calendar": {
          "properties": {
            "id": {
              "type": "keyword"
            },
            "eventsRetrieved": {
              "type": "integer"
            }
          }
        },
        "notification": {
          "properties": {
            "type": {
              "type": "keyword"
            },
            "payloadSize": {
              "type": "integer"
            },
            "response": {
              "type": "text"
            }
          }
        },
        "handler": {
          "type": "keyword"
        },
        "currentDayOfWeek": {
          "type": "integer"
        }
      }
    }
  }
}
```

---

## 3. Create Data Stream

```json
PUT _data_stream/logs-tug.calendar-production
```

---

## Verification Commands

### Check ILM Policy
```json
GET _ilm/policy/logs-tug.calendar-policy
```

### Check Index Template
```json
GET _index_template/logs-tug.calendar
```

### Check Data Stream
```json
GET _data_stream/logs-tug.calendar-production
```

### Check Data Stream Stats
```json
GET _data_stream/logs-tug.calendar-production/_stats
```

### View All Data Streams
```json
GET _data_stream
```

### View Backing Indices
```json
GET _data_stream/logs-tug.calendar-production
```

### Search Latest Logs
```json
GET logs-tug.calendar-production/_search
{
  "size": 10,
  "sort": [
    {
      "@timestamp": {
        "order": "desc"
      }
    }
  ]
}
```

---

## Kibana Data View

**Name**: `Tug Calendar Logs`
**Index Pattern**: `logs-tug.calendar-production`
**Timestamp Field**: `@timestamp`

---

## Useful KQL Queries

```kql
# All errors
level: "error"

# Successful report generations
result.status: "success"

# Daily report executions
handler: "daily" AND level: "info"

# Weekly report executions (Sundays only)
handler: "weekly" AND level: "info"

# Monthly report executions
handler: "monthly" AND level: "info"

# Trace specific Lambda execution
requestId: "abc-123-def-456"

# Failed operations
level: "error" AND error.message: *

# Google Calendar API errors
error.message: *Calendar*

# Notification service errors
error.message: *notification*

# Events with no calendar events found
message: "No events found"

# Last 24 hours only
@timestamp >= "now-24h"

# Specific service
service.name: "tug-calendar"

# High event count (more than 10 events)
eventCount > 10
```

---

## Management Commands

### Force Rollover
```json
POST logs-tug.calendar-production/_rollover
```

### Delete Old Data (Manual)
```json
POST logs-tug.calendar-production/_delete_by_query
{
  "query": {
    "range": {
      "@timestamp": {
        "lt": "now-90d"
      }
    }
  }
}
```

### Delete Entire Data Stream (Caution!)
```json
DELETE _data_stream/logs-tug.calendar-production
```

---

## API Key Permissions

When creating Elasticsearch API key for the Lambda:

```json
{
  "cluster": ["monitor"],
  "indices": [
    {
      "names": ["logs-tug.calendar-production"],
      "privileges": ["auto_configure", "create_doc", "write"]
    }
  ]
}
```

---

## Environment Variables

Required in Lambda (SSM Parameters) and `.env`:

```bash
ELASTICSEARCH_CLOUD_ID=<your-cloud-id>
ELASTICSEARCH_API_KEY=<your-api-key>
```

In AWS SSM:
```bash
aws ssm put-parameter --name ELASTIC_CLOUD_ID --value "your-cloud-id" --type String
aws ssm put-parameter --name ELASTIC_API_KEY --value "your-api-key" --type SecureString
```

---

## Cost Estimate

- **Monthly Ingestion**: ~6 MB (daily + weekly + monthly runs)
- **Storage (90-day retention)**: ~540 MB
- **Elastic Cloud Cost**: < $0.50/month
- **Storage Savings**: 70% (due to logsdb mode)

### Execution Frequency
- **Daily**: 1x/day (6 AM UTC)
- **Weekly**: 1x/week (8 AM UTC on Sundays)
- **Monthly**: 1x/month (6:30 AM UTC on 1st day)
- **Total**: ~35 executions/month

---

## Sample Log Entry

```json
{
  "@timestamp": "2025-10-18T06:00:00.000Z",
  "level": "info",
  "message": "Daily report completed successfully",
  "service": {
    "name": "tug-calendar",
    "environment": "production"
  },
  "requestId": "abc-123-def-456",
  "handler": "daily",
  "eventCount": 5,
  "reportType": "Daily Report",
  "result": {
    "status": "success",
    "message": "Posted 1 day(s) of events for Daily Report"
  },
  "calendar": {
    "id": "pcl9qikhvn522cqijuoitfse2s@group.calendar.google.com",
    "eventsRetrieved": 5
  },
  "notification": {
    "type": "calendar",
    "payloadSize": 1,
    "response": "Message sent"
  }
}
```

---

## Troubleshooting

### No Logs Appearing

1. **Check API Key Permissions**
   ```json
   GET _security/api_key?name=tug-calendar
   ```

2. **Verify Data Stream Exists**
   ```json
   GET _data_stream/logs-tug.calendar-production
   ```

3. **Check Lambda Environment Variables**
   - `ELASTICSEARCH_CLOUD_ID` should be set
   - `ELASTICSEARCH_API_KEY` should be set
   - Check CloudWatch Logs for pino-elasticsearch errors

### Logs Not Being Deleted

1. **Check ILM Policy Status**
   ```json
   GET logs-tug.calendar-production/_ilm/explain
   ```

2. **Force ILM Execution**
   ```json
   POST _ilm/move/logs-tug.calendar-production
   {
     "current_step": {
       "phase": "hot",
       "action": "complete",
       "name": "complete"
     },
     "next_step": {
       "phase": "delete"
     }
   }
   ```

---

**Last Updated**: October 2025
**Elasticsearch Version**: 8.19.3

