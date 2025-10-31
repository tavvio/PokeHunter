import { useState } from 'react';
import axios from 'axios';

interface PokemonInfo {
  name: string;
  image: string;
  otherTypes: string[];
}

function App() {
  const [input, setInput] = useState<string>('');
  const [city, setCity] = useState<string>();
  const [temperature, setTemperature] = useState<number>(0);
  const [isRaining, setIsRaining] = useState<boolean>(false);
  const [pokemonsList, setPokemonsList] = useState<PokemonInfo[]>([]);
  const [typePokemon, setTypePokemon] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [hasAttempt, setHasAttempt] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    setHasAttempt(true);
    setCity(input);

    try {
      setErrorMessage('');
      setIsLoading(true);

      const res: any = await axios.get(`http://localhost:3000/api?query=${input}`);

      if (res) {
        setIsLoading(false);
      }

      setIsRaining(res.data.isRaining);
      setTemperature(res.data.temperature);
      setPokemonsList(res.data.pokemonsInfos);
      setTypePokemon(res.data.pokemonType);

    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.response.data.error);
    }
  }

  return (
    <section>
      <div className={"top"}>
        <h1>Pokehunter</h1>
        <h2>Digite o nome da cidade no campo abaixo para receber as informações de tempo atuais e possíveis pokémons disponíveis</h2>
      </div>
      <div className={"middle"}>
        <div className={'middle-input'}>
          <input id={'inputCity'} placeholder={"Ex.: Brasília"} value={input} onChange={e => setInput(e.target.value)} />
          <button onClick={handleSearch}>Buscar</button>
        </div>
        {city && <div className={'label-city'}>Dados de <p className={'city capitalize'}>{city}</p></div>}
      </div>
      {errorMessage ?
        <p className={'error-message'}>{errorMessage}</p>
        :
        hasAttempt && (
          <div className={"bottom"}>
            {isLoading ?
              <p>Carregando...</p>
              :
              <div className={'section-result'}>
                <div className={"info-weather"}>
                  {temperature && city ?
                    <div className={"label"}>
                      <p>Temperatura</p>
                      <p>{temperature?.toFixed(1).toString().replace(".", ",")}ºC</p>
                    </div>
                    : null
                  }
                  {city &&
                    <div className={"label"}>
                      <p>Está chovendo?</p>
                      <p>{isRaining ? 'Sim' : 'Não'}</p>
                    </div>
                  }
                  {typePokemon &&
                    <div className={"label"}>
                      <p>Tipo de Pokemon</p>
                      <p className={'capitalize'}>{typePokemon}</p>
                    </div>
                  }
                </div>
                <div>
                  <p className={'available-label'}>Pokémons disponíveis nesta localização e temperatura atuais:</p>
                  <ul className={'list-pokemons'}>
                    {
                      pokemonsList.map((el, index) => (
                        <li key={`Pokemon ${index + 1}`} className={'card-pokemon'}>
                          <div className={'others-types'}>{el.otherTypes.map((icon, idx) => (
                            <img key={`ícone ${idx + 1}`} src={`./icons/${icon}.svg`} alt="ícone indisponível" />
                          ))}</div>
                          <img src={el.image} alt={`Imagem do ${el.name.replace("-", " ")}`} />
                          <p className={'name-pokemon'}>{el.name.replace("-", " ")}</p>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            }
          </div>
        )
      }
    </section>
  )
}

export default App