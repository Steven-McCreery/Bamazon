
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
var letters = /[A-Za-z]/;

connection.connect(function(err) {
	if (err) {
		throw err;
	} else {
		console.log("Connected!");
		roleSelect();
	}
})

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

var customer = {

	renderTable() {

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
				// validate: function(amount) {
				// 	if (amount > ) {}
				// }
			}
		]).then(function(buy) {
			productID = buy.productID;
			buyQty = buy.purchaseQty;
			for (var i = 0; i < table.rows.length; i ++) {
				var thing = table.rows[i];
				// console.log(thing["Product Id"]);
				if (thing["Product Id"] == productID) {
					console.log("available qty of product ", productID, " is: ", thing["Available Qty"]);
				} if (thing["Available Qty"] < buyQty) {
					console.log("You have selected a greater amount than currently exists in stock, please try again.");
					customer.renderTable();
					return;
				}
			}
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
				console.log("product being requested is:", productID);
				console.log("quantity of product being requested is: ", buyQty);
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
				name: "buyAgain",
				default: true
			}
		]).then(function(buyAgain) {
			if (buyAgain === true) {
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
					if (roleReturn === true) {
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

// roleSelect();



