const movieService = require('../services/movieService');

exports.getMovies = async (req, res) => {
    try {
        const movies = await movieService.fetchMovies();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
};

exports.addMovie = async (req, res) => {
    try {
        const newMovie = req.body;
        await movieService.addMovie(newMovie);
        res.status(201).json({ message: 'Movie added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add movie' });
    }
};

exports.addAllMovies = async(req, res) => {
    fs.createReadStream('data/movielist.csv')
    .pipe(csv({ separator: ';' })) // delimit with ';'
    .on('data',async (row) =>{
        try {
            await movieService.addMovie(row);
            res.status(201).json({ message: 'Movie added successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add movie' });
        }
    })
    .on('end', () => {
        console.log('Todos os filmes foram inseridos no banco de dados.');
    });
}

exports.getWinInterval = async (req, res) => {
    try {
        const winInterval = await movieService.getWinInterval();
        console.log(winInterval);
        res.status(200).json(winInterval);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch intervals' });
    }
};
