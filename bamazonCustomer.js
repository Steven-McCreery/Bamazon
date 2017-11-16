
var inquirer = require("inquirer");

// easy-table setup
var Table = require("easy-table");
var table = new Table;

// cli-table setup
// var Table = require("cli-table");
// var table = new Table({
// 	chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗', 'bottom': '═' , 'bottom-mid': '╧', 'bottom-left': '╚' , 'bottom-right': '╝', 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼', 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
// });

var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "!@SQLm3.123",
	database: "bamazon_db"
})

var product = "";
var department = "";
var price = 0;
var stock = 0;

connection.connect(function(error) {
	if (error) {
		throw error;
	} else{
		console.log("================================================");
		console.log("Welcome to Bamazon! Thanks for shopping with us!");
		console.log("================================================");
		connection.query("SELECT * FROM products", function(err, res) {
			if (err) {
				throw err;
			} else {

				// easy table method
				res.forEach(function(t) {
					table.cell('Product Id', t.item_id)
					table.cell('Description', t.product_name)
					table.cell('Department', t.department_name)
					table.cell('Price, USD', t.price)
					table.cell('Available Qty', t.stock_quantity, Table.number(2))
					table.newRow()
				});
				console.log(table.toString());

				// cli-table method
				// table.push(res);
				// console.log(table.toString());
			}
		});
		customer();
		// connection.end();
	}
})

function customer() {
	console.log("customer function");
	// inquirer.prompt([
	// 	{

	// 	}	
	// ]).then(function(buy) {
	// 	product = buy.product;
	// 	department = buy.department;
	// 	price = buy.price;
	// 	stock = buy.stock;
	// 	transact();
	// })

	transact();
}

function transact() {
	console.log("transact function");
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) {
			throw err;
		} else {
			console.log("transaction complete");
		}
	})
	again();
}

function again () {
	console.log("again function");
	connection.end();
	// inqurier.prompt([
	// 	{

	// 	}
	// ])
}








