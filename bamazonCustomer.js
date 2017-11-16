
// pulling in inquirer
var inquirer = require("inquirer");

// easy-table setup
var Table = require("easy-table");
var table = new Table;

var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "!@SQLm3.123",
	database: "bamazon_db"
})

var productID = 0;
var buyQty = 0;

function roleSelect() {
	inquirer.prompt([
	{
		type: "list",
		message: "Please select your choice!",
		choices: ["Buy an Item", "Enter Manager View", "Enter Supervisor View"],
		name: "option"
	}
	]).then(function(choice){
		switch (choice.option) {
			case "Buy an Item":
				console.log("Customer View");
				customer.begin();
				return;

			case "Enter Manager View":
				console.log("Manager View");
				roleSelect();
				return;

			case "Enter Supervisor View":
				console.log("Supervisor View");
				roleSelect();
				return;
		}
	});
};

var customer = {


	begin() {
		connection.end();
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

						// easy-table rendering method
						res.forEach(function(t) {
							table.cell('Product Id', t.item_id)
							table.cell('Description', t.product_name)
							table.cell('Department', t.department_name)
							table.cell('Price, USD', t.price, Table.number(2))
							table.cell('Available Qty', t.stock_quantity)
							table.newRow()
						});
						console.log(table.toString());
						customer.itemSelect();
					}
				});
				// setTimeout()
				
				// connection.end();
			}
		})
	},

	itemSelect() {
		inquirer.prompt([
			{
				type: "input",
				message: "Please enter the Product ID Number of the item you would like to purchase.",
				name: "productID",
				validate: function(id) {
					if (id.length < 1) {
						console.log("Please select an item.");
						return false;
					} else if (id.length > 2) {
						console.log("Please select a valid product.");
						return false;
					}
					// else if () {}
					else {
					// return true;
						
						return true;
					}
				}
			},
			{
				type: "Input",
				message: "Please select the quantity you would like to purchase.",
				name: "purchaseQty",
				// validate: function(amount) {
				// 	if (amount > ) {}
				// }
			}
		]).then(function(buy) {
			productID = buy.productID;
			console.log(productID);
			buyQty = buy.purchaseQty;
			customer.transact();
		})
	},

	transact() {
		console.log("transact function");
		connection.query("SELECT * FROM products", function(err, res) {
			if (err) {
				throw err;
			} else {
				console.log("transaction complete");
				customer.again();
			}
		})
	},

	again () {
		console.log("again function");
		inquirer.prompt([
			{
				type: "confirm",
				message: "Would you like to make another purchase?",
				name: "productID",
				default: true
			}
		]).then(function(buy) {
			if (buy.productID) {
				connection.end();
				roleSelect();
			} else {
				console.log("Thanks for visiting!");
				connection.end();
			}
		})
	},
}

roleSelect();



