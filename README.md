# LambdaLens

# client setup

npm create vite@latest
|\_Project name: client
|\_Select a framework: React
|\_Select a variant: TypeScript

Note: I chose TypeScript without SWC as I didn't want to add more variables to the project

cd client
npm install
npm run dev

vite.config.ts
|\_added server { port: 3000 }

# server setup

cd server
npm init -y // sets up package.json file
npm i express // installs express
npm i -D typescript // installs TypeScript as development dependency
npm i -D @types/express // TypeScript definitions for express
npx tsc --init // generates tsconfig.json
npx tsc --build // uses the tsconfig options to compile a new file
npm i -D ts-node // installs ts-node to interpret ts files to node
npm i -D nodemon

# running the servers

1. cd client
2. npm run dev
   http://localhost:3000/

3. cd server
4. npm run dev
   http://localhost:8080/

# compiling TypeScript

cd server
npm run build // to compile TypeScript before deployment
