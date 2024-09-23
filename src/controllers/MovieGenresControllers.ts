import { Request, Response } from "express";
import database from "../database"

export const createMovieGenres = async (req: Request, res: Response) => {
    try{

        if(!req.body.movieid || !req.body.genreid){
            return res.status(422).json({error: "Invalid"})
        }else{
            const existResult = await database.query({
                text:`SELECT EXISTS(SELECT * FROM MovieGenres WHERE movieid=$1 AND genreid=$2)`,
                values:[req.body.movieid,req.body.genreid]
            })
            if(existResult.rows[0].exists){
                return res.status(409).json({error : `MovieGenre already exists`})
            }
        }

        const result = await database.query({
            text:'INSERT INTO MovieGenres (movieid, genreid) VALUES($1, $2) RETURNING *',
            values:[req.body.movieid, req.body.genreid]
        })

        return res.status(201).json(result.rows);
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const deleteMovieGenresById = async(req: Request, res: Response) => {
    try{
        const result = await database.query({
            text: 'DELETE FROM MovieGenres WHERE movieid = $1 OR genreid =$2',
            values: [req.body.movieid, req.body.genreid]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error :`MovieGenre not found`})
        }

        return res.status(204).json({message: `MovieGenre deleted successfully`})

    }catch(error){
        return res.status(500).json({error: error.message })
    }
}