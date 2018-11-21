export interface Request {
  id: number
  asset: number
}

export interface Offer extends Request {
  amount: number
}