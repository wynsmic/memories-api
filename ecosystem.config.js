module.exports = {
    apps: [
      {
        name: "memories-api",
        script: "dist/server.js", 
        instances: 1,  // Adjust for multiple instances
        autorestart: true,
        watch: false,
        env: {
          NODE_ENV: "staging",
          PORT: 8080,  
        },
        env_production: {
          NODE_ENV: "production",
          PORT: 8080,  
        },
      },
    ],
  };
  