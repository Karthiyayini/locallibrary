var Customer = require('../models/customer');
var Author = require('../models/author');
var async = require('async');
var Book = require('../models/book');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Display list of all customers.
exports.customer_list = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Customer list');
};

exports.facebookData = function(req, res, next){
        console.log(req.session.passport.user)
        var fb_id = req.session.passport.user.id;
        var name = req.session.passport.user.displayName;
        var email = req.session.passport.user.id + "@email.com";
        



        var customer = new Customer(
                {
                    first_name: name,
                    last_name: '',
                    email : email,
                    fb_id : fb_id
                });
            customer.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new customer record.
                // req.session.email = req.body.email;
                req.session.loggedin = true;
                res.redirect(customer.url);
            });



};
// Display detail page for a specific customer.
exports.customer_detail = function(req, res, next) {
     Customer.findById(req.params.id)
    .exec(function (err, customer) {
      if (err) { return next(err); }
      if (customer==null) { // No results.
          var err = new Error('Customer not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('customer_detail', { title: 'Profile:', customer:  customer});
    })
};

 
// Display customer create form on GET.
exports.customer_create_get = function(req, res, next) {
    res.render('customer_add', { title: 'Create Customer'});
};

// Handle customer create on POST.
exports.customer_create_post = [

    // Validate fields.
    body('fname').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('lname').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
   

    // Sanitize fields.
    sanitizeBody('fname').trim().escape(),
    sanitizeBody('lname').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('customer_add', { title: 'Create Customer', customer: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Customer object with escaped and trimmed data.
            var customer = new Customer(
                {
                    first_name: req.body.fname,
                    last_name: req.body.lname,
                    email: req.body.email,
                    password : req.body.password
                });
            customer.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new customer record.
                // req.session.email = req.body.email;
                // req.session.loggedin = true;
                res.redirect(customer.url);
            });
        }
    }
];


exports.customer_login_get = function(req, res, next) {
    res.render('customer_login', { title: 'Login Customer'});
};

exports.customer_login_post = [


 // Validate fields.
    body('email').isLength({ min: 1 }).trim().withMessage('Email must be specified.'),
        
    // body('password').isLength({ min: 1 }).trim().withMessage('Last name must be specified.'),
        

    // Sanitize fields.
    sanitizeBody('email').trim().escape(),
    

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('customer_login', { title: 'Log in', customer: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Customer object with escaped and trimmed data.
            var customer = new Customer(
                {
                    
                    email: req.body.email,
                    password : req.body.password
                });
                Customer.findOne({email: req.body.email, password :req.body.password})
                .exec(function (err, customer) {
                  if (err) { return next(err); }
                  if (customer==null) { // No results.
                      var err = new Error('Customer not found');
                      err.status = 404;
                      return next(err);
                    }
                  // Successful, so render.
                  res.render('customer_detail', { title: 'Profile:', customer:  customer});
                })
      
        }
    }
];

// exports.customer_forget_password_get = function(req, res, next) {
//      res.send('NOT IMPLEMENTED: customer fr GET');

// };

// exports.customer_forget_password_post = function(req, res, next) {
//     res.send('NOT IMPLEMENTED: customer fr GET');

// };


// Display customer delete form on GET.
exports.customer_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: customer delete GET');
};

// Handle customer delete on POST.
exports.customer_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: customer delete POST');
};

// Display customer update form on GET.
exports.customer_update_get = function(req, res, next) {
    Customer.findById(req.params.id, function (err, customer) {
        if (err) { return next(err); }
        if (customer == null) { // No results.
            var err = new Error('Customer not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('customer_edit', { title: 'Update Customer', customer: customer });

    });
};

// Handle customer update on POST.
exports.customer_update_post = [

// Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('last_name').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
   

    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('last_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
      // Create an Customer object with escaped and trimmed data.
        var customer = new Customer(
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                _id: req.params.id
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('customer_edit', { title: 'Edit Profile', customer: req.body, errors: errors.array() });
            return;
        }
        else {
          // Data from form is valid. Update the record.
            Customer.findByIdAndUpdate(req.params.id, customer, {}, function (err, thecustomer) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(thecustomer.url);
            });
        }
    }

];