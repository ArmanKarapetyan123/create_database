import { Request, Response } from "express";
import database from "../database"

export const getRatings = async (req: Request, res: Response) => {
    try{
        const result = await database.query("SELECT * FROM Ratings")
        return res.status(200).json(result.rows)
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const getRatingsById = async (req: Request, res: Response) => {
    try{
        const result = await database.query({
            text: `
                SELECT * FROM Ratings
                WHERE movieid = $1
            `,
            values: [req.params.id]
        })
        if(result.rowCount == 0){
            return res.status(404).json({ message: 'Movie not found'});
        }
        return res.status(200).json(result.rows[0])
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const createRatings = async (req: Request, res: Response) => {
    try{

        if(!req.body.movieid || !req.body.rating){
            return res.status(422).json({error: "Invalid"})
        }else{
            const existResult = await database.query({
                text:`SELECT EXISTS(SELECT * FROM Ratings WHERE movieid=$1 AND rating=$2)`,
                values:[req.body.movieid, req.body.rating]
            })
            if(existResult.rows[0].exists){
                return res.status(409).json({error : `Movie already exists`})
            }
        }

        const result = await database.query({
            text:'INSERT INTO Ratings (movieid, rating) VALUES($1, $2) RETURNING *',
            values:[req.body.movieid, req.body.rating]
        })

        return res.status(201).json(result.rows);
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const updateRatingsById = async(req: Request, res: Response) => {
    try {
        if(!req.body.rating){
            return res.status(422).json({error: "Invalid"})
        }else{
            const existResult = await database.query({
                text:`SELECT EXISTS(SELECT * FROM Ratings WHERE rating=$1)`,
                values:[req.body.rating]
            })
            if(existResult.rows[0].exists){
                return res.status(409).json({error : `Movie already exists`})
            }
        }

        
        const result = await database.query({
            text : `
                UPDATE Ratings
                SET rating = $1
                WHERE movieid = $2
                RETURNING * 
            `,
            values: [req.body.rating, req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error :`Movie not found`})
        }
        
        return res.status(200).json(result.rows[0]);
    }catch (error) {
        return res.status(500).json({error: error.message })
    }
}

export const deleteRatingsById = async(req: Request, res: Response) => {
    try{
        const result = await database.query({
            text: 'DELETE FROM Ratings WHERE movieid = $1',
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error :`Movie not found`})
        }

        return res.status(204).json({message: `Movie deleted successfully`})

    }catch(error){
        return res.status(500).json({error: error.message })
    }
}