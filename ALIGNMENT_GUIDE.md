# 🚀 Portfolio Alignment & Optimization Guide

To ensure your **Full-Stack Portfolio** runs with "perfect, clear, fast, and accurate" performance after deployment, follow these alignment steps.

## 1. Backend URL Alignment (Vite + Vercel)
Your frontend needs to know where the backend is. Since you are using Vite, you must set an environment variable.

### **On Vercel:**
1. Go to your **Project Settings** > **Environment Variables**.
2. Add a new variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com` (Replace with your actual backend URL).
3. Re-deploy your frontend.

---

## 2. CORS Alignment (Spring Boot)
The backend must "trust" your frontend URL. We have updated `CorsConfig.java` to allow:
- `manozz.site`
- `*.manozz.site`
- `*.vercel.app`
- `localhost:5173`

**Tip:** If you change your domain, ensure it is added to the `allowedOriginPatterns` in `CorsConfig.java`.

---

## 3. Performance & Speed Optimizations
We have implemented several "Perfect & Fast" features:
- **Health Check:** I added a `HealthController`. Now, if you visit your backend URL directly, you will see a "UP" status instead of a "404 Not Found" error.
- **GZIP Compression:** Enabled in `application.properties`. This makes JSON responses up to 80% smaller.

- **Batch Processing:** Optimized Hibernate to handle database updates in batches for better performance.
- **Caching Headers:** Static assets (like images in `uploads/`) are now cached by the browser for 1 hour to reduce server load.
- **API Freshness:** API GET requests are set to `no-cache` to ensure the user always sees the latest portfolio data.

---

## 4. Accurate Error Handling
The `axiosInstance.js` now has a "Smart Interceptor":
- **Development Logging:** Shows exactly how many milliseconds each API call takes.
- **Production Safety:** Automatically clears stale tokens on 401 errors.
- **Clear Console Errors:** If the backend goes down or there is a network issue, you will see a clear, human-readable message in the Browser Console.

---

## 5. Deployment Checklist
- [ ] Backend is running (e.g., on Render/Railway).
- [ ] Database is connected (check backend logs).
- [ ] `VITE_API_URL` is set in Vercel.
- [ ] Domain name (`manozz.site`) is allowed in `CorsConfig.java`.

**Everything is now perfectly aligned and optimized!** 🚀
