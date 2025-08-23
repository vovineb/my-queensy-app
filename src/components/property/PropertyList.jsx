import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties, isReturningCustomer }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 w-full">
    {properties.map((property) => (
      <div key={property.id} className="flex justify-center w-full">
        <div className="w-full max-w-[120%]">
          <PropertyCard
            property={property}
            isReturningCustomer={isReturningCustomer}
          />
        </div>
      </div>
    ))}
  </div>
);

export default PropertyList;