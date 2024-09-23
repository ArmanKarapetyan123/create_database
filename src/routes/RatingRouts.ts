import {Router} from 'express';
import {
  getRatings,
  getRatingsById,
  createRatings,
  updateRatingsById,
  deleteRatingsById
} from "../controllers/RatingsControllers";

export const RatingsRouter = Router();

RatingsRouter.get("/" , getRatings)
RatingsRouter.get("/:id" , getRatingsById)
RatingsRouter.post("/" , createRatings)
RatingsRouter.put("/:id" , updateRatingsById)
RatingsRouter.delete("/:id" , deleteRatingsById)