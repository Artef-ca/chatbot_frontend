# Build
```bash
npx vite build --emptyOutDir
```

## Run with Docker (Nginx image with runtime env)

This project includes a production-ready Dockerfile (`Dockerfile.nginx`) that serves the built app via Nginx and injects runtime environment variables into `env.js` at container startup.

### 1) Create a .env file

Create a `.env` file in the project root with your settings:

```
VITE_API_URL=https://your-api.example.com/
VITE_AUDIENCE_API_URL=https://your-audience-api.example.com/
VITE_MY_TOKEN=your-token-or-empty
VITE_CLOUD_INSTANCE=https://login.microsoftonline.com/
VITE_TENANT_ID=your-tenant-id
VITE_CLIENT_ID=your-client-id
VITE_REDIRECT_URI=http://localhost:5180/redirect
```

Notes:
- Values are injected at runtime into `window.env` by `nginx/docker-entrypoint.sh` using envsubst.
- `VITE_MY_TOKEN` can be empty; if provided, it will be sent as `Authorization: Bearer <token>` by the app.

### 2) Build the Docker image

```bash
docker build -f Dockerfile.nginx -t neom-demo-nginx:latest .
```

### 3) Run the container

Pick a free host port (e.g., 5180) and run:

```bash
docker run --rm -p 5180:8080 \
  --env-file .env \
  -e VITE_REDIRECT_URI="http://localhost:5180/redirect" \
  neom-demo-nginx:latest
```

Open the app at:

```
http://localhost:5180
```

### 4) Verify runtime env

In the browser DevTools → Network tab, open the `env.js` request. It should contain your actual values (not `${VAR}` placeholders). If you see placeholders, ensure:
- You built with `Dockerfile.nginx`.
- You ran the container with `--env-file .env` and/or `-e VAR=value`.
- Hard refresh (Cmd+Shift+R) to avoid cached `env.js`.

### Troubleshooting

- Port already in use:
  - Change the host port: `-p 5190:8080` and update `VITE_REDIRECT_URI` accordingly.

- `env.js` still shows placeholders:
  - Ensure your `.env` contains the variables and that they are exported to the container (`--env-file .env`).
  - The entrypoint uses `envsubst` which only replaces variables that are set; unset vars become empty strings.

- 403 from API:
  - Confirm `VITE_API_URL`/`VITE_AUDIENCE_API_URL` are correct and reachable from your machine.
  - If the API requires auth, set a valid `VITE_MY_TOKEN` or disable auth on the server for testing.
  - Check CORS on the API to allow `http://localhost:<your-port>`.

### Alternative: Node preview image (original Dockerfile)

The original `Dockerfile` builds the app and runs Vite preview. It also generates `env.js` at startup using `envsubst`. If you prefer that:

```bash
docker build -t neom-demo:latest .
docker run --rm -p 5080:5000 --env-file .env neom-demo:latest
```

Open:

```
http://localhost:5080
```

