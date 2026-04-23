# Aira Central Memory (KV) Setup

This project now supports centralized Aira memory through API routes:
- `GET /api/aira/memory?sessionId=<id>`
- `POST /api/aira/memory`

The API expects a Cloudflare KV binding named `AIRA_BRAIN_KV`.

## What Is Pending

1. Create a KV namespace in Cloudflare.
2. Add the namespace binding to `wrangler.jsonc`:

```jsonc
"kv_namespaces": [
  {
    "binding": "AIRA_BRAIN_KV",
    "id": "<your-kv-namespace-id>"
  }
]
```

3. Deploy to an environment where this binding is present.

## Optional CLI Commands

```bash
wrangler kv namespace create AIRA_BRAIN_KV
```

Then copy the returned namespace ID into `wrangler.jsonc`.

## Runtime Behavior

- If KV is configured: Aira syncs conversation history, events, and brain state centrally.
- If KV is not configured: API returns `503` with pending steps, and UI falls back to local browser memory.

## Admin Dashboard (Easy Reading)

New routes:
- `GET /admin/aira-memory`
- `GET /api/admin/aira/sessions`
- `GET /api/admin/aira/session/:sessionId`

If `ADMIN_TOKEN` is set, access requires token via query string or `x-admin-token` header.

Example dashboard URL:

`/admin/aira-memory?token=YOUR_ADMIN_TOKEN`

Recommended:
1. Set `ADMIN_TOKEN` in `wrangler.jsonc` vars.
2. Keep dashboard URL private.
3. Rotate token periodically.
