# Deployment Guide for Ghanshyam Bag

This application is built as a complete Full-Stack Express + React/Vite application. It utilizes a local SQLite database and local disk storage for image uploads, making it highly portable but requiring a persistent storage disk.

## Recommended: Render, Railway, or VPS

Because this application uses SQLite and local file uploads, it **requires a persistent file system**. It is thoroughly configured to be deployed on **Render**.

### Deploying to Render
1. Connect your GitHub repository to Render.
2. Select **Web Service**.
3. Render will automatically detect the `render.yaml` configuration file and set up your application with a persistent disk at `/data`.
4. It will automatically run `npm run build` and `npm start`.

### Deploying to a VPS (Ubuntu/Debian)
1. Clone the repository to your VPS.
2. Run `npm install`, then `npm run build`.
3. Start the application: `DATA_DIR=/var/www/ghanshyam/data PORT=80 node dist/server.cjs`
4. (Optional) Use PM2 to keep the app running in the background: `pm2 start dist/server.cjs --name "ghanshyam-app"`. 

## Note Regarding Netlify / Vercel Deployments

You requested Netlify deployment. **Netlify and Vercel are "Serverless" platforms**, meaning their backend functions spin up and down dynamically and **cannot save local files permanently**. 

If you deploy this application to Netlify:
- **Frontend SPA**: The frontend will work flawlessly. We have included `public/_redirects` which guarantees no 404 errors on routes like `/admin`.
- **Backend Constraints**: Serverless functions do NOT support persistent local SQLite databases or local Multer image uploads because the file system is wiped after each request.

**To deploy purely to Netlify**, you would need to migrate the database connection in `src/server/db.ts` to an external PostgreSQL database (such as Neon, Supabase, or Google Cloud SQL) instead of `better-sqlite3`, and migrate image uploads in `api.ts` to an external object storage like AWS S3 or Cloudinary. 

For the simplest, most frictionless production deployment exactly as-built, use **Render** utilizing the included `render.yaml`.
