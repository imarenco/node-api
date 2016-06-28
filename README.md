# Node-Api

Node-Api is auto generator api, for use you only must set the models, also provide an easy middleware integrate to add services (auth, log, etc).

### Installation

Node Api requires [Node.js](https://nodejs.org/) v4.4+ to run and requires [MongoDb](https://www.mongodb.com/).

### Run
```sh
node index.js
```
To run without Docker the unique of you need to do is "node index. js", before of this you should set environment variables for config, port the app, url of MongoDb, etc. If you don't set all environment variables doesn't matter, because all have default values. 

### How to use
For use you must put a model file into the path "app/generator/models/yourfile.json", this file must be a structure like:
```sh

{
	"name": "User",
	"structure": {
		"name": {
			"type":"String"
		},
		"label": {
			"type": "String"
		},
		"account": { 
			"type": "ObjectId", 
			"ref": "Account" 
		}
	},
	"detail": {
		"validate":[
		    { "name":"id", "source":"params",  "rules" : { "presence": true, "length": { "is": 24 } } }
		], 
		"select": {
			"account": false 
		}, 
		"populate": ["Account"] 
	},
	"list":{
		"paginate": true,
		"search": true,
		"select": {
			"name": false,
			"account": false
		}, 
		"populate": ["Account"], 
		"service": [
			{
				"name": "auth", 
				"method":"ifAuth"
			}
		] 
	},
	"update":{},
	"delete":{},
	"create":{}
}
```

This json represents the models that the api needs to start:
* name:  field that you use for your path, in this case the path is  "/user" because apply lowercase.
*  structure: The structure represents the fields of the schema for store/update/find in MongoDb, this structure model support all the types of Mongoose Date/String/Number/Mixed/ObjectId. 
* list: List represent GET method and return [] of documents relation with structure of model and the url of invoke is "/user" for model "User".
* detail: Detail represent GET method and return {} of document relation with structure of model and the url of invoke is "/user/:id" for model "User".
* create: Create represent POST method and return {} of document relation with structure of model and the url of invoke is "/user" for model "User".
* delete: Delete represet DELETE method and return status: 204, and the url of ivoke is "/user/:id" for model "User".
* update: Update represent PUT method and return {} document relation with structure of model and the url of invoke is "/user/:id" for model "User".

In all of the methods you can populate fields, disable method set "unable": false, and set or unset fields in response with select: true | false in some method. Also you can add a middleware, set element in array "service", you must put the name file and method of the service, this file must be in "/service", you can see a example of this in "/service/auth". Also you can validate fields of request in params, query and body, put object into field "validate" of contains name, source, rules, rules is the restriction of the field in  the request, the format of you can apply in rules it's  [Validate Js](https://validatejs.org/#validators).

### How to use filters ( list )
In method "list" you can set diferent parameters to sort or filter the return documents. The parameters of you can set are:
* page -> "/user?page=2"
* limit -> "/user?limit=5"
* search -> "/user?search={"name":"ju"}" with this implementation you can do text search, in this example search all name of contains "ju", support multiple keys search. Search can be disable put in the method search: false.



Also, you can filter the result put field's value through query, for example "/user?name=juan", in this example filter all the documents with only have name "juan", only can set fields are in the structure of the model.

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
