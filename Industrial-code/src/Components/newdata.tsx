// import React, { useState, useEffect } from 'react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// const properties = [{
//   id: 1,
//   type: 'apartment',
//   status: 'ready-to-move',
//   price: 4500000,
//   address: 'Jubilee Hills, Hyderabad',
//   title: 'Modern 3BHK Apartment',
//   image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
//   description: 'Luxurious 3BHK apartment with modern amenities',
//   sqft: '1800',
//   bedrooms: '3',
//   bathrooms: '2'
// }];

// export default function RealEstate() {
//   const [filteredProperties, setFilteredProperties] = useState(properties);
//   const [filters, setFilters] = useState({
//     type: '',
//     status: '',
//     price: '',
//     search: ''
//   });
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     let result = properties;

//     if (filters.type) {
//       result = result.filter(p => p.type === filters.type);
//     }
//     if (filters.status) {
//       result = result.filter(p => p.status === filters.status);
//     }
//     if (filters.price) {
//       switch(filters.price) {
//         case 'below-20':
//           result = result.filter(p => p.price < 2000000);
//           break;
//         case 'upto-50':
//           result = result.filter(p => p.price <= 5000000);
//           break;
//         case 'above-1cr':
//           result = result.filter(p => p.price > 10000000);
//           break;
//       }
//     }
//     if (filters.search) {
//       result = result.filter(p => 
//         p.address.toLowerCase().includes(filters.search.toLowerCase()) || 
//         p.title.toLowerCase().includes(filters.search.toLowerCase())
//       );
//     }

//     setFilteredProperties(result);
//   }, [filters]);

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <nav className="bg-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <div className="text-xl font-bold text-blue-600">DreamHome</div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Button variant="ghost">Home</Button>
//               <Button variant="ghost">Properties</Button>
//               <Button variant="ghost">Contact</Button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Select onValueChange={(value) => setFilters(prev => ({...prev, type: value}))}>
//             <SelectTrigger>
//               <SelectValue placeholder="Property Type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="apartment">Apartments</SelectItem>
//               <SelectItem value="villa">Villas</SelectItem>
//               <SelectItem value="home">Individual Homes</SelectItem>
//               <SelectItem value="plot">Open Plots</SelectItem>
//               <SelectItem value="farmland">Farm Lands</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}>
//             <SelectTrigger>
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="under-construction">Under Construction</SelectItem>
//               <SelectItem value="ready-to-move">Ready to Move</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select onValueChange={(value) => setFilters(prev => ({...prev, price: value}))}>
//             <SelectTrigger>
//               <SelectValue placeholder="Price Range" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="below-20">Below 20 Lakhs</SelectItem>
//               <SelectItem value="upto-50">Upto 50 Lakhs</SelectItem>
//               <SelectItem value="above-1cr">Above 1 Crore</SelectItem>
//             </SelectContent>
//           </Select>

//           <Input
//             type="text"
//             placeholder="Search by address..."
//             onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
//           />
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProperties.map((property) => (
//             <Dialog key={property.id}>
//               <DialogTrigger>
//                 <Card className="cursor-pointer hover:-translate-y-1 transition-transform duration-300">
//                   <CardContent className="p-0">
//                     <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
//                     <div className="p-4">
//                       <CardTitle className="text-lg">{property.title}</CardTitle>
//                       <p className="text-gray-600">₹{(property.price/100000).toFixed(2)} Lakhs</p>
//                       <p className="text-gray-500">{property.address}</p>
//                       <div className="flex items-center mt-2 text-sm text-gray-500">
//                         <span className="mr-2"><i className="bi bi-house-door"></i> {property.sqft} sqft</span>
//                         <span className="mr-2"><i className="bi bi-door-open"></i> {property.bedrooms} beds</span>
//                         <span><i className="bi bi-water"></i> {property.bathrooms} baths</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>{property.title}</DialogTitle>
//                 </DialogHeader>
//                 <img src={property.image} alt={property.title} className="w-full h-64 object-cover rounded-lg" />
//                 <p className="text-xl text-blue-600">₹{(property.price/100000).toFixed(2)} Lakhs</p>
//                 <p className="text-gray-600">{property.address}</p>
//                 <div>
//                   <h3 className="font-semibold">Details:</h3>
//                   <ul className="mt-2">
//                     <li>Property Type: {property.type}</li>
//                     <li>Status: {property.status}</li>
//                     <li>Area: {property.sqft} sqft</li>
//                     <li>Bedrooms: {property.bedrooms}</li>
//                     <li>Bathrooms: {property.bathrooms}</li>
//                   </ul>
//                 </div>
//                 <p>{property.description}</p>
//               </DialogContent>
//             </Dialog>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }