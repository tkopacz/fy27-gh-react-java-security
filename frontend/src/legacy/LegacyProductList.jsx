import React from 'react';

class LegacyProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { products: [] };
  }

  componentDidMount() {
    fetch('/api/products')
      .then((response) => response.json())
      .then((products) => this.setState({ products }));
  }

  componentDidUpdate(previousProps) {
    if (previousProps.refreshToken !== this.props.refreshToken) {
      this.setState({ products: [] });
    }
  }

  render() {
    return <ul>{this.state.products.map((product) => <li key={product.id}>{product.name}</li>)}</ul>;
  }
}

export default LegacyProductList;
