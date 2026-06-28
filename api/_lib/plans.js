// Maps Stripe price IDs -> internal plan name.
export function planForPrice(priceId) {
  const map = {
    [process.env.VITE_STRIPE_PRICE_PRO_MONTHLY]: 'pro',
    [process.env.VITE_STRIPE_PRICE_PRO_YEARLY]: 'pro',
    [process.env.VITE_STRIPE_PRICE_TEAM_MONTHLY]: 'team',
    [process.env.VITE_STRIPE_PRICE_TEAM_YEARLY]: 'team',
  }
  return map[priceId] || 'pro'
}
