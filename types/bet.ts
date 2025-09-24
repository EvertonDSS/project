export interface Bet {
  id: string
  apostador: string
  cavalo: string
  campeonato: string
  valorTotal: number
  valorAposta: number
  porcentagem: number
  dataAposta: Date
}