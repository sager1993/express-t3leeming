// Express docs: http://expressjs.com/en/api.html
const express = require("express");
// Passport docs: http://www.passportjs.org/docs/
const passport = require("passport");

// pull in Mongoose model for courses
const Course = require("../models/course");

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require("../../lib/custom_errors");

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404;
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership;

// this is middleware that will remove blank fields from `req.body`, e.g.
// { course: { title: '', text: 'foo' } } -> { course: { text: 'foo' } }
const removeBlanks = require("../../lib/remove_blank_fields");
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate("bearer", { session: false });

// instantiate a router (mini app that only handles routes)
const router = express.Router();

// INDEX
// GET /courses
// View All Courses
router.get("/courses", requireToken, (req, res, next) => {
  Course.find()
    .then(courses => res.status(200).json({ courses: courses }))
    .catch(next);
});

// INDEX
// GET /mycourses
router.get("/mycourses", requireToken, (req, res, next) => {
  // Option 1 get user's courses
  Course.find({ owner: req.user.id })
    .then(courses => res.status(200).json({ courses: courses }))
    .catch(next);

  // // Option 2 get user's courses
  // // must import User model and User model must have virtual for courses
  // User.findById(req.user.id)
  // .populate('courses')
  // .then(user => res.status(200).json({ courses: user.courses }))
  // .catch(next)
});

// SHOW
// GET /courses/5a7db6c74d55bc51bdf39793
router.get("/courses/:id", requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Course.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "course" JSON
    .then(course => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      // requireOwnership(req, course);

      res.status(200).json({ course: course.toObject() });
    })
    // if an error occurs, pass it to the handler
    .catch(next);
});

// CREATE
// POST /courses
router.post("/courses", requireToken, (req, res, next) => {
  // set owner of new course to be current user
  req.body.course.owner = req.user.id;

  Course.create(req.body.course)
    // respond to succesful `create` with status 201 and JSON of new "course"
    .then(course => {
      res.status(201).json({ course: course.toObject() });
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next);
});

// UPDATE
// PATCH /courses/5a7db6c74d55bc51bdf39793
router.patch("/courses/:id", requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.course.owner;

  Course.findById(req.params.id)
    .then(handle404)
    .then(course => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, course);

      // pass the result of Mongoose's `.update` to the next `.then`
      return course.update(req.body.course);
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.status(204).end())
    // if an error occurs, pass it to the handler
    .catch(next);
});

// DESTROY
// DELETE /courses/5a7db6c74d55bc51bdf39793
router.delete("/courses/:id", requireToken, (req, res, next) => {
  Course.findById(req.params.id)
    .then(handle404)
    .then(course => {
      // throw an error if current user doesn't own `course`
      requireOwnership(req, course);
      // delete the course ONLY IF the above didn't throw
      course.remove();
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next);
});

module.exports = router;
