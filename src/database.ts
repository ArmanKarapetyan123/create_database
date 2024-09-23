import pg from "pg";
const {Pool} = pg;

const pool = new Pool({
    user: 'postgres',      
    host: 'localhost',           
    database: 'postgres',   
    password: 'o934o2318',
    port: 5432,    
})
export default pool;