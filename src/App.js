import React, {useState, useEffect} from 'react';
import { getAllPokemon, getPokemon } from './services/pokemon';
import Card from './components/Card';
import Navbar from './components/Navbar/Navbar';
import './App.css';

function App() {
  //variável: pokemonData | função: setPokemonData | estado incial da variável: array vazio
  const [pokemonData, setPokemonData] = useState([]);
  //as duas variáveis a seguir são para fazer o controle de paginação, pegando o url do que deve aparecer de acordo com o comportamento de ir ou voltar
  const [nextUrl, setNextUrl] = useState('');
  const [previousUrl, setPreviousUrl] = useState('');
  //variável para fazer de "carregando"
  const [loading, setLoading] = useState(true);
  const initialUrl = 'https://pokeapi.co/api/v2/pokemon';

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialUrl); //o que vou receber de volta são todos aqueles dados e lá tem prev e next
      console.log(response);
      setNextUrl(response.next); //pego o next de lá
      setPreviousUrl(response.previous); //e o prev também
      let pokemon = await loadingPokemon(response.results); //results é o array com todos os pokemons daquela página
      console.log(pokemon);
      setLoading(false); //pois já pegamos os dados da api
    }
    fetchData();
  }, []);

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadingPokemon(data.results);
    setNextUrl(data.next);
    setPreviousUrl(data.previous);
    setLoading(false);
  }

  const prev = async () => {
    if (!previousUrl) return;
    setLoading(true);
    let data = await getAllPokemon(previousUrl);
    await loadingPokemon(data.results);
    setNextUrl(data.next);
    setPreviousUrl(data.previous);
    setLoading(false);
  }

  const loadingPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map(async pokemon => {
        let pokemonRecord = await getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );

    setPokemonData(_pokemonData);
  };

  // console.log(pokemonData);

  return (
    <>
      { loading ? <h1>Loading...</h1> : (
        <>
          <Navbar/>
          <div className="btn">
            <button onClick={prev}>Prev</button>
            <button onClick={next}>Next</button>
          </div>
          <div className="grid-container">
            {pokemonData.map((pokemon, i) => {
              return <Card key={i} pokemon={pokemon}/>
            })}
          </div>
          <div className="btn">
            <button onClick={prev}>Prev</button>
            <button onClick={next}>Next</button>
          </div>
        </>
      )}
    </>
  );
}

export default App;
