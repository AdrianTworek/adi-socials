export default function (price: string, change: string) {
  const formattedPrice =
    price[0] === '0'
      ? price.slice(0, 10)
      : price.slice(0, price.indexOf('.') + 7)
  const positiveChange = +change >= 0

  return { formattedPrice, positiveChange }
}
