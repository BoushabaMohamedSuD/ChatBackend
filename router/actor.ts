export { };
import express from 'express';

import { Actor } from '../Model/Schema/typescripte/Actor';
import { MovieActor } from '../Model/Schema/typescripte/MovieActor';
import { Genre } from '../Model/Schema/typescripte/Genre';


const router = express.Router();
router.post('/', async (req, res, next) => {
    console.log('post some actors');
    try {
        const actor = await Actor.create(req.body);
        res.status(201).json(actor);
    } catch (e) {
        res.send("error");
        console.log(e);
    }
});

router.post('/:id/movies/:movieId', async (req, res, next) => {
    console.log("create association");
    console.log("id: " + req.params['id']);
    console.log("Moviesid: " + req.params['movieId']);
    try {
        await MovieActor.create({
            actorId: req.params['id'],
            movieId: req.params['movieId']
        });
        res.sendStatus(200);
    } catch (e) {
        res.send("error");
        console.log(e);
    }
});

router.get('/', async (req, res, next) => {
    console.log('ok get samo of those acters');
    try {
        console.log("get all actors");
        console.log(req.query['scope']);
        res.json(await Actor.scope(req.query['scope']).findAll());

    } catch (e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const actor = await Actor.scope(req.query['scope']).findByPk(req.params['id']);
        res.json(actor);
    } catch (e) {
        next(e);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        await Actor.update(req.body, { where: { id: req.params['id'] } });
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
});
router.put('/name/:id/:name', async (req, res, next) => {
    try {
        const actor = await Actor.update({ firstName: req.params['name'] }, { where: { id: req.params['id'] } });

        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
});

router.put('/genre/:id', (req, res, next) => {
    console.log('add genre');
    Actor.scope(req.query['scope']).findByPk(req.params['id'])
        .then((actor) => {
            if (actor != null) {
                Genre.create({
                    name: 'test2'
                }).then((genre) => {
                    if (genre != null) {
                        actor.$add('b', [genre])
                            .then(() => {
                                console.log('good');
                                res.send('good');
                            })
                            .catch((onReject) => {
                                console.log('probleme');
                                res.send('error');
                            });
                    }

                })
                    .catch(() => {
                        console.log('error');
                        res.send('error');
                    })

            }

        })
        .catch((err) => {
            console.log("eroor")
            res.send(err)
            res.send('error');
        })

});

router.get('/genre/:id', (req, res, next) => {
    console.log('add genre');
    Actor.scope(req.query['scope']).findByPk(req.params['id'])
        .then((actor) => {
            if (actor != null) {
                actor.$get('bs')
                    .then((result) => {
                        console.log('good');
                        res.send(result);
                    })
                    .catch((onReject) => {
                        console.log('probleme');
                        res.send('error');
                    });
            }

        })
        .catch((err) => {
            console.log("eroor")
            res.send(err)
            res.send('error');
        })

});
exports.router = router;