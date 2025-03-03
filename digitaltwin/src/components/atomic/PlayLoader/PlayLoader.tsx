import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

interface PlayLoaderProps {
  products: Product[];
  loadMore: () => void;
}
const PlayLoader: React.FC<PlayLoaderProps> = ({ products, loadMore }) => {
    const getSeverity = (inventoryStatus: string) => {
        switch (inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const itemTemplate = (product: Product) => {
        return (
            <div className="product-item">
                {/* <img className="product-image" src={product.image} alt={product.name} /> */}
                <div className="product-details">
                    <div className="product-name">{product.name}</div>
                    <div className="product-description">{product.description}</div>
                    <div className="product-category">{product.category}</div>
                    <div className="product-price">${product.price}</div>
                </div>
            </div>
        );
    };

    const footer = (
        <button className="load-more-button" onClick={loadMore}>
            <FontAwesomeIcon icon={faPlus} className="icon" /><b>Load </b>
        </button>
    );

    return (
        <div className="play-loader">
            <div className="play-loader-header">Click Load Button to Load More</div>
            <div className="play-loader-content">
                {/* Render all products */}
                {products.map((product) => (
                    <div key={product.id} className="product-container">
                        {itemTemplate(product)}
                        <div className={`product-status ${getSeverity(product.inventoryStatus)}`}>
                            {product.inventoryStatus}
                        </div>
                    </div>
                ))}
            </div>
            <div className="play-loader-footer">{footer}</div>
        </div>
    );
};

export default PlayLoader;
