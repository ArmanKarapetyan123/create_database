import {Router} from 'express';
import {
  getGenres,
  getGenresById,
  createGenres,
  updateGenresById,
  deleteGenresById
} from "../controllers/GenresControllers";

export const GenresRouter = Router();

GenresRouter.get("/" , getGenres)
GenresRouter.get("/:id" , getGenresById)
GenresRouter.post("/" , createGenres)
GenresRouter.put("/:id" , updateGenresById)
GenresRouter.delete("/:id" , deleteGenresById)
