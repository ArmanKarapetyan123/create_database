import { Request, Response } from "express";
import database from "../database"

export const getMovies = async (req: Request, res: Response) => {
    try{
        const result = await database.query("SELECT * FROM Movies")
        return res.status(200).json(result.rows)
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const getMoviesById = async (req: Request, res: Response) => {
    try{
        const result = await database.query({
            text: `
                SELECT * FROM Movies
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

export const createMovies = async (req: Request, res: Response) => {
    try{

        if(!req.body.title || !req.body.releaseyear || !req.body.directorid){
            return res.status(422).json({error: "Invalid"})
        }else{
            const existResult = await database.query({
                text:`SELECT EXISTS(SELECT * FROM Movies WHERE title=$1 AND releaseyear=$2 AND directorid=$3)`,
                values:[req.body.title, req.body.releaseyear, req.body.directorid]
            })
            if(existResult.rows[0].exists){
                return res.status(409).json({error : `Movie already exists`})
            }
        }

        const result = await database.query({
            text:'INSERT INTO Movies (title, releaseyear, directorid) VALUES($1, $2, $3) RETURNING *',
            values:[req.body.title, req.body.releaseyear, req.body.directorid]
        })

        return res.status(201).json(result.rows);
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const updateMoviesById = async(req: Request, res: Response) => {
    try {
        if(!req.body.title || !req.body.releaseyear || !req.body.directorid ){
            return res.status(422).json({error: "Invalid"})
        }else{
            const existResult = await database.query({
                text:'SELECT EXISTS (SELECT * FROM Movies WHERE title=$1 AND releaseyear=$2 AND directorid=$3)',
                values: [req.body.title, req.body.releaseyear, req.body.directorid]
            })
    
            if(existResult.rows[0].exists){
                return res.status(409).json({error : `Movie already exists`})
            }
        }
        
        const result = await database.query({
            text : `
                UPDATE Movies
                SET title = $1, releaseyear = $2, directorid = $3
                WHERE movieid = $4
                RETURNING * 
            `,
            values: [req.body.title, req.body.releaseyear, req.body.directorid , req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error :`Movie does not found`})
        }
        
        return res.status(200).json(result.rows[0]);
    }catch (error) {
        return res.status(500).json({error: error.message })
    }
}

export const deleteMoviesById = async(req: Request, res: Response) => {
    try{
        const result = await database.query({
            text: 'DELETE FROM Movies WHERE movieid = $1',
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