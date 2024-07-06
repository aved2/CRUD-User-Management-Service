const Customer = require("../models/Customer");
const mongoose = require("mongoose");

// GET / Customer Homepage
exports.homepage = async (req, res) => {
    const messages = await req.consumeFlash('info');

    const locals = {
        title: "User Management",
        description: "User Management System",
    };

    let perPage = 10;
    let page = req.query.page || 1;

    try {
        const customers = await Customer.aggregate([{ $sort: {updatedAt: -1}}])
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec();
        const count = await Customer.countDocuments();

        res.render("index", { locals, messages, customers, current: page, pages: Math.ceil(count/perPage)});
    } catch (err) {
        console.log(err);
    }
    
}

// GET / Customer Homepage
exports.about = async (req, res) => {
    try {
        const locals = {
            title: "About",
            description: "User Management System",
        };

        res.render("about", { locals });
    } catch (err) {
        console.log(err);
    }
    
}


// GET / Add Customer
exports.addCustomer = async (req, res) => {

    const locals = {
        title: "Add Customer",
        description: "Add Customer",
    };

    res.render("customer/add", { locals });
}

// POST / Create New Customer
exports.postCustomer = async (req, res) => {

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        details: req.body.details,
    });

    try {
        await Customer.create(newCustomer);
        await req.flash('info', 'Customer added successfully');
        res.redirect("/");
    }
    catch (err) {
        console.log(err);
    }
}


// GET / View Customer
exports.viewCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({_id: req.params.id});
        const locals = {
            title: "View Customer Data",
            description: "Add Customer",
        };

        res.render("customer/view", { locals, customer });
    }
    catch (err) {
        console.log(err);
    }
}


// GET / Edit Customer Details
exports.editCustomer = async (req, res) => {

    try {
        const customer = await Customer.findOne({_id: req.params.id});
        const locals = {
            title: "Edit Customer",
            description: "Add Customer",
        };
    
        res.render("customer/edit", { locals, customer });
    } catch (err) {
        console.log(err);
    }

}

// PUT / Update Customer Details
exports.updateCustomer = async (req, res) => {

    try {
        await Customer.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            details: req.body.details,
            updatedAt: Date.now()
        });
    
        res.redirect(`/view/${req.params.id}`);
    } catch (err) {
        console.log(err);
    }

}

// DELETE / Delete Customer
exports.deleteCustomer = async (req, res) => {

    try {
        await Customer.deleteOne({_id: req.params.id});
        await req.flash('info', 'Customer deleted successfully');
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }

}

// GET / Search for Customer
exports.searchCustomers = async (req, res) => {
    try {
        let searchQuery = req.body.searchTerm;
        const searchStripped = searchQuery.replace(/[^a-zA-Z0-9]/g, '');

        const locals = {
            title: "Search for Customer",
            description: "Search for Customer",
        };
        
        const customers = await Customer.find({
            $or: [
                {firstName: { $regex: new RegExp(searchStripped, "i") }},
                {lastName: { $regex: new RegExp(searchStripped, "i") }},
            ]
        });
        res.render("search", { customers, locals });
    } catch (err) {
        console.log(err);
    }

}