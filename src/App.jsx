import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            const details = await response.json();
            return details;
          })
        );
        setPokemonList(pokemonDetails);
        setFilteredPokemonList(pokemonDetails);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault()
    const filteredResults = pokemonList.filter((pokemon) => {
      return (
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.types.some((type) => type.type.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })
    setFilteredPokemonList(filteredResults);
  };

  return (
    <>
      <main>
        <div id="pokedex"><img alt="logo-pokedex" src='https://user-images.githubusercontent.com/29473781/180619084-a56960ab-7efa-4e34-9d33-4e3e581d62ff.png'/></div>
        <div id="content">
          <form>
            <input type="text" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} />
            <div>
              <button type="submit" onClick={handleSearch}>Buscar</button>
            </div>
          </form>
          <div id="card-container">
            {filteredPokemonList.map((pokemon, index) => (
              <div key={index} id="card" className={`card ${pokemon.types[0].type.name}`}>
                <div>
                  <p>
                    Name: <b>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</b> - ID: {pokemon.id}
                  </p>
                  <p>Type: {pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1) : 'Unknown'}</p>
                </div>
                <div>
                  <img src={pokemon.sprites.other['official-artwork'].front_default} alt="pokemon" id="imgPokemon" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;