import { atom } from 'recoil'
const cardPosAtom = atom({
  key: 'cardPos',
  default: { posX: 0, posY: 0, oldPosX: 0, oldPosY: 0 },
})

export default cardPosAtom
