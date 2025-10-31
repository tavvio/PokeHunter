import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

interface WeatherCondition {
    main: string;
}

interface WeatherData {
    weather: WeatherCondition[];
    main: {
        temp: number;
    };
}

interface PokemonInfo {
    pokemon: {
        name: string;
        url: string;
    };
}

interface TypeInfo {
    type: {
        name: string;
    }
}
interface PokemonDetails {
    sprites: {
        front_default: string;
    };
    types: TypeInfo[];
}

async function getOpenWeatherData(query: string): Promise<WeatherData | null> {
    const apiKeyWeather = "eecf0165db814320e696b9f351a38289";

    try {
        const response = axios.get<WeatherData>(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                appid: apiKeyWeather,
                q: query,
                units: "metric"
            }
        });
        return (await response).data;
    } catch (error: any) {
        throw new Error('❌ Cidade não encontrada! Digite um nome válido!')
    }
}

async function getListPokemonByType(typePokemon: string) {
    try {
        const response = axios.get(`https://pokeapi.co/api/v2/type/${typePokemon}`);
        return (await response).data.pokemon;
    } catch (e: any) {
        throw new Error('❌ Erro ao buscar pokémons!')
    }
}

function defineTypePokemon(temp: number, isRaining: boolean): string {
    if (isRaining) return 'electric';
    if (temp < 5) return 'ice';
    if (temp >= 5 && temp < 10) return 'water';
    if (temp >= 12 && temp < 15) return 'grass';
    if (temp >= 15 && temp < 21) return 'ground';
    if (temp >= 23 && temp < 27) return 'bug';
    if (temp >= 27 && temp <= 33) return 'rock';
    if (temp > 33) return 'fire';
    return 'normal';
}

function translateTypePokemon(typePokemon: string): string {
    const types: Record<string, string> = {
        electric: 'Elétrico',
        ice: 'Gelo',
        water: 'Água',
        grass: 'Grama',
        ground: 'Terra',
        bug: 'Inseto',
        rock: 'Pedra',
        fire: 'Fogo',
        normal: 'Normal',
    };
    return types[typePokemon] || typePokemon;
}

function getRandomIndexes(array: any[], count: number = 5): number[] {
    let randomIndexes: Array<number> = [];

    for (let i = 0; i < count; i++) {
        let randomIndex = Math.floor(Math.random() * array.length);
        randomIndexes.push(randomIndex);
    }

    return randomIndexes;
}

async function getPokemonsInfo(randomIndexes: number[], pokemonsList: PokemonInfo[]): Promise<Array<{ name: string; image: string }>> {
    let pokemonsInfo: Array<{ name: string; image: string, otherTypes:string[] }> = [];

    for (const index of randomIndexes) {
        const { name, url } = pokemonsList[index].pokemon;
        const response = await axios.get<PokemonDetails>(url);
        const image: string = response.data.sprites.front_default;
        const otherTypes: string[] = response.data.types.map((t: TypeInfo) => t.type.name);;

        pokemonsInfo.push({ name, image, otherTypes: otherTypes });
    }

    return pokemonsInfo
}

app.get('/api', async (req, res) => {
    const query = req.query.query as string;

    try {
        const weatherData = await getOpenWeatherData(query)
        const temp = weatherData?.main?.temp;

        let isRaining = weatherData?.weather?.some(el => el.main === "Rain");

        const typePokemon = defineTypePokemon(temp!, isRaining!);
        const listPokemonsByType = await getListPokemonByType(typePokemon);
        const randomIndexes = getRandomIndexes(listPokemonsByType, 5);

        const pokemonsInfos = await getPokemonsInfo(randomIndexes, listPokemonsByType);

        const typePokemonTranslated = translateTypePokemon(typePokemon);

        res.json({
            pokemonsInfos: pokemonsInfos,
            pokemonType: typePokemonTranslated,
            isRaining: isRaining,
            temperature: temp,
        });
        
    } catch (e: any) {
        res.status(500).json({
            error: e.message
        })
    }
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
})
