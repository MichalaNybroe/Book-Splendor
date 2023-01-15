import { writable } from 'svelte/store'

let localData = localStorage.getItem('user')
export const user = writable(localData ? JSON.parse(localData) : null)

