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
router.get("/api/courses", requireToken, (req, res, next) => {
  Course.find()
    .then(courses => res.status(200).json({ courses: courses }))
    .catch(next);
});

// INDEX
// GET /mycourses
router.get("/api/mycourses", requireToken, (req, res, next) => {
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

/**
 * Action:      SEED
 * Method:      GET
 * URI:         /api/courses/seed
 * Description: seed courses to the database
 */
router.get("/api/courses/seed", requireToken, (req, res) => {
  req.body.comment.owner = req.user.id;
  Course.insertMany(
    [
      {
        title: "Acoustics of Speech and Hearing",
        url:
          "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-551j-acoustics-of-speech-and-hearing-fall-2004/",
        img:
          "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-551j-acoustics-of-speech-and-hearing-fall-2004/6-551jf04.jpg",
        decription:
          "The Acoustics of Speech and Hearing is an H-Level graduate course that reviews the physical processes involved in the production, propagation and reception of human speech. Particular attention is paid to how the acoustics and mechanics of the speech and auditory system define what sounds we are capable of producing and what sounds we can sense.",
        owner: req.user.id
      },
      {
        title: "A Gentle Introduction to Programming Using Python",
        url:
          "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-189-a-gentle-introduction-to-programming-using-python-january-iap-2011/",
        img:
          "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-189-a-gentle-introduction-to-programming-using-python-january-iap-2011/6-189iap11.jpg",
        decription:
          "This course will provide a gentle, yet intense, introduction to programming using Python for highly motivated students with little or no prior experience in programming. The course will focus on planning and organizing programs, as well as the grammar of the Python programming language.",
        owner: req.user.id
      },
      {
        title: "Adobe Dreamweaver CC",
        url: "https://alison.com/course/adobe-dreamweaver-cc",
        img:
          "https://cdn0.iconfinder.com/data/icons/logos-and-brands-adobe/512/19_Dreamweaver_Adobe_logo_logos-512.png",
        decription:
          "Learn how to use Adobe Dreamweaver CC - a web development tool for MacOS and Windows operating systems – with this free online course! You will learn how to use Adobe Dreamweaver CC to build websites with a drag and drop interface and/or html and css coding interface. So, why wait? Start learning how to create websites and improve your web development skills today!",
        owner: req.user.id
      },
      {
        title: "21 Days to Building a Web Business",
        url: "https://alison.com/course/21-days-to-building-a-web-business",
        img:
          "https://cdn01.alison-static.net/courses/242/alison_courseware_intro_242.jpg",
        decription:
          "In this day and age, a strong, attractive website is essential for selling products or services to a wide audience. This 21 Steps To Building A Web Business online course will teach you the necessary skills and techniques needed to create a website for a successful online business. In a clear and simple manner, you will learn about domain name, web server, website host, and fundamental web building tools that will get your website up and running.",
        owner: req.user.id
      },
      {
        title: "Reinforcement Learning Specialization",
        url: "https://www.coursera.org/specializations/reinforcement-learning",
        img:
          "https://blog.coursera.org/wp-content/uploads/2019/07/UofA-RL-FB-1024x536.png",
        decription:
          "Master the Concepts of Reinforcement Learning. Implement a complete RL solution and understand how to apply AI tools to solve real-world problems.",
        owner: req.user.id
      },
      {
        title: "TensorFlow: Data and Deployment",
        url:
          "https://www.coursera.org/specializations/tensorflow-data-and-deployment",
        img: "https://pbs.twimg.com/media/EIJKo86XkAAme32.jpg",
        decription:
          "Continue developing your skills in TensorFlow as you learn to navigate through a wide range of deployment scenarios and discover new ways to use data more effectively when training your model.",
        owner: req.user.id
      },
      {
        title: "A Workshop on Geographic Information Systems",
        url:
          "https://ocw.mit.edu/courses/urban-studies-and-planning/11-520-a-workshop-on-geographic-information-systems-fall-2005/",
        img:
          "https://ocw.mit.edu/courses/urban-studies-and-planning/11-520-a-workshop-on-geographic-information-systems-fall-2005/11-520f05.jpg",
        decription:
          "This class uses lab exercises and a workshop setting to help students develop a solid understanding of the planning and public management uses of geographic information systems (GIS). The goals are to help students: acquire technical skills in the use of GIS software; acquire qualitative methods skills in data and document gathering, analyzing information, and presenting results; and investigate the potential and practicality of GIS technologies in a typical planning setting and evaluate possible applications.",
        owner: req.user.id
      },
      {
        title: "Accounting Theory",
        url: "https://alison.com/course/accounting-theory",
        img:
          "https://cdn01.alison-static.net/courses/610/alison_courseware_intro_610.jpg",
        decription:
          "This free online accounting course will introduce you to the body of theory underlying accounting procedures. It puts the core practices and principles, covered in the previous courses, into a framework of theoretical concepts. It will teach you about the theory behind the accounting process and will help you make decisions in diverse accounting situations as it provides a logical framework for accounting practice.",
        owner: req.user.id
      },
      {
        title: "Accounting and Its Use in Business Decisions",
        url:
          "https://alison.com/course/accounting-and-its-use-in-business-decisions",
        img:
          "https://cdn01.alison-static.net/courses/559/alison_courseware_intro_559.jpg",
        decription:
          "Some people may find Accounting complicated and overwhelming. But with the right training, accounting can become not only interesting but also very important for every aspect of a business. This free online Accounting course will give learners of any background a strong understanding of important accounting practices, and will show you how to use accounting knowledge to your advantage when making important business decisions.",
        owner: req.user.id
      },
      {
        title: "Introduction to Corporate Finance",
        url: "https://www.coursera.org/learn/wharton-finance",
        img:
          "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/4f/d297b0e99111e6a3f04f721ab5825e/Finance_Coursera_Course_Thumb.png?auto=format%2Ccompress&dpr=2.625",
        decription:
          "This course provides a brief introduction to the fundamentals of finance, emphasizing their application to a wide variety of real-world situations spanning personal finance, corporate decision-making, and financial intermediation. Key concepts and applications include: time value of money, risk-return tradeoff, cost of capital, interest rates, retirement savings, mortgage financing, auto leasing, capital budgeting, asset valuation, discounted cash flow (DCF) analysis, net present value, internal rate of return, hurdle rate, payback period.",
        owner: req.user.id
      },
      {
        title: "Academic Integrity: Values, Skills, Action",
        url: "https://www.futurelearn.com/courses/academic-integrity",
        img:
          "https://ugc.futurelearn.com/uploads/images/e9/03/e903f210-2e65-4bd9-bbd2-67e80e17a0d1.jpg",
        decription:
          "This course will explore academic integrity and how you can demonstrate it in your work, study and research at university.",
        owner: req.user.id
      },
      {
        title: "Basic German Language Skills",
        url:
          "http://www.myeducationpath.com/courses/3862/basic-german-language-skills.htm",
        img:
          "https://cdn01.alison-static.net/courses/567/alison_courseware_intro_567.jpg",
        decription:
          "German is spoken by nearly one hundred million people in central European countries such as Germany, Austria, Switzerland, Luxembourg and Liechtenstein, and is the most widely-spoken first language in the European Union. Germany is internationally recognised as the industrial and economic powerhouse of Europe, so a working knowledge of German is essential for professionals in areas such as business, finance, economics and politics. In this free online German language course you will be introduced to basic German vocabulary and grammar. You will learn about times of the day, colours, numbers, the alphabet, and important verbs. This free online German language course will be of great interest to all professionals who would like to begin learning German, and to all learners who would like to be introduced to this very important European language.",
        owner: req.user.id
      },
      {
        title: "Basic Science: Understanding Numbers",
        url: "https://www.futurelearn.com/courses/understanding-numbers",
        img:
          "https://ugc.futurelearn.com/uploads/images/c2/57/c2574880-125e-464d-a23c-ee56d772dc9c.jpg",
        decription:
          "This course explains how you can use numbers to describe the natural world and make sense of everything from atoms to oceans.",
        owner: req.user.id
      }
    ],
    (error, courses) => {
      if (!error) {
        res.status(200).json({ courses: courses });
      } else {
        res.status(500).json({ error: error });
      }
    }
  );
});

// SHOW
// GET /courses/5a7db6c74d55bc51bdf39793
router.get("/api/courses/:id", requireToken, (req, res, next) => {
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
router.post("/api/courses", requireToken, (req, res, next) => {
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
router.patch(
  "/api/courses/:id",
  requireToken,
  removeBlanks,
  (req, res, next) => {
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
  }
);

// DESTROY
// DELETE /courses/5a7db6c74d55bc51bdf39793
router.delete("/api/courses/:id", requireToken, (req, res, next) => {
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
