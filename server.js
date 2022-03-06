const express = require('express');
const { animals } = require('./data/animals.json');
// const PORT = 3002;
const MYPORT = process.env.PORT || 3002;
// To instantiate the server
const app = express();

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // the filteredResults array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  // return the filtered results:
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

// parameter-1: a string that describes the route the client will have to fetch from
// parameter-2: callback function that will execute every time that route is accessed with a GET request
app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.get('/api/animals', (req, res) => { // res.json(animals); //res parameter (short for response) to send the string Hello! to our client.
    let results = animals;
    console.log('-----------------')  
    console.log(req.query) // print { name: 'Erica' }
    console.log("`````````````````")  
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results); // send the result to the browser
    // console.log(results); // print the json data
});

// need to use listen() method onto our server to make our server listen
app.listen(MYPORT, () => {
  console.log(`API server now on port ${MYPORT}`);
  console.log(`Example app listening at http://localhost:${MYPORT}/api/animals`);
  console.log(`Example app listening at https://mercuryktzookeeper.herokuapp.com/api/animals`);
  console.log ('---------------');
  console.log (process.env.PORT);
 });