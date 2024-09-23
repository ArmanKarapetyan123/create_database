import express from "express";
import database from "./database"
import { DirectorsRouter } from "./routes/DirectorsRouts";
import { ActorsRouter } from "./routes/ActorsRouts";
import { MoviesRouter } from "./routes/MoviesRouts";
import { GenresRouter } from "./routes/GenresRouts";
import { RatingsRouter } from "./routes/RatingRouts";
import { MovieGenresRouter } from "./routes/MovieGenresRouts";

const app = express();
const PORT:number = 3000;

app.use(express.json());
app.use('/directors',DirectorsRouter);
app.use('/actors',ActorsRouter);
app.use('/movies',MoviesRouter);
app.use('/genres',GenresRouter);
app.use('/ratings',RatingsRouter);
app.use('/moviegenres',MovieGenresRouter);

app.listen(PORT, () => {
    console.log(`Server is on PORT ${PORT}`);
})