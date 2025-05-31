# [Endpoint Name]

## Overview
[Brief description of what this endpoint does]

## Endpoint Details
- **URL**: `/api/v1/[endpoint-path]`
- **Method**: `[HTTP METHOD]`
- **Authentication**: [Required/Optional]
- **Authorization**: [Required roles/permissions]

## Request

### Headers
```json
{
    "Content-Type": "application/json",
    "Authorization": "Bearer [token]"
}
```

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param1` | string | Yes | Description |
| `param2` | number | No | Description |

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `filter` | string | No | null | Description |
| `page` | number | No | 1 | Description |

### Request Body
```json
{
    "field1": "string",
    "field2": 123,
    "field3": {
        "nested": "value"
    }
}
```

#### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `field1` | string | Yes | Description |
| `field2` | number | No | Description |
| `field3.nested` | string | Yes | Description |

## Response

### Success Response
**Code**: `200 OK`

```json
{
    "status": "success",
    "data": {
        "field": "value"
    }
}
```

### Error Responses

#### 400 Bad Request
```json
{
    "status": "error",
    "code": "INVALID_REQUEST",
    "message": "Description of the error"
}
```

#### 401 Unauthorized
```json
{
    "status": "error",
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
}
```

## Rate Limiting
- Rate limit: [X] requests per [time period]
- Throttling: [Description of throttling behavior]

## Example Usage

### cURL
```bash
curl -X POST \
  'https://api.example.com/api/v1/endpoint' \
  -H 'Authorization: Bearer [token]' \
  -H 'Content-Type: application/json' \
  -d '{
    "field1": "value",
    "field2": 123
  }'
```

### JavaScript
```javascript
const response = await fetch('https://api.example.com/api/v1/endpoint', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer [token]',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    field1: 'value',
    field2: 123
  })
});
```

## Notes
- [Important note 1]
- [Important note 2]
- [Known limitations]

## Related Endpoints
- [Link to related endpoint 1]
- [Link to related endpoint 2]

## Changelog
| Date | Version | Description |
|------|---------|-------------|
| YYYY-MM-DD | 1.0 | Initial release | 