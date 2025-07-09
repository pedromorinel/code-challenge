// Normaliza dados do filme para lidar com inconsistências de maiúscula/minúscula
export const normalizeMovieData = (movie) => {
  if (!movie) return {};
  
  return {
    title: movie.Title || movie.title,
    year: movie.Year || movie.year,
    runtime: movie.Runtime || movie.runtime,
    country: movie.Country || movie.country,
    imdbRating: movie.imdbRating || movie.ImdbRating,
    imdbVotes: movie.imdbVotes || movie.ImdbVotes,
    plot: movie.Plot || movie.plot,
    director: movie.Director || movie.director,
    writer: movie.Writer || movie.writer,
    actors: movie.Actors || movie.actors,
    genre: movie.Genre || movie.genre,
    language: movie.Language || movie.language,
    rated: movie.Rated || movie.rated,
    released: movie.Released || movie.released,
    boxOffice: movie.BoxOffice || movie.boxOffice,
    awards: movie.Awards || movie.awards,
    poster: movie.Poster || movie.poster
  };
};

export const isValidValue = (value) => {
  return value && value !== 'N/A' && value.toString().trim() !== '';
}; 