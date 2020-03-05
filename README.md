# ejs_forms
Automatcically create Bootstrap form with nested and duplicate inputs based on a JS object  

# setup
- 'mkdir db' on the application route
- npm install nodemon -g  
- npm install htpasswd -g

# Create users
- 'htpasswd -c users.password user1' on command line generates the users.password file //for basic auth  
- 'htdigest -c users.digest group1 user1' on command line generates the users.digest file //for digest auth
