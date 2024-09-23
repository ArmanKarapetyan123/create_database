import {Router} from 'express';
import {
  getDirectors,
  getDirectorsById,
  createDirectors,
  updateDirectorsById,
  deleteDirectorsById
} from "../controllers/DirectorsController";

export const DirectorsRouter = Router();

DirectorsRouter.get("/" , getDirectors)
DirectorsRouter.get("/:id" , getDirectorsById)
DirectorsRouter.post("/" , createDirectors)
DirectorsRouter.put("/:id" , updateDirectorsById)
DirectorsRouter.delete("/:id" , deleteDirectorsById)
