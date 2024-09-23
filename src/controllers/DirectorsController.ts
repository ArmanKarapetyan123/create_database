import { Request, Response } from "express";
import database from "../database"


export const getDirectors = async (req: Request, res: Response) => {
    try{
        const result = await database.query("SELECT * FROM Directors")
        return res.status(200).json(result.rows)
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export const getDirectorsById = async (req: Request, res: Response) => {
    try{
        const result = await database.query({
            text:`  SELECT * FROM Directors
                    WHERE  directorid = $1
            `,
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error :`Director does not found`})
        }

        return res.status(200).json(result.rows[0])
    }catch(error){
        return res.status(500).json({ error: error.message  });
    }
}

export const createDirectors = async(req: Request, res: Response) => {
    try {

        if(!req.body.name || !req.body.nationality || !req.body.dob ){
            return res.status(422).json({error: "Invalid"})
        }else{
            const existResult = await database.query({
                text:'SELECT EXISTS (SELECT * FROM Directors WHERE name = $1 AND nationality = $2  AND DOB = $3 )',
                values: [req.body.name, req.body.nationality, req.body.dob]
            })
    
            if(existResult.rows[0].exists){
                return res.status(409).json({error : `Director already exists`})
            }
    
        }
    
        const result = await database.query({
            text: 'INSERT INTO Directors (name, nationality, DOB) VALUES($1, $2, $3) RETURNING *',
            values: [req.body.name, req.body.nationality, req.body.dob]
        })

        return res.status(201).json(result.rows);
    }catch (error) {
        return res.status(500).json({error: error.message })
    }
}

export const updateDirectorsById = async(req: Request, res: Response) => {
    try {
        if(!req.body.name || !req.body.nationality || !req.body.dob ){
            return res.status(422).json({error: "Invalid"})
        }else{
            const existResult = await database.query({
                text:'SELECT EXISTS (SELECT * FROM Directors WHERE name = $1 AND nationality = $2  AND DOB = $3 )',
                values: [req.body.name, req.body.nationality, req.body.dob]
            })
    
            if(existResult.rows[0].exists){
                return res.status(409).json({error : `Director already exists`})
            }
        }
        
        const result = await database.query({
            text : `
                UPDATE Directors
                SET name = $1, nationality = $2, dob = $3
                WHERE  directorid = $4
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

export const deleteDirectorsById = async ( req: Request, res:Response ) => {
    try{
        const result = await database.query({
            text : `DELETE FROM Directors WHERE directorid = $1`,
            values : [req.params.id]
        })
        if(result.rowCount == 0){
            return res.status(404).json({error :`Director does not found`})
        }
        return res.status(204).json({message: `Director deleted successfully`})
    }catch (error) {
            res.status(500).json({error: error.message })
    }
}