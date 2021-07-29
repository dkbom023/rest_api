const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "one" },
  { id: 2, name: "two" },
  { id: 3, name: "three" },
];

app.get("/", (req, res) => {
  res.send("hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    // res.status(400).send(result.error);
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // if (!req.body.name || req.body.name.length < 3) {
  //   res.status(400).send("name should have more than 3 letter");
  //   return;
  // }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("id was not found!!");
    return;
  }
  const result = validateCourse(req.body);
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

const validateCourse = (course) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
};

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("id was not found!!");
    return;
  }
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("id was not found!!");
    return;
  }
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

app.listen(3000, () => console.log("start at 3000 ..."));
