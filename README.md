KATHAA : A Visual Programming Framework for Sampark Machine Translation framework
=================================================================================

Kathaa is a Visual Programming Framework for Sampark Machine Translation System.   
Although it was built for Sampark, it is highly flexible, and can accommodate any   
practically any other system, as long as you can safely represent the unit-task at
hand by a single function which takes some inputs, and spits out some outputs :D.   

Installation
============
```
git clone https://github.com/spMohanty/kathaa-server
cd kathaa-server
npm install .
grunt build

export MONGOHQ_URL="mongodb://user:pass@your-mongo-server.some-domain.com:port_name/db_name"
#Make sure, redis is running on localhost

npm run seed_development
# or `npm seed_production` for seeding the production database

# this will ask you for the details of the Admin user, and seed the database
# with initial graphs

export NODE_ENV=development
#or NODE_ENV=production, in case of production mode
npm start

###
#
# You can also flush the mongodb database associated with your env by
# npm run flush_database
```

Author
======
S.P. Mohanty <spmohanty91@gmail.com>
