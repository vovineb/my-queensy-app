import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties, isReturningCustomer }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {properties.map((property) => (
      <PropertyCard
        key={property.id}
        property={property}
        isReturningCustomer={isReturningCustomer}
      />
    ))}
  </div>
);

export default