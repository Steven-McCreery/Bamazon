
// pulling in inquirer
var inquirer = require("inquirer");

// easy-table setup
var Table = require("easy-table");
var table = new Table;

// mysql setup and connection parameters
var mysql = require("mysql");
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "!@SQLm3.123",
	database: "bamazon_db"
})

// setting variables that will be used later in the purchasing of items
var productID = 0;
var buyQty = 0;
var selectedQty = 0;
var remainingQty = 0;
var pricing = 0;
var costs = 0;
var letters = /[A-Za-z]/;

// connecting to mysql and then going into the function selector
connection.connect(function(err) {
	if (err) {
		throw err;
	} else {
		console.log("Connected!");
		roleSelect();
	}
})

// allows user to select role to pursue within app
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
				customer.renderTable();
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

// customer object containing methods for cli interaction
var customer = {

	// pulls table data from mysql db and renders it
	renderTable() {

		productID = 0;
		buyQty = 0;
		selectedQty = 0;
		remainingQty = 0;

		connection.query("SELECT * FROM products", function(err, res) {
			if (err) {
				throw err;
			} else {
				table = new Table;
				console.log("================================================");
				console.log("Welcome to Bamazon! Thanks for shopping with us!");
				console.log("================================================");
				res.forEach(function(t) {
					table.cell('Product Id', t.item_id)
					table.cell('Description', t.product_name)
					table.cell('Department', t.department_name)
					table.cell('Price, USD', t.price, Table.number(2))
					table.cell('Available Qty', t.stock_quantity)
					table.newRow()
				});
				console.log(table.toString());
				customer.itemSelect(table);
			}
		})
	},

	// now that user sees what is available, they can choose what to buy (includes validation steps)
	itemSelect(table) {

		inquirer.prompt([
			{
				type: "input",
				message: "Please enter the Product ID Number of the item you would like to purchase.",
				name: "productID",
				validate: function(id) {
					if (id.length < 1) {
						console.log(" Please select an item.");
						return false;
					} else if (id < 1) {
						console.log(" Please select an item.");
						return false;
					} else if (id.length > 2) {
						console.log(" Please select a valid product.");
						return false;
					} else if (letters.test(id)) {
						console.log(" Please select an item number.");
						return false;
					} else if (id > table.rows.length) {
						console.log(" Please select a valid item number.");
						return false;
					} else {
						return true;
					}
				}
			},
			{
				type: "Input",
				message: "Please select the quantity you would like to purchase.",
				name: "purchaseQty",
			}
		]).then(function(buy) {
			if (buy.purchaseQty <= 0) {
				console.log(" Please select a quantity greater than zero stock quantity to purchase.");
				customer.renderTable();
				return;
			} else if (buy.purchaseQty === letters) {
				console.log(" Please select a quantity to purchase.");
				customer.renderTable();
				return;
			} else {
				productID = buy.productID;
				buyQty = buy.purchaseQty;
				for (var i = 0; i < table.rows.length; i++) {
					selectedQty = table.rows[i];
					if (selectedQty["Product Id"] == productID) {
						if (selectedQty["Available Qty"] < buyQty) {
							console.log(" You have selected a greater amount than currently exists in stock, please try again.");
							customer.renderTable();
							return;
						}
						pricing = selectedQty["Price, USD"];
						selectedQty = selectedQty["Available Qty"];
						customer.transact();
						// return selectedQty;
					} 
				}
			}
		})
	},

	// takes the user's input in the prior step and makes the adjustments to the mysql table data
	transact() {
		remainingQty = (selectedQty - buyQty);
		costs = buyQty * pricing;
		connection.query("UPDATE products SET ? WHERE ?",
		[
			{
				stock_quantity: remainingQty
			},
			{
				item_id: productID
			}
		],
		function(error, response) {
			if (error) {
				throw error;
			} else {
				console.log("Your completed transaction cost: $",costs);
				customer.again();
			}
		});
	},

	// once the customer's transaction is completed they can make another transaction or enter another role
	again () {
		inquirer.prompt([
			{
				type: "confirm",
				message: "Would you like to make another purchase?",
				name: "buyAgain",
				default: true
			}
		]).then(function(buyAgain) {
			if (buyAgain.buyAgain) {
				customer.renderTable();
				return;
			} else {
				inquirer.prompt([
				{
					type: "confirm",
					message: "Would you like to switch to another functional role?",
					name: "roleReturn",
					default: true
				}
				]).then(function(roleReturn) {
					if (roleReturn.roleReturn) {
						roleSelect();
						return;
					} else {
						console.log("Thanks for visiting!");
						connection.end();
					}
				})
			}
		})
	}
}


