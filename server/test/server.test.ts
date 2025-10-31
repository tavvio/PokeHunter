import { expect } from 'chai';
import axios from 'axios';
import sinon from 'sinon';

interface WeatherCondition {
    main: string;
}

interface WeatherData {
    weather: WeatherCondition[];
    main: {
        temp: number;
    };
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

async function getListPokemonByType(typePokemon: string) {
    try {
        const response = axios.get(`https://pokeapi.co/api/v2/type/${typePokemon}`);
        return (await response).data.pokemon;
    } catch (e: any) {
        throw new Error('❌ Erro ao buscar pokémons!')
    }
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

describe('Asynchronous functions with simulated data', () => {

    afterEach(() => {
        sinon.restore();
    });

    // it('getListPokemonByType should return the simulated data', async () => {
    //     const fakeResponse = {
    //         data: {
    //             pokemon: [{
    //                 pokemon: {
    //                     name: 'pikachu',
    //                     url: 'url'
    //                 }
    //             }]
    //         }
    //     };

    //     sinon.stub(axios, 'get').resolves(fakeResponse);

    //     const result = await getListPokemonByType('electric');
    //     expect(result).to.have.lengthOf(1);
    //     expect(result[0].pokemon.name).to.equal('pikachu');
    // });

    it('getOpenWeatherData should return the simulated data os weather in Brasília', async () => {
        const fakeResponse = {
            data: {
                weather: [
                    {
                        main: "Rain"
                    }
                ],
                main: {
                    temp: 17.5
                }
            }
        }

        sinon.stub(axios, 'get').resolves(fakeResponse);

        const response = await getOpenWeatherData('Brasília');

        expect(response?.main.temp).to.equal(17.5);
        expect(response?.weather.some(el => el.main == "Rain")).to.be.true
    })
})

// describe('Utility Functions', () => {
// describe('defineTypePokemon', () => {
//     it('should return eletric when is Raining', () => {
//         expect(defineTypePokemon(30, true)).to.equal('electric');
//     });

//     it('should return "fire" for temperatures above 33 degrees Celsius', () => {
//         expect(defineTypePokemon(35, false)).to.equal('fire');
//     });

//     it('should return "normal" when it does not in any range', () => {
//         expect(defineTypePokemon(11, false)).to.equal('normal');
//     });

//     it('should return "bug" when the temperature is greater than or equal to 23 and less than 27 degrees', () => {
//         expect(defineTypePokemon(24.5, false)).to.equal('bug');
//     });
// });

// describe('translateTypePokemon', () => {
//     it('should translate "fire" to "Fogo"', () => {
//         expect(translateTypePokemon('fire')).to.equal('Fogo');
//     });

//     it('should return the original value if cannot find a translation', () => {
//         expect(translateTypePokemon('dragon')).to.equal('dragon');
//     });
// });
// });
