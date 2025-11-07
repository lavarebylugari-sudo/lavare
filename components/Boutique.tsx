
import React from 'react';
import { Product } from '../types';
import { BOUTIQUE_PRODUCTS } from '../constants';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden group transition-transform duration-300 hover:-translate-y-2">
    <div className="h-64 overflow-hidden">
      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    </div>
    <div className="p-6">
      <p className="text-xs font-semibold text-gray-500 uppercase">{product.category}</p>
      <h3 className="font-display text-2xl mt-1 text-[#333333]">{product.name}</h3>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xl font-semibold text-[#333333]">{product.price}</span>
        <button className="px-5 py-2 text-sm font-medium text-white bg-[#333333] rounded-full hover:bg-[#D4AF37] transition-colors duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

const Boutique: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-display text-5xl">The LAVARE Boutique</h2>
        <p className="mt-2 text-lg text-gray-600">A curated collection of luxury goods for the distinguished pet.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BOUTIQUE_PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Boutique;
