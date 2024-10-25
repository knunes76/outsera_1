const axios = require('axios');
const movieModel = require('../models/movie');

// Função que faz chamada à API externa
exports.fetchMovies = async () => {
    try {
        // Load movies from csv
        await movieModel.loadFromCSV();
        const response = await movieModel.getAll();
        return response;
        // const response = await axios.get('http://localhost:3000/movies');
        // const movies = response.data;

        // return movies;
    } catch (error) {
        throw new Error('Error fetching movies from API');
    }
};

exports.addMovie = async (movie) => {
    try {
        await movieModel.insert(movie);
    } catch (error) {
        throw new Error('Error adding movie');
    }
};

exports.getWinInterval = async () => {
    try {
        let dataMin = await movieModel.getMinInterval();
        let dataMax = await movieModel.getMaxInterval();
    
//console.log(JSON.parse(JSON.stringify(dataMin)));
console.log(JSON.parse(JSON.stringify(dataMin)));

        return [{ min: JSON.stringify(dataMin), max: JSON.stringify(dataMax)}];
    } catch (error) {
        throw new Error('Error get win interval movie');
    }
};
