import './index.css'

const SimilarProductItem = props => {
  const {similarProducts} = props
  const {title, imageUrl, price, rating, brand} = similarProducts

  return (
    <li>
      <img src={imageUrl} alt="similar product" />
      <h1>{title}</h1>
      <p key="brand">{brand}</p>
      <div>
        <p key="price"> {`Rs ${price}/-`} </p>
        <p>{rating}</p>
      </div>
    </li>
  )
}

export default SimilarProductItem
