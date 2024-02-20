import { atom } from 'recoil'
const cardSuitValueAtom = atom({
  key: 'cardSuitValue',
  default: [0, 0],
})

export default cardSuitValueAtom
