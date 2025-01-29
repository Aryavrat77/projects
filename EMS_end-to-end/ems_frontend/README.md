This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Clone the repository:

```bash
git clone https://github.com/r0nlt/ems-FrontEnd.git
cd ems-FrontEnd
```

First, check if Node.js is installed:

```bash
node -v
```

If Node.js and npm are not installed, download and install Node.js from the official website: [Node.js](https://nodejs.org/en). The installer will include npm.

After installing Node.js, verify npm installation:

```bash
npm -v
```

Initialize npm:

```bash
npm init
```

Install the dependencies: 

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Install React and Next.js:

```bash
npm install react react-dom
npm install --save-dev @types/react @types/react-dom

npm install --save-dev @types/next
npm install next react react-dom
```

Install Tailwind for CSS styling:

```bash
npm install tailwindcss
```

Running the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

To create an optimized production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

To run the app in production mode after building it:

```bash
npm start
# or
yarn start
# or
pnpm start
# or
bun start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
