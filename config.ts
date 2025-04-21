export const config = {
  env: {
    nextAuthUrl: process.env.NEXTAUTH_URL || 'https://vnexpress-final-ck9udo1us-lt145s-projects.vercel.app',
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    
  },
};