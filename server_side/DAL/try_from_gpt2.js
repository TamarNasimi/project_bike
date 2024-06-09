// const express = require('express');
// const axios = require('axios');
// const path = require('path');
// const app = express();
// const port = 3000;

// class Graph {
//     constructor() {
//         this.vertices = [];
//         this.edges = [];
//     }

//     addVertex(vertex) {
//         this.vertices.push(vertex);
//     }

//     addEdge(edge) {
//         this.edges.push(edge);
//     }

//     getVertices() {
//         return this.vertices;
//     }

//     getEdges() {
//         return this.edges;
//     }

//     findVertexById(vertex_id) {
//         return this.vertices.find(v => v.vertex_id === vertex_id);
//     }

//     findEdgeById(edge_id) {
//         return this.edges.find(e => e.edge_id === edge_id);
//     }

//     async fetchCityBoundaries(city) {
//         const apiKey = 'your Google Maps API Key'; // Replace with your Google Maps API Key
//         const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}&key=${apiKey}`;

//         try {
//             const response = await axios.get(url);
//             const result = response.data.results[0];
//             return result.geometry.viewport;
//         } catch (error) {
//             console.error('Error fetching city boundaries from Google Maps:', error.response.data);
//             return null;
//         }
//     }

//     async fetchRoadsNearPoint(lat, lng) {
//         const apiKey = 'your Google Maps API Key'; // Replace with your Google Maps API Key
//         const url = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${apiKey}`;

//         try {
//             const response = await axios.get(url);
//             return response.data.snappedPoints || [];
//         } catch (error) {
//             console.error('Error fetching roads from Google Maps:', error.response.data);
//             return [];
//         }
//     }

//     calculateDistance(point1, point2) {
//         const R = 6371e3; // Earth's radius in meters
//         const lat1 = point1.lat * Math.PI / 180;
//         const lat2 = point2.lat * Math.PI / 180;
//         const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
//         const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;

//         const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//             Math.cos(lat1) * Math.cos(lat2) *
//             Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//         return R * c; // Distance in meters
//     }
// //מדפיס את המיקומים של הנקודות הקיצוניות
//     // async constructRoadNetwork(city) {
//     //     const boundaries = await this.fetchCityBoundaries(city);
//     //     if (!boundaries) {
//     //         console.error('Failed to fetch city boundaries');
//     //         return [];
//     //     }

//     //     const northEast = boundaries.northeast;
//     //     const southWest = boundaries.southwest;
//     //     const extremePoints = [
//     //         { lat: northEast.lat, lng: northEast.lng },
//     //         { lat: northEast.lat, lng: southWest.lng },
//     //         { lat: southWest.lat, lng: northEast.lng },
//     //         { lat: southWest.lat, lng: southWest.lng }
//     //     ];

//     //     const visited = new Set();
//     //     const queue = [...extremePoints];

//     //     let roadId = 1;
//     //     const roads = [];
//     //     const roadMap = new Map();

//     //     while (queue.length > 0) {
//     //         const current = queue.shift();
//     //         if (!current.lat || !current.lng) {
//     //             continue; // Skip invalid points
//     //         }

//     //         const points = await this.fetchRoadsNearPoint(current.lat, current.lng);

//     //         points.forEach((point, index) => {
//     //             const vertexId = `vertex_${point.location.latitude}_${point.location.longitude}`;
//     //             const vertex = {
//     //                 id: vertexId,
//     //                 lat: point.location.latitude,
//     //                 lng: point.location.longitude
//     //             };
//     //             this.addVertex(vertex);

//     //             if (index > 0) {
//     //                 const prevPoint = points[index - 1];
//     //                 const prevVertexId = `vertex_${prevPoint.location.latitude}_${prevPoint.location.longitude}`;
//     //                 const distance = this.calculateDistance(prevPoint.location, point.location);

//     //                 const edge = {
//     //                     id: `edge_${roadId}`,
//     //                     start: vertex,
//     //                     end: this.vertices.find(v => v.id === prevVertexId),
//     //                     length: distance,
//     //                     slope: 0 // Flat terrain assumption
//     //                 };
//     //                 this.addEdge(edge);
//     //                 roadId++;
//     //             }

//     //             const pointStr = `${point.location.latitude},${point.location.longitude}`;
//     //             if (!visited.has(pointStr)) {
//     //                 visited.add(pointStr);
//     //                 queue.push(point.location);
//     //             }
//     //         });
//     //     }

//     //     return { vertices: this.getVertices(), edges: this.getEdges() };
//     // }
//     //מדפיס מיקום אחד על המפה
//     async constructRoadNetwork(city) {
//         const boundaries = await this.fetchCityBoundaries(city);
//         if (!boundaries) {
//             console.error('Failed to fetch city boundaries');
//             return [];
//         }
    
