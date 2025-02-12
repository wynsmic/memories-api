# memories-api
http and socket endpoint for the memories-io webapp 


// to avoid "Host key verification failed" issue when cloning the git repo, connect to your aws instance and run
ssh-keyscan github.com >> ~/.ssh/known_hosts


// Git deploy will inject a ./config/.${NODE_ENV}.env file at root. 
// the conf folder is for local dev or testing
the production .env is part of the github action secrets and forwarded at the project root  during deployment

// Error logs on the server can be founf at:
~/.pm2/logs/backend-error.log 

// standard logs at 
~/.pm2/logs/backend-out.log  

To allow creation of config folder after nginx installation you will need to go ssh you instrance and:
sudo chown -R <user>:<user> /etc/nginx



# routes
route /hb

