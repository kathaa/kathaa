कथा (kathaa) : A Visual Programming Framework for Sampark Machine Translation framework
=================================================================================

Kathaa is a Visual Programming Framework for Sampark Machine Translation System.   
Although it was built for Sampark, it is highly flexible, and can accommodate any   
practically any other system, as long as you can safely represent the unit-task at
hand by a single function which takes some inputs, and spits out some outputs :D.   

The goal of this Framework is to empower researchers to design and tinker with
complex NLP workflows irrespective of their technical proficiency, and hopefully
to bridge the gap between Linguists and Computational Linguists.

The vision of this Framework is to make creation of NLP workflows as easy as
creating an online survey like Google Form (which in retrospect was a highly
  time and resource consuming task just a few years ago).



![Kathaa Screenshot](https://cloud.githubusercontent.com/assets/1581312/12222517/cc55d2f0-b7e4-11e5-9f15-77a531a4affa.png)

Installation
============
```
# Note : The whole installation expects Node engine  >= 5.x
# Please install the latest version of node from :
# https://nodejs.org/en/download/package-manager/
# Its really easy, I promise
# :)

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

# Copy and Edit environment parameters
cp config/env/env.example.json config/env/env.json

npm start

###
#
# You can also flush the mongodb database associated with your env by
# npm run flush_database
```

Extend
======
New Modules can be added in the `config/module_library` folder.
Inside the folder, there is a `package.json` file, where references to different
modules can be made.
Modules have to defined using a `.json` and `.js` file inside the module_library.
the `.json` file holds the definition of the structure of the module, and the `.js`
file holds the definition of the function of the file.

Look at examples in `config/module_library/core.js` and `config/module_library/core.json`
for templates for defining custom modules.

Pull requests for new modules would really be appreciated !!

Author
======
S.P. Mohanty <spmohanty91@gmail.com>