//         const northEast = boundaries.northeast;
//         const southWest = boundaries.southwest;
//         const initialPoint = { lat: (northEast.lat + southWest.lat) / 2, lng: (northEast.lng + southWest.lng) / 2 };
    
//         let roadId = 1;
//         const roads = [];
//         const visited = new Set();
//         const queue = [initialPoint];
    
//         while (queue.length > 0) {
//             const current = queue.shift();
//             if (!current.lat || !current.lng) {
//                 continue; // Skip invalid points
//             }
    
//             const points = await this.fetchRoadsNearPoint(current.lat, current.lng);
    
//             points.forEach((point, index) => {
//                 const vertexId = `vertex_${point.location.latitude}_${point.location.longitude}`;
//                 const vertex = {
//                     id: vertexId,
//                     lat: point.location.latitude,
//                     lng: point.location.longitude
//                 };
//                 this.addVertex(vertex);
    
//                 if (index > 0) {
//                     const prevPoint = points[index - 1];
//                     const prevVertexId = `vertex_${prevPoint.location.latitude}_${prevPoint.location.longitude}`;
//                     const distance = this.calculateDistance(prevPoint.location, point.location);
    
//                     const edge = {
//                         id: `edge_${roadId}`,
//                         start: vertex,
//                         end: this.vertices.find(v => v.id === prevVertexId),
//                         length: distance,
//                         slope: 0 // Flat terrain assumption
//                     };
//                     this.addEdge(edge);
//                     roadId++;
//                 }
    
//                 const pointStr = `${point.location.latitude},${point.location.longitude}`;
//                 if (!visited.has(pointStr)) {
//                     visited.add(pointStr);
//                     queue.push(point.location);
//                 }
//             });
//         }
    
//         return { vertices: this.getVertices(), edges: this.getEdges() };
//     }
    
    
// }

// app.get('/roads', async (req, res) => {
//     const graph = new Graph();
//     const { vertices, edges } = await graph.constructRoadNetwork('Ashdod, Israel');
//     console.log(vertices);
//     console.log(edges);
//     res.json({ vertices, edges });
// });

// //Serve the HTML page for the root route
// app.get('/', (req, res) => {
//     res.send(`
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Road Map</title>
//             <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
//             <style>
//                 #map {
//                     height: 100vh;
//                 }
//             </style>
//         </head>
//         <body>
//             <div id="map"></div>
//             <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
//             <script>
//                 // Initialize the map
//                 const map = L.map('map').setView([31.8043, 34.6553], 13);

//                 // Add a tile layer to the map
//                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 }).addTo(map);

//                 // Fetch the road data from the server
//                 fetch('/roads')
//                     .then(response => response.json())
//                     .then(data => {
//                         const { vertices, edges } = data;

//                         vertices.forEach(vertex => {
//                             L.marker([vertex.lat, vertex.lng]).addTo(map).bindPopup(\`Vertex: \${vertex.id}\`);
//                         });

//                         edges.forEach(edge => {
//                             if (edge.start && edge.end) {
//                                 L.polyline([
//                                     [edge.start.lat, edge.start.lng],
//                                     [edge.end.lat, edge.end.lng]
//                                 ], { color: 'blue' }).addTo(map).bindPopup(\`Edge: \${edge.id}\`);
//                             }
//                         });
//                     })
//                     .catch(error => {
//                         console.error('Error fetching roads data:', error);
//                     });
//             </script>
//         </body>
//         </html>
//     `);
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });


// const express = require('express');
// const axios = require('axios');
// const path = require('path');
// const app = express();
// const port = 3000;

// class Graph {
//     constructor() {
//         this.vertices = new Map();
//         this.edges = new Map();
//     }

//     addVertex(vertex) {
//         if (!this.vertices.has(vertex.id)) {
//             this.vertices.set(vertex.id, vertex);
//         }
//     }

//     addEdge(edge) {
//         if (!this.edges.has(edge.id)) {
//             this.edges.set(edge.id, edge);
//         }
//     }

//     getVertices() {
//         return Array.from(this.vertices.values());
//     }

//     getEdges() {
//         return Array.from(this.edges.values());
//     }

//     async fetchCityBoundaries(city) {
//         const apiKey = 'YOUR_API_KEY';
//         const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}&key=${apiKey}`;

//         try {
//             const response = await axios.get(url);
//             const result = response.data.results[0];
//             return result.geometry.viewport;
//         } catch (error) {
//             console.error('Error fetching city boundaries from Google Maps:', error.response.data);
//             return null;
//         }
//     }

//     async fetchRoadsNearPoint(lat, lng) {
//         const apiKey = 'YOUR_API_KEY';
//         const url = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${apiKey}`;

//         try {
//             const response = await axios.get(url);
//             return response.data.snappedPoints || [];
//         } catch (error) {
//             console.error('Error fetching roads from Google Maps:', error.response.data);
//             return [];
//         }
//     }

//     calculateDistance(point1, point2) {
//         const R = 6371e3; // Earth's radius in meters
//         const lat1 = point1.lat * Math.PI / 180;
//         const lat2 = point2.lat * Math.PI / 180;
//         const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
//         const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;

//         const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//             Math.cos(lat1) * Math.cos(lat2) *
//             Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//         return R * c; // Distance in meters
//     }

//     async constructRoadNetwork(city) {
//         const boundaries = await this.fetchCityBoundaries(city);
//         if (!boundaries) {
//             console.error('Failed to fetch city boundaries');
//             return [];
//         }

//         const northEast = boundaries.northeast;
//         const southWest = boundaries.southwest;
//         const step = 0.01; // Step size for lat/lng increments

//         const visited = new Set();
//         const queue = [
//             { lat: northEast.lat, lng: northEast.lng },
//             { lat: northEast.lat, lng: southWest.lng },
//             { lat: southWest.lat, lng: northEast.lng },
//             { lat: southWest.lat, lng: southWest.lng }
//         ];

//         while (queue.length > 0) {
//             const current = queue.shift();
//             if (!current.lat || !current.lng) {
//                 continue; // Skip invalid points
//             }

//             const points = await this.fetchRoadsNearPoint(current.lat, current.lng);

//             points.forEach((point, index) => {
//                 const vertexId = `vertex_${point.location.latitude}_${point.location.longitude}`;
//                 const vertex = {
//                     id: vertexId,
//                     lat: point.location.latitude,
//                     lng: point.location.longitude
//                 };
//                 this.addVertex(vertex);

//                 if (index > 0) {
//                     const prevPoint = points[index - 1];
//                     const prevVertexId = `vertex_${prevPoint.location.latitude}_${prevPoint.location.longitude}`;
//                     const distance = this.calculateDistance(prevPoint.location, point.location);

//                     const edge = {
//                         id: `edge_${prevVertexId}_${vertexId}`,
//                         start: vertex,
//                         end: this.vertices.get(prevVertexId),
//                         length: distance,
//                         slope: 0 // Flat terrain assumption
//                     };
//                     this.addEdge(edge);
//                 }

//                 const pointStr = `${point.location.latitude},${point.location.longitude}`;
//                 if (!visited.has(pointStr)) {
//                     visited.add(pointStr);
//                     queue.push(point.location);

//                     // Add surrounding points to the queue
//                     queue.push({ lat: point.location.latitude + step, lng: point.location.longitude });
//                     queue.push({ lat: point.location.latitude - step, lng: point.location.longitude });
//                     queue.push({ lat: point.location.latitude, lng: point.location.longitude + step });
//                     queue.push({ lat: point.location.latitude, lng: point.location.longitude - step });
//                 }
//             });
//         }

//         return { vertices: this.getVertices(), edges: this.getEdges() };
//     }
// }

// app.get('/roads', async (req, res) => {
//     const graph = new Graph();
//     const { vertices, edges } = await graph.constructRoadNetwork('Ashdod, Israel');
//     res.json({ vertices, edges });
//     console.log(vertices);
//     console.log(edges);
// });

// // Serve the HTML page for the root route
// app.get('/', (req, res) => {
//     res.send(`
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Road Map</title>
//             <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
//             <style>
//                 #map {
//                     height: 100vh;
//                 }
//             </style>
//         </head>
//         <body>
//             <div id="map"></div>
//             <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
//             <script>
//                 // Initialize the map
//                 const map = L.map('map').setView([31.8043, 34.6553], 13);

//                 // Add a tile layer to the map
//                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 }).addTo(map);

//                 // Fetch the road data from the server
//                 fetch('/roads')
//                     .then(response => response.json())
//                     .then(data => {
//                         const { vertices, edges } = data;

//                         vertices.forEach(vertex => {
//                             L.marker([vertex.lat, vertex.lng]).addTo(map).bindPopup(\`Vertex: \${vertex.id}\`);
//                         });

//                         edges.forEach(edge => {
//                             if (edge.start && edge.end) {
//                                 L.polyline([
//                                     [edge.start.lat, edge.start.lng],
//                                     [edge.end.lat, edge.end.lng]
//                                 ], { color: 'blue' }).addTo(map).bindPopup(\`Edge: \${edge.id}\`);
//                             }
//                         });
//                     })
//                     .catch(error => {
//                         console.error('Error fetching roads data:', error);
//                     });
//             </script>
//         </body>
//         </html>
//     `);
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

// const express = require('express');
// const axios = require('axios');
// const path = require('path');
// const app = express();
// const port = 3000;


// async function fetchStreetData() {
//     const url = 'https://data.gov.il/api/3/action/datastore_search?resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b&q=%D7%90%D7%A9%D7%93%D7%95%D7%93';
//     try {
//         const response = await axios.get(url);
//         return response.data.result.records;
//     } catch (error) {
//         console.error('Error fetching street data:', error);
//         return [];
//     }
// }

// async function getStreetCoordinates(streetName) {
//     const apiKey = 'YOUR_API_KEY';
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(streetName + ', Ashdod, Israel')}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         const location = response.data.results[0]?.geometry?.location;
//         return location || null;
//     } catch (error) {
//         console.error('Error fetching street coordinates from Google Maps:', error.response.data);
//         return null;
//     }
// }

// function calculateDistance(point1, point2) {
//     const R = 6371e3; // Earth's radius in meters
//     const lat1 = point1.lat * Math.PI / 180;
//     const lat2 = point2.lat * Math.PI / 180;
//     const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
//     const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;

//     const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//         Math.cos(lat1) * Math.cos(lat2) *
//         Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in meters
// }

// function findIntersections(streets) {
//     const intersections = [];
//     for (let i = 0; i < streets.length; i++) {
//         for (let j = i + 1; j < streets.length; j++) {
//             const distance = calculateDistance(streets[i].location, streets[j].location);
//             if (distance < 50) { // Adjust threshold as needed
//                 intersections.push({ street1: streets[i], street2: streets[j], location: streets[i].location });
//             }
//         }
//     }
//     return intersections;
// }


// class Graph {
//     constructor() {
//         this.vertices = new Map();
//         this.edges = new Map();
//     }

//     addVertex(vertex) {
//         if (!this.vertices.has(vertex.id)) {
//             this.vertices.set(vertex.id, vertex);
//         }
//     }

//     addEdge(edge) {
//         if (!this.edges.has(edge.id)) {
//             this.edges.set(edge.id, edge);
//         }
//     }

//     getVertices() {
//         return Array.from(this.vertices.values());
//     }

//     getEdges() {
//         return Array.from(this.edges.values());
//     }

//     async buildGraph(streetData) {
//         const streets = [];

//         for (const street of streetData) {
//             const coordinates = await getStreetCoordinates(street.שם_רחוב);
//             if (coordinates) {
//                 streets.push({
//                     name: street.שם_רחוב,
//                     location: coordinates,
//                 });
//             }
//         }

//         const intersections = findIntersections(streets);
//         intersections.forEach(intersection => {
//             const vertexId = `vertex_${intersection.location.lat}_${intersection.location.lng}`;
//             const vertex = {
//                 id: vertexId,
//                 lat: intersection.location.lat,
//                 lng: intersection.location.lng,
//             };
//             this.addVertex(vertex);

//             const edgeId1 = `edge_${intersection.street1.name}_${intersection.street2.name}_1`;
//             const edge1 = {
//                 id: edgeId1,
//                 start: intersection.street1.name,
//                 end: vertexId,
//             };
//             this.addEdge(edge1);

//             const edgeId2 = `edge_${intersection.street2.name}_${intersection.street1.name}_2`;
//             const edge2 = {
//                 id: edgeId2,
//                 start: intersection.street2.name,
//                 end: vertexId,
//             };
//             this.addEdge(edge2);
//         });
//     }
// }

// (async () => {
//     const graph = new Graph();
//     const streetData = await fetchStreetData();
//     await graph.buildGraph(streetData);

//     console.log(graph.getVertices());
//     console.log(graph.getEdges());
// })();


// app.get('/roads', async (req, res) => {
//     const graph = new Graph();
//     const streetData = await fetchStreetData();
//     await graph.buildGraph(streetData);
//     res.json({ vertices: graph.getVertices(), edges: graph.getEdges() });
// });

// // Serve the HTML page for the root route
// app.get('/', (req, res) => {
//     res.send(`
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Road Map</title>
//             <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
//             <style>
//                 #map {
//                     height: 100vh;
//                 }
//             </style>
//         </head>
//         <body>
//             <div id="map"></div>
//             <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
//             <script>
//                 // Initialize the map
//                 const map = L.map('map').setView([31.8043, 34.6553], 13);

//                 // Add a tile layer to the map
//                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 }).addTo(map);

//                 // Fetch the road data from the server
//                 fetch('/roads')
//                     .then(response => response.json())
//                     .then(data => {
//                         const { vertices, edges } = data;

//                         vertices.forEach(vertex => {
//                             L.marker([vertex.lat, vertex.lng]).addTo(map).bindPopup(\`Vertex: \${vertex.id}\`);
//                         });

//                         edges.forEach(edge => {
//                             const startVertex = vertices.find(v => v.id === edge.start);
//                             const endVertex = vertices.find(v => v.id === edge.end);
//                             if (startVertex && endVertex) {
//                                 L.polyline([
//                                     [startVertex.lat, startVertex.lng],
//                                     [endVertex.lat, endVertex.lng]
//                                 ], { color: 'blue' }).addTo(map).bindPopup(\`Edge: \${edge.id}\`);
//                             }
//                         });
//                     })
//                     .catch(error => {
//                         console.error('Error fetching roads data:', error);
//                     });
//             </script>
//         </body>
//         </html>
//     `);
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });


const axios = require('axios');
const express = require('express');
const { Client } = require('@googlemaps/google-maps-services-js');
const app = express();
const port = 3000;

// הכנסת מפתח ה-API שלך כאן
const apiKey = 'YOUR_API_KEY';

// יצירת לקוח של Google Maps API
const client = new Client({});

async function getRoadsData() {
  try {
    const response = await axios.get('https://data.gov.il/api/3/action/datastore_search', {
      params: {
        resource_id: '9ad3862c-8391-4b2f-84a4-2d4c68625f4b',
        q: 'אשדוד'
      }
    });
    return response.data.result.records;
  } catch (error) {
    console.error('Error fetching roads data:', error);
    return [];
  }
}

async function getCoordinates(address) {
  try {
    const response = await client.geocode({
      params: {
        address: address,
        key: apiKey,
      }
    });
    if (response.data.results.length > 0) {
      return response.data.results[0].geometry.location;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
  }
}

async function snapToRoads(path) {
  try {
    const response = await client.snapToRoads({
      params: {
        path: path,
        interpolate: true,
        key: apiKey,
      }
    });
    return response.data.snappedPoints.map(point => point.location);
  } catch (error) {
    console.error('Error snapping to roads:', error);
  }
}

async function createGraph(roadsData) {
  const vertices = new Map();
  const edges = [];

  for (const road of roadsData) {
    const { from_street, to_street } = road;
    
    if (!vertices.has(from_street)) {
      const fromCoord = await getCoordinates(`אשדוד ${from_street}`);
      vertices.set(from_street, fromCoord);
    }
    
    if (!vertices.has(to_street)) {
      const toCoord = await getCoordinates(`אשדוד ${to_street}`);
      vertices.set(to_street, toCoord);
    }

    const fromCoord = vertices.get(from_street);
    const toCoord = vertices.get(to_street);

    if (fromCoord && toCoord) {
      // קבלת נתיב הכביש בין שתי הנקודות
      const snappedPath = await snapToRoads([
        `${fromCoord.lat},${fromCoord.lng}`,
        `${toCoord.lat},${toCoord.lng}`
      ]);

      const edge = {
        from: from_street,
        to: to_street,
        path: snappedPath,
      };
      edges.push(edge);
    }
  }

  return { vertices: Array.from(vertices.values()), edges };
}

app.get('/graph', async (req, res) => {
  const roadsData = await getRoadsData();
  console.log('Fetched roads data:', roadsData); // Add this line
  const graph = await createGraph(roadsData);
  console.log('Generated graph:', graph); // Add this line
  res.json(graph);
});

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Graph Visualization</title>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
    <script>
      async function initMap() {
        console.log('Initializing map...'); // Add this line
        try {
          const response = await fetch('/graph');
          const graph = await response.json();
          console.log('Fetched graph data:', graph); // Add this line

          const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: { lat: 31.8044, lng: 34.6553 } // מרכז אשדוד
          });

          // הוספת צמתים (vertices) למפה
          graph.vertices.forEach(vertex => {
            new google.maps.Marker({
              position: vertex,
              map: map,
            });
          });

          // הוספת קשתות (edges) למפה
          graph.edges.forEach(edge => {
            const path = edge.path.map(point => ({ lat: point.latitude, lng: point.longitude }));
            new google.maps.Polyline({
              path: path,
              geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 2,
              map: map,
            });
          });
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      }
    </script>
  </head>
  <body onload="initMap()">
    <div id="map" style="height: 100%; width: 100%;"></div>
  </body>
  </html>`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
