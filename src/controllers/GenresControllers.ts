import { Request, Response } from "express";
import database from "../database"

export const getGenres = async (req: Request, res: Response) => {
    try{
        const result = await database.query("SELECT * FROM Genres")
        return res.status(200).json(result.rows)
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const getGenresById = async (req: Request, res: Response) => {
    try{
        const result = await database.query({
            text: `
                SELECT * FROM Genres
                WHERE genreid = $1
            `,
            values: [req.params.id]
        })
        if(result.rowCount == 0){
            return res.status(404).json({ message: 'Genre not found'});
        }
        return res.status(200).json(result.rows[0])
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const createGenres = async (req: Request, res: Response) => {
    try{

        if(!req.body.genrename){
            return res.status(422).json({error: "Invalid"})
        }else{
            const existResult = await database.query({
                text:`SELECT EXISTS(SELECT * FROM Genres WHERE genrename=$1)`,
                values:[req.body.genrename]
            })
            if(existResult.rows[0].exists){
                return res.status(409).json({error : `Genre already exists`})
            }
        }

        const result = await database.query({
            text:'INSERT INTO Genres (genrename) VALUES($1) RETURNING *',
            values:[req.body.genrename]
        })

        return res.status(201).json(result.rows);
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const updateGenresById = async(req: Request, res: Response) => {
    try {
        if(!req.body.genrename){
            return res.status(422).json({error: "Invalid"})
        }else{
            const existResult = await database.query({
                text:'SELECT EXISTS (SELECT * FROM Genres WHERE genrename = $1)',
                values: [req.body.genrename]
            })
    
            if(existResult.rows[0].exists){
                return res.status(409).json({error : `Genre already exists`})
            }
        }
        
        const result = await database.query({
            text : `
                UPDATE Genres
                SET genrename = $1
                WHERE genreid = $2
                RETURNING * 
            `,
            values: [req.body.genrename, req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error :`Genres not found`})
        }
        
        return res.status(200).json(result.rows[0]);
    }catch (error) {
        return res.status(500).json({error: error.message })
    }
}

export const deleteGenresById = async(req: Request, res: Response) => {
    try{
        const result = await database.query({
            text: 'DELETE FROM Genres WHERE genreid = $1',
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error :`Genre not found`})
        }

        return res.status(204).json({message: `Genre deleted successfully`})

    }catch(error){
        return res.status(500).json({error: error.message })
    }
}