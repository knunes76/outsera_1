const express = require('express');
const movieRoutes = require('./routes/movieRoutes');
const app = express();

// Middleware para processar JSON
app.use(express.json());

//  Movies routes
app.use('/api/movies', movieRoutes);

// Definir a porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
