/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "./hooks/useIntersectionObserver";
import { api } from "./services/api";

interface iPokemon {
  name: string;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [pokemonList, setPokemonList] = useState([] as iPokemon[]);
  const [canObserve, setCanObserve] = useState(false);
  const [pokemonOffset, setPokemonOffset] = useState(0);

  const observingElement = useIntersectionObserver<HTMLDivElement>(async (entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      const newPokemonOffset = pokemonOffset + 20;
      const response = await api.get(`pokemon?limit=20&offset=${newPokemonOffset}`);        
      setPokemonList([...pokemonList, ...response.data.results]);
      setPokemonOffset(newPokemonOffset);
    }
  }, [canObserve, pokemonOffset], canObserve);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.get("pokemon?limit=20&offset=0");
        setPokemonList(response.data.results);
        setCanObserve(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="App">
      {loading ? (
        <h1>Carregando...</h1>
      ) : (
        <>
          <ul>
            {pokemonList.map((pokemon) => (
              <li key={pokemon.name}>
                <h2>{pokemon.name}</h2>
              </li>
            ))}
          </ul>
        </>
      )}
      {canObserve && (
        <div
          ref={observingElement}
          style={{ background: "gray", height: "30px" }}
        ></div>
      )}
    </div>
  );
}

export default App;
