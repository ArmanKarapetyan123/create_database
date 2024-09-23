import {Router} from "express"

import {
    createMovieGenres,
    deleteMovieGenresById
} from "../controllers/MovieGenresControllers"

export const MovieGenresRouter = Router();

MovieGenresRouter.post("/" , createMovieGenres);
MovieGenresRouter.delete("/" , deleteMovieGenresById);