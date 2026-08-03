# Vercel Deployment Instructions

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Customer App
1. Go to https://vercel.com/new
2. Import the Sokopay repo
3. Set **Root Directory** to `apps/customer`
4. Framework: **Next.js**
5. Build Command: `cd ../.. && turbo run build --filter=@sokopay/customer`
6. Output Directory: `.next`
7. Add environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aGFuZHktbG9ic3Rlci01My5jbGVyay5hY2NvdW50cy5kZXYk`
   - `CLERK_SECRET_KEY=sk_test_qwPTK3tvo9t4Fzfw5SxT4xg4RiDDxRyxxAj9xmThzR`
8. Deploy

### Vendor App
1. Go to https://vercel.com/new
2. Import the same Sokopay repo
3. Set **Root Directory** to `apps/vendor`
4. Framework: **Next.js**
5. Build Command: `cd ../.. && turbo run build --filter=@sokopay/vendor`
6. Output Directory: `.next`
7. Add the same Clerk environment variables
8. Deploy

## Option 2: Deploy via CLI

```bash
# Deploy customer app
cd apps/customer
vercel --prod

# Deploy vendor app
cd apps/vendor
vercel --prod
```

## Environment Variables (add to both projects)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aGFuZHktbG9ic3Rlci01My5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_qwPTK3tvo9t4Fzfw5SxT4xg4RiDDxRyxxAj9xmThzR
DATABASE_URL=<your-neon-connection-string>
UPSTASH_REDIS_REST_URL=<your-upstash-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>
```
