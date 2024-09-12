# LAMBDA LENS

We built Lambda Lens to provide users a more intuitive UI experience than running logs through AWS' CLI. Lambda Lens aggregates and tracks key performance metrics like Cold Starts for users to evaluate their Lambda Functions.

Thank you for using our app!

# USER REQUIREMENTS

1. An **AWS Account** with admin access
2. A **MongoDB URI**

If you don't have a MongoDB account you may register at https://www.mongodb.com/cloud/atlas/register

## Env variables

Users may configure these variables directly on the app's Configuration page, however, users are also free to hard code the following keys into a .env file manually.

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
MONGODB_URI=
```

# RUNNING THE APPLICATION

## Installing dependencies

```
cd client || cd server
npm install
```

## Running the servers

```
cd client || cd server
npm run dev
```

- client will be running on: http://localhost:3000/
- server will be running on: http://localhost:8080/

## Compiling TypeScript (before deployment)

```
cd client || cd server
npm run build
```
