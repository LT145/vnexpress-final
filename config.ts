export const config = {
  env: {
    nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    
  },
};