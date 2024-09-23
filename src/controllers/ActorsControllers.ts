import { Request, Response } from "express";
import database from "../database"

export const getActors = async (req: Request, res: Response) => {
    try{
        const result = await database.query("SELECT * FROM Actors")
        return res.status(200).json(result.rows)
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const getActorsById = async (req: Request, res: Response) => {
    try{
        const result = await database.query({
            text: `
                SELECT * FROM Actors
                WHERE actorid = $1
            `,
            values: [req.params.id]
        })
        if(result.rowCount == 0){
            return res.status(404).json({ message: 'Actor not found'});
        }
        return res.status(200).json(result.rows[0])
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const createActors = async (req: Request, res: Response) => {
    try{

        if(!req.body.name || !req.body.nationality || !req.body.dob){
            return res.status(422).json({error: "Invalid"})
        }else{
            const existResult = await database.query({
                text:`SELECT EXISTS(SELECT * FROM actors WHERE name=$1 AND nationality=$2 AND DOB=$3)`,
                values:[req.body.name, req.body.nationality, req.body.dob]
            })
            if(existResult.rows[0].exists){
                return res.status(409).json({error : `Actor already exists`})
            }
        }

        const result = await database.query({
            text:'INSERT INTO Actors (name, nationality, DOB) VALUES($1, $2, $3) RETURNING *',
            values:[req.body.name, req.body.nationality, req.body.dob]
        })

        return res.status(201).json(result.rows);
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const updateActorsById = async(req: Request, res: Response) => {
    try {
        if(!req.body.name || !req.body.nationality || !req.body.dob ){
            return res.status(422).json({error: "Invalid"})
        }else{
            const existResult = await database.query({
                text:'SELECT EXISTS (SELECT * FROM Actors WHERE name = $1 AND nationality = $2  AND DOB = $3 )',
                values: [req.body.name, req.body.nationality, req.body.dob]
            })
    
            if(existResult.rows[0].exists){
                return res.status(409).json({error : `Actor already exists`})
            }
        }
        
        const result = await database.query({
            text : `
                UPDATE Actors
                SET name = $1, nationality = $2, dob = $3
                WHERE actorid = $4
                RETURNING * 
            `,
            values: [req.body.name, req.body.nationality, req.body.dob , req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error :`Director does not found`})
        }
        
        return res.status(200).json(result.rows[0]);
    }catch (error) {
        return res.status(500).json({error: error.message })
    }
}

export const deleteActorsById = async(req: Request, res: Response) => {
    try{
        const result = await database.query({
            text: 'DELETE FROM Actors WHERE actorid = $1',
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error :`Actor does not found`})
        }

        return res.status(204).json({message: `Actor deleted successfully`})

    }catch(error){
        return res.status(500).json({error: error.message })
    }
}