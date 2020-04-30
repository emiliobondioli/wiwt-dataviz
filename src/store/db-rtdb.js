import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { firebaseDevConfig, firebaseProdConfig } from './config.js'
import { sortByDate } from '@/utils'

const config = firebaseProdConfig
export const db = firebase.initializeApp(config).database()
const usersRef = db.ref('users')
const pinsRef = db.ref('pins')

function prepareUser(context, snap) {
    const user = snap.val()
    user.id = snap.key
    user.created = user.created
    return user
}
function preparePin(context, snap) {
    const pin = snap.val()
    pin.id = snap.key
    pin.created = pin.created
    pin.user = context.getters.getUser(pin.user)
    return pin
}

export const store = {
    mutations: {
        ADD_USER(state, data) {
            state.users = [...state.users, data]
        },
        ADD_PIN(state, data) {
            state.pins = [...state.pins, data]
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
                .then(() => context.dispatch('getUsers'))
                .then(() => context.dispatch('getPins'))
        },
        getUsers: context => {
            return usersRef.once('value', snapshot => {
                const users = []
                snapshot.forEach(s => {
                    const user = prepareUser(context, s)
                    users.push(user)
                });
                context.commit('SET_PLANETS', sortByDate(users))
            })
        },
        getPins: context => {
            return pinsRef.once('value', snapshot => {
                const pins = []
                snapshot.forEach(s => {
                    const pin = preparePin(context, s)
                    pins.push(pin)
                });
                context.commit('SET_STARS', sortByDate(pins))
            })
        },
        updateUser: (context, user) => {
            const id = user.id
            const u = {
                coordinates: user.coordinates,
                name: user.name,
                created: new Date(user.created).toISOString(),
                city: user.city || '#notfound',
                country: user.country || '#notfound',
                countryCode: user.countryCode || '#notfound'
            }
            return db.ref('users/' + id)
                .set(u)
                .then(() => {
                    console.log(`user ${id} updated!`)
                })
        },
        updatePin: (context, pin) => {
            const id = pin.id
            const p = {
                coordinates: pin.coordinates,
                message: pin.message,
                user: pin.user.id,
                created: new Date(pin.created).toISOString(),
                city: pin.city || '#notfound',
                country: pin.country || '#notfound',
                countryCode: pin.countryCode || '#notfound'
            }
            return db.ref('pins/' + id)
                .set(p)
                .then(() => {
                    console.log(`pin ${id} updated!`)
                })
        },
    }
}