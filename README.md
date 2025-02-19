# memories-api
http and socket endpoint for the memories-io webapp 


// to avoid "Host key verification failed" issue when cloning the git repo, connect to your aws instance and run
ssh-keyscan github.com >> ~/.ssh/known_hosts


// Git deploy will inject a ./config/.${NODE_ENV}.env file at root. 
// the conf folder is for local dev or testing
the production .env is part of the github action secrets and forwarded at the project root  during deployment



To allow creation of config folder after nginx installation you will need to go ssh you instrance and:
sudo chown -R <user>:<user> /etc/nginx


* manage SSL certificates
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d <your public IP>

* Add domain provider (ex: from clourdflare) certificates and key in the aws instance, setup nginx conf accordingly
ex: 
    ssl_certificate /etc/ssl/certs/cloudflare.pem;
    ssl_certificate_key /etc/ssl/private/cloudflare.key;

test the cong with """ nginx -t """



* final test
curl -v  https://memories-api.com/hb

# troubleshot
* (potentially) whitelist your domain provider IPs in your firewall:
sudo ufw allow from 173.245.48.0/20
sudo ufw allow from 103.21.244.0/22
... 

*  Check Nginx binding:

Ensure listen 443 ssl http2; is bound to 0.0.0.0:443  """sudo ss -tulnp | grep nginx"""




# Degeub
* pm2 logs

* Nginx logs:
 information about each request that Nginx receives.
(/var/log/nginx/access.log): This log contains information about each request that Nginx receives.

* Error logs on the server can be founf at:
~/.pm2/logs/backend-error.log 

* standard logs at 
~/.pm2/logs/backend-out.log  

* test nginx private key and certifs




# routes
route /hb

