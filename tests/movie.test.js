const request = require('supertest');
const app = require('../app');

describe('Movie API Integration Test', () => {
    it('should fetch movies from API and save to DB', async () => {
        const res = await request(app).get('/api/movies');
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should add a new movie', async () => {
        
        const movie = { year : 1980, 
            title: `Can't Stop the Music`, 
            studios:  `Associated Film Distribution`,
            producers: `Allan Carr`,
            winner : `yes`
         };
        const res = await request(app).post('/api/movies').send(movie);
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe('Movie added successfully');
    });

    it('Win Interval', async () => {
        const res = await request(app).get('/api/movies/wininterval');
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
