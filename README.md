# Node-Api

Node-Api is auto generate api, for use you only must set the models, also provide a easy middlewares integrate for add services( middlewares ).

### Installation

Node Api requires [Node.js](https://nodejs.org/) v4.4+ to run and requires [MongoDb](https://www.mongodb.com/).

### Run
```sh
node index.js
```
For run without Docker the unique of you need to do it's "node index.js", before of this you should set enviroment variables for config, port the app, url of MongoDb, etc. If you not set all enviroment variables doesn't matter, because all have default value.

### How to use
For use you must put a model file into the path "app/generator/models/yourfile.json", this file must be a structure like:
```sh
{
	"name": "User",
	"structure": {
		"name": {"type": String"},
		"account": { "type": "ObjectId", "ref": "Account" }
	},
	"detail": {  "populate": ["Account"] },
	"list":{"service": [{"name": "auth", "method":"ifAuth"}] },
	"update":{ "unable": false},
	"delete":{},
	"create":{}
}
```
This fields represent the info of api need for start. The "name" is the field of you use for your path, in this case the path is  "/user" because apply lowercase.
The structure represent the fields of the documents for store/update/find in MongoDb, this structure model support all the types of Mongoose Date/String/Number/Mixed/ObjectId. After have 5 methods of rest api:
* list -> get -> /user -> return [];
* detail -> get -> /user/:id -> return {};
* create -> post -> /user -> return {};
* delete -> delete -> /user/:id -> status: 204
* update -> put -> /user/:id -> return {};

In all of the methods you can populate fields, and disable method set "unable": false. Also you can add middlewares set element in array "service", you must put the name file and method of the service, this file must be in "/service", you can see a example of this in "/service/auth".
### Tech

Node-Api uses a number of open source projects to work properly:

* [NodeJs](https://nodejs.org/) - Server Tecnology for api.
* [MongoDB](https://www.mongodb.com/) - Database of the api use.
* [Restify](http://restify.com/) - Framework of NodeJs for handling http Request.
* [Mongoose](http://mongoosejs.com/) - Library for Mongodb.

### Enviroment Variables
* NODE_ENV
* PORT
* IP
* MONGODB_URI
* LOG_PATH (this is a path of you want to store errors)

### Docker
Node-Api is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 80, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image.

```sh
cd project
docker build -t <youruser>/tag:latest .
```

```sh
docker run -d -p 80:80 --restart="always" <youruser>/tag:latest
```

Verify the deployment by navigating to your server address in your preferred browser.

### Version
0.1.0

### Todos

 - Write Tests
 - Think releases

License
----

MIT
