## Installation

1. Clone the repository:

```bash

git clone <repository-url>

```

2. Install dependencies:

```bash

npm install

```

3. Create a `.env` file based on the `.env.example` file and configure your environment variables.

4. Run the project in development mode:

```bash

npm run dev

```

## Making TypeScript Types for Locales

This project uses Quicktype to automatically generate TypeScript types from the localization JSON files.

## Environment Variables

Configure the environment variables in your `.env` file.
For testing, I use the `.env.test` (It will reset the DB).

# Testing

You can run test by running:

```bash

npm run test:e2e

```

# Contributing

If you’d like to contribute to this project, feel free to fork the repository and submit a pull request. Ensure that your code follows the existing coding standards and includes appropriate tests where necessary.
