// app/config/environment.ts
const ENV = {
  dev: {
    API_URL: 'http://localhost:8000',
    ENV_NAME: 'development',
  },
  production: {
    API_URL: 'https://javilogistics.com', // Replace with your actual production URL
    ENV_NAME: 'production',
  },
};

// Toggle this to switch environments
const currentEnv = 'production'; // Change to 'dev' for local development

export default ENV[currentEnv];