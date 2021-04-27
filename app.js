const Joi = require('joi');
const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const { json } = require('express');
const { min } = require('joi/lib/types/array');

const host = '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, function() 
{
    console.log("Server listening on port 3000");
});

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))

const courses = [];
const students = [];

//home page (forms)
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/homepage.html')
});

// Create Course
app.get('/web/courses/create',(req,res)=>{
    res.sendFile(__dirname+'/createCourse.html')
});

// to get all courses
app.get('/api/courses', (req, res) => 
{
    res.send(courses);
});

// to get single course
app.get('/api/courses/:id', (req, res) => 
{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    res.send(course);
});

//create course
app.post('/api/courses/create',(req,res)=>
{
    const {error} = validateCourse(req.body);
    if (error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id : courses.length +1,
        coursename : req.body.coursename,
        coursecode : req.body.coursecode,
        coursedescription: req.body.coursedescription
    };
    courses.push(course);
    CourseView(course,res)
    res.send(course);
});

// update course
app.put('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    const { error } = validateCourse(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course 
    // Return the updated course
    course.coursename = req.body.coursename;
    course.coursecode = req.body.coursecode;
    course.coursedescription = req.body.coursedescription;
    res.send(course);
});

// Deleting a course
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course by id
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 course not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});

function validateCourse(course)
{
    const schema = 
    {
        coursename : Joi.string().min(5).required(),
        coursecode : Joi.string().regex(/\b[A-Za-z]{3}[0-9]{3}\b/).required(),
        coursedescription : Joi.string().max(200).allow('').optional()
    };
    return Joi.validate(course,schema);
}

function CourseView(course,res)
{
    res.send({'Course Name': course.coursename,
    'Course Code': course.coursecode,
    'Course ID': course.id,
    'Course Description': course.coursedescription});
}



/////// students/////////

// to get all students
app.get('/api/students', (req, res) => 
{
    res.send(students);
});

// to get single students
app.get('/api/students/:id', (req, res) => 
{
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }
    res.send(student);
});

app.get('/web/students/create',(req,res)=>{
    res.sendFile(__dirname+'/createStudent.html')
});

//create student
app.post('/api/students/create',(req,res)=>
{
    const {error} = validatestudent(req.body);
    if (error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }

    const student = {
        id : students.length +1,
        stdname : req.body.stdname,
        stdcode : req.body.stdcode,
    };
    students.push(student);
    StudentView(student,res)
    res.send(student);
});

// update student
app.put('/api/students/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    const { error } = validatestudent(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course 
    // Return the updated course
    student.stdname = req.body.stdname;
    student.stdcode = req.body.stdcode;
    res.send(student);
});

// Deleting a student
app.delete('/api/students/:id', (req, res) => {
    // Look up the student by id
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 course not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }

    // Delete
    const index = students.indexOf(student);
    students.splice(index, 1);

    // Return the same course
    res.send(student);
});

function validatestudent(student)
{
    const schema = 
    {
        stdname : Joi.string().regex(/^[a-zA-Z-']+$/i).required(),
        stdcode : Joi.string().length(7).required()
    };
    return Joi.validate(student,schema);
}

function StudentView(student,res)
{
    res.send({'Course Name': student.stdname,
    'Course Code': student.stdcode,
    'Course ID': student.id});
}

