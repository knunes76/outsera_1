const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();

// Route to list movies
router.get('/', movieController.getMovies);

// Route to add movie
router.post('/', movieController.addMovie);

// Route to list movies
router.get('/wininterval', movieController.getWinInterval);

module.exports = router;
