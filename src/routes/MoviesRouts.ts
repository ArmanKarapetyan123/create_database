import {Router} from "express"

import {
    getMovies,
    getMoviesById,
    createMovies,
    updateMoviesById,
    deleteMoviesById
} from "../controllers/MoviesControllers"

export const MoviesRouter = Router();

MoviesRouter.get("/" , getMovies);
MoviesRouter.get("/:id" , getMoviesById);
MoviesRouter.post("/" , createMovies);
MoviesRouter.put("/:id" , updateMoviesById);
MoviesRouter.delete("/:id" , deleteMoviesById);