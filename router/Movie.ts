import { Router } from 'express';
import { Movie } from '../Model/Schema/typescripte/Movie';

export const movies = Router();

movies.post('/', async (req, res, next) => {
    try {
        console.log("create a movies");
        console.log(req.body);
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (e) {
        res.send("error");
    }
});

movies.get('/', async (req, res, next) => {
    try {
        res.json(await Movie.scope(req.query['scope']).findAll());
    } catch (e) {
        next(e);
    }
});

movies.get('/:id', async (req, res, next) => {
    try {
        const movie = await Movie.scope(req.query['scope']).findByPk(req.params['id']);
        res.json(movie);
    } catch (e) {
        next(e);
    }
});

movies.put('/:id', async (req, res, next) => {
    try {
        await Movie.update<Movie>(req.body, { where: { id: req.params['id'] } });
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
});