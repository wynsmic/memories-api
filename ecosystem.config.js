module.exports = {
    apps: [
      {
        name: "memories-api",
        script: "dist/main.js", 
        instances: 1,  // Adjust for multiple instances
        autorestart: true,
        watch: false,
        env: {
          NODE_ENV: "staging",
          PORT: 8082,  
        },
        env_production: {
          NODE_ENV: "production",
          PORT: 8082,  
        },
      },
    ],
  };
  
  