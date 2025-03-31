# MovieTicketBooking

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

Before you begin, ensure you have:
- Node.js installed (v18 or higher)
- PostgreSQL database server running
- npm, yarn, pnpm, or bun package manager

## Initial Setup

1. **Environment Setup**

Create a `.env` file in the root directory with the following variables:
```env
# Database
DATABASE_URL=

# Next Auth
AUTH_URL="http://localhost:3000"
```

2. **Database Setup**

Initialize and generate the Prisma client:
```bash
# Generate Prisma client
npx prisma generate

# Push the schema to your database
npx prisma db push
```

3. **Generate Auth Secret**

Generate a secure authentication secret:
```bash
# Generate a random secret for NextAuth
npx auth secret
```

4. **Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Development Server

Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable React components
- `/lib` - Utility functions and shared logic
- `/prisma` - Database schema and migrations
- `/types` - TypeScript type definitions
- `/actions` - Server actions and API routes

## Features

This project uses:
- [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font)
- NextAuth.js for authentication
- Prisma as the ORM
- PostgreSQL as the database
- Tailwind CSS for styling
- shadcn/ui for UI components

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
