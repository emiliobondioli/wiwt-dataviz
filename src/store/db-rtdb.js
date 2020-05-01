import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { firebaseDevConfig, firebaseProdConfig } from './config.js'
import { sortByDate } from '@/utils'

const config = process.env.NODE_ENV !== 'development' ? firebaseProdConfig : firebaseDevConfig
export const db = firebase.initializeApp(config).database()
const planetsRef = db.ref('users')
const starsRef = db.ref('pins')

function preparePlanet(context, snap) {
    const planet = snap.val()
    planet.id = snap.key
    planet.date = new Date(planet.created)
    return planet
}
function prepareStar(context, snap) {
    const star = snap.val()
    star.id = snap.key
    star.date = new Date(star.created)
    star.planet = context.getters.getPlanet(star.user)
    return star
}

export const store = {
    mutations: {
        ADD_USER(state, data) {
            state.planets = [...state.planets, data]
        },
        ADD_PIN(state, data) {
            state.stars = [...state.stars, data]
        },
        SET_AUTH(state, data) {
            state.auth = data
        }
    },
    actions: {
        firebaseAuth: context => {
            return firebase.auth()
                .signInWithEmailAndPassword(process.env.VUE_APP_FIREBASE_USER, process.env.VUE_APP_FIREBASE_PASS)
                .then(() => {
                    return context.commit('SET_AUTH', true)
                })
                .catch(() => {
                    return context.commit('SET_AUTH', false)
                })
        },
        init: context => {
            return context.dispatch('firebaseAuth')
                .then(() => context.dispatch('getPlanets'))
                .then(() => context.dispatch('getStars'))
        },
        getPlanets: context => {
            return planetsRef.once('value', snapshot => {
                const planets = []
                snapshot.forEach(s => {
                    const planet = preparePlanet(context, s)
                    planets.push(planet)
                });
                context.commit('SET_PLANETS', sortByDate(planets))
            })
        },
        getStars: context => {
            return starsRef.once('value', snapshot => {
                const stars = []
                snapshot.forEach(s => {
                    const star = prepareStar(context, s)
                    stars.push(star)
                });
                context.commit('SET_STARS', sortByDate(stars))
            })
        },
        updatePlanet: (context, planet) => {
            const id = planet.id
            const u = {
                coordinates: planet.coordinates,
                name: planet.name,
                created: new Date(planet.created).toISOString(),
                city: planet.city || '#notfound',
                country: planet.country || '#notfound',
                countryCode: planet.countryCode || '#notfound'
            }
            return db.ref('users/' + id)
                .set(u)
                .then(() => {
                    console.log(`planet ${id} updated!`)
                })
        },
        updateStar: (context, star) => {
            const id = star.id
            const p = {
                coordinates: star.coordinates,
                message: star.message,
                planet: star.planet.id,
                created: new Date(star.created).toISOString(),
                city: star.city || '#notfound',
                country: star.country || '#notfound',
                countryCode: star.countryCode || '#notfound'
            }
            return db.ref('pins/' + id)
                .set(p)
                .then(() => {
                    console.log(`star ${id} updated!`)
                })
        },
    }
}