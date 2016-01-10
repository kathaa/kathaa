KATHAA : A Visual Programming Framework for Sampark Machine Translation framework
=================================================================================

Kathaa is a Visual Programming Framework for Sampark Machine Translation System.   
Although it was built for Sampark, it is highly flexible, and can accommodate any   
practically any other system, as long as you can safely represent the unit-task at
hand by a single function which takes some inputs, and spits out some outputs :D.   

![Kathaa Screenshot](https://cloud.githubusercontent.com/assets/1581312/12222517/cc55d2f0-b7e4-11e5-9f15-77a531a4affa.png)

Installation
============
```
git clone https://github.com/spMohanty/kathaa
cd kathaa-server
npm install .
grunt build

# Point to your MongoDB instance.
# If you mongo DB instance is running on localhost in default settings, 
# then you can ignore this next step
export MONGOHQ_URL="mongodb://user:pass@your-mongo-server.some-domain.com:port_name/db_name"

#Make sure, redis is running on localhost

export NODE_ENV=development
#or NODE_ENV=production, in case of production mode

npm run seed
# this will ask you for the details of the Admin user, and seed the database
# with initial graphs

npm start

###
#
# You can also flush the mongodb database associated with your env by
# npm run flush_database
```

Author
======
S.P. Mohanty <spmohanty91@gmail.com>
