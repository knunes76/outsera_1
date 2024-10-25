const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const fs = require('fs');
const Papa = require('papaparse');
const csv = require('csv-parser');
const { errorMonitor } = require('events');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS movies (
        year INTEGER,
        title TEXT,
        studios TEXT,
        producers TEXT,
        winner TEXT
    )`);
});

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM movies', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },
    getMaxInterval: () => {
        return new Promise((resolve, reject) => {

            // Max
            db.all(`WITH RankedAwards AS (
                SELECT 
                    producers,
                    year,
                    LAG(year) OVER (PARTITION BY producers ORDER BY year) AS previous_year
                FROM 
                    movies
                ),
            AwardIntervals AS (
                SELECT 
                    producers,
                    year,
                    previous_year,
                    year - previous_year AS interval
                FROM 
                    RankedAwards
                WHERE 
                    previous_year IS NOT NULL
            )
            SELECT 
                producers,
                interval,
                previous_year as previousWin,
                year as followingWin
            FROM AwardIntervals
            WHERE  interval = (SELECT MAX(interval) as max_interval FROM AwardIntervals GROUP BY producers order by max_interval DESC limit 1)
            GROUP BY producers
            ORDER BY producers;`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },
    getMinInterval: () => {
        return new Promise((resolve, reject) => {

            // Min
            db.all(`WITH RankedAwards AS (
                SELECT 
                    producers,
                    year,
                    LAG(year) OVER (PARTITION BY producers ORDER BY year) AS previous_year
                FROM 
                    movies
                ),
            AwardIntervals AS (
                SELECT 
                    producers,
                    year,
                    previous_year,
                    year - previous_year AS interval
                FROM 
                    RankedAwards
                WHERE 
                    previous_year IS NOT NULL
            )
            SELECT 
                producers,
                year,
                previous_year,
                interval,
                count(*) as qtde
            FROM AwardIntervals
            WHERE  interval = (SELECT MIN(interval) as min_interval FROM AwardIntervals GROUP BY producers order by min_interval limit 1)
            GROUP BY producers
            HAVING qtde = 2
            ORDER BY producers;`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    insert: (movie) => {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(`INSERT INTO movies (year,title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)`);

            stmt.run(movie.year, movie.title, movie.studios, movie.producers, movie.winner, function (err) {
                if (err) {
                    console.log('error insert', err);
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
            stmt.finalize();
        });
    },

    loadFromCSV : () => {
        let error;
        return new Promise(async (resolve, reject) => {
            // Load CSV file contents
            const fileData = fs.readFileSync('./data/movielist.csv', 'utf8')
             
            
            const result = Papa.parse(fileData, {
                header: true,
                delimiter: ';',
                skipEmptyLines: true
            });
             
            // Insert local database
            result.data.forEach(async (movie, index) => {
                try {
                    const stmt = db.prepare(`INSERT INTO movies (year,title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)`);
                    stmt.run(movie.year, movie.title, movie.studios, movie.producers, movie.winner, function (err) {
                        if (err) {
                            reject(err);
                        }
                    });
                    stmt.finalize();
                  
                } catch (err) {
                    reject(err);
                }
            });

            resolve(result.data);
           
        });

    }


};
