import {Router} from "express"

import {
    getActors,
    getActorsById,
    createActors,
    updateActorsById,
    deleteActorsById
} from "../controllers/ActorsControllers"

export const ActorsRouter = Router();

ActorsRouter.get("/" , getActors);
ActorsRouter.get("/:id" , getActorsById);
ActorsRouter.post("/" , createActors);
ActorsRouter.put("/:id" , updateActorsById);
ActorsRouter.delete("/:id" , deleteActorsById);