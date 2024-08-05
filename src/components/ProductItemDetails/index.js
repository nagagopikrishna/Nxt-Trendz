import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: '',
    count: 1,
    productDetailsApiStatus: apiStatus.initial,
    similarProductDetails: [],
  }

  componentDidMount = () => {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({productDetailsApiStatus: apiStatus.inProgress})
    const {match} = this.props
    const {id} = match.params

    const url = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const formattedProductData = {
        id: data.id,
        imageUrl: data.image_url,
        description: data.description,
        price: data.price,
        rating: data.rating,
        brand: data.brand,
        available: data.availability,
        totalReviews: data.total_reviews,
        title: data.title,
      }

      const formattedSimilarProductData = data.similar_products.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        description: each.description,
        price: each.price,
        rating: each.rating,
        brand: each.brand,
        available: each.availability,
        totalReviews: each.total_reviews,
        title: each.title,
        style: each.style,
      }))

      this.setState({
        productDetails: formattedProductData,
        similarProductDetails: formattedSimilarProductData,
        productDetailsApiStatus: apiStatus.success,
      })
      //   console.log(formattedData)
      //   console.log(data)
    } else {
      this.setState({productDetailsApiStatus: apiStatus.failure})
    }
  }

  onClickDecrement = () => {
    const {count} = this.state

    if (count > 1) {
      this.setState(prev => ({count: prev.count - 1}))
    }
  }

  onClickIncrement = () => {
    this.setState(prev => ({count: prev.count + 1}))
  }

  renderProductItemDetails = () => {
    const {productDetails, count, similarProductDetails} = this.state
    const {
      title,
      imageUrl,
      price,
      totalReviews,
      rating,
      description,
      available,
      brand,
    } = productDetails
    console.log(similarProductDetails)

    return (
      <div className="product-item-main-container">
        <Header />
        <div className="product-item-container">
          <div className="product-item-details">
            <img alt="product" src={imageUrl} className="product-image" />
            <div className="item-details-container">
              <h1 className="title-details"> {title}</h1>
              <p key="price" className="price-details">
                {' '}
                {`Rs ${price}/-`}
              </p>
              <div className="rating-section-details">
                <div className="rating-container-details">
                  <p className="rating-details">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star-details"
                  />
                </div>

                <p>{`${totalReviews} Reviews`}</p>
              </div>
              <p>{description}</p>
              <p>
                <span>Available:</span>
                {available}
              </p>
              <p>
                <span>Brand:</span>
                {brand}
              </p>
              <hr className="line" />
              <div className="increment-container">
                <button
                  type="button"
                  className="button"
                  onClick={this.onClickDecrement}
                  data-testid="minus"
                >
                  <BsDashSquare />
                </button>
                <p>{count}</p>
                <button
                  type="button"
                  className="button"
                  onClick={this.onClickIncrement}
                  data-testid="plus"
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button"> ADD TO CART</button>
            </div>
          </div>
          <div className="similar-product-container">
            <h1>Similar Products</h1>
            <ul>
              {similarProductDetails.map(each => (
                <SimilarProductItem similarProducts={each} key={each.id} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1> Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  renderProductLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductDetails = () => {
    const {productDetailsApiStatus} = this.state

    switch (productDetailsApiStatus) {
      case apiStatus.success:
        return this.renderProductItemDetails()
      case apiStatus.failure:
        return this.renderFailureView()

      case apiStatus.inProgress:
        return this.renderProductLoader()

      default:
        return null
    }
  }

  render() {
    return this.renderProductDetails()
  }
}

export default ProductItemDetails
