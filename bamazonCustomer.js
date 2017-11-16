
var inquirer = require("inquirer");

var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "!@SQLm3.123",
	database: "bamazon_db"
})

var query = connection.query();

var product = "";
var department = "";
var price = 0;
var stock = 0;

connection.connect(function(err) {
	if (err) throw err;
		console.log("================================================");
		console.log("Welcome to Bamazon! Thanks for shopping with us!");
		console.log("================================================");
		customer();
})

function customer() {
	console.log()
	inquirer.prompt([
		{

		}	
	]).then(function(buy) {
		product = buy.product;
		department = buy.department;
		price = buy.price;
		stock = buy.stock;
		transact();
	})
}

function transact() {
	query("SELECT * FROM products", function(err, res) {
		if (err) {
			throw err;
		} else {
			console.log(res);
		}
	})
	again();
}

function again () {
	inqurier.prompt([
		{

		}
	])
}








