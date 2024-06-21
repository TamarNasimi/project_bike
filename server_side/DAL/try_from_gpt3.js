// const express = require('express');
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// const app = express();
// const port = 3000;

// // קריאה ל-API של הכבישים באשדוד
// async function fetchRoadsData() {
//     try {
//         const response = await fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b&q=%D7%90%D7%A9%D7%93%D7%95%D7%93');
//         const data = await response.json();
//         return data.result.records;
//     } catch (error) {
//         console.error('Error fetching roads data:', error);
//         return [];
//     }
// }

// // השהיה של 200ms בין הבקשות ל-Google Maps Geocoding API
// function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// // המרת כתובת לקואורדינטות באמצעות API של Google Maps Geocoding
// async function geocodeAddress(address) {
//     try {
//         await delay(200); // השהיה של 200ms
//         const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', אשדוד, ישראל')}&key=API_KEY`);
//         const data = await response.json();
//         if (data.results && data.results.length > 0) {
//             const location = data.results[0].geometry.location;
//             return { lat: location.lat, lng: location.lng };
//         } else {
//             console.error('No results found for address:', address);
//             return null;
//         }
//     } catch (error) {
//         console.error('Error geocoding address:', error);
//         return null;
//     }
// }

// // קבלת נתיב כביש מ-Google Maps Roads API
// async function getRoadsPath(location) {
//     try {
//         await delay(200); // השהיה של 200ms
//         const response = await fetch(`https://roads.googleapis.com/v1/nearestRoads?points=${location.lat},${location.lng}&key=API_KEY`);
//         const data = await response.json();
//         return data.snappedPoints;
//     } catch (error) {
//         console.error('Error fetching roads path:', error);
//         return null;
//     }
// }

// // יצירת קשתות בין הצמתים באשדוד
// async function createGraph() {
//     const roadsData = await fetchRoadsData();
//     const nodes = {};
//     const edges = [];

//     // יצירת צמתים וקשתות ביניהם
//     for (const road of roadsData) {
//         const address = road.שם_רחוב;

//         // המרת כתובת לקואורדינטות
//         const location = await geocodeAddress(address);
//         if (!location) continue;

//         // קבלת נתיב הכביש מ-Google Maps Roads API
//         const roadPath = await getRoadsPath(location);
//         if (!roadPath) continue;

//         // הוספת הצמתים והקשתות לגרף
//         roadPath.forEach((point, index) => {
//             const nodeKey = `${point.location.latitude},${point.location.longitude}`;
//             if (!nodes[nodeKey]) {
//                 nodes[nodeKey] = { lat: point.location.latitude, lng: point.location.longitude };
//             }
//             if (index > 0) {
//                 const previousPoint = roadPath[index - 1];
//                 const edge = {
//                     source: `${previousPoint.location.latitude},${previousPoint.location.longitude}`,
//                     target: nodeKey
//                 };
//                 edges.push(edge);
//             }
//         });
//     }

//     return { nodes, edges };
// }

// // נתב HTTP שמחזיר את הגרף
// app.get('/graph', async (req, res) => {
//     try {
//         const graph = await createGraph();
//         res.json(graph);
//         console.log(graph.nodes);
//         console.log(graph.edges);
//     } catch (error) {
//         res.status(500).send('Error generating graph');
//     }
// });

// // הגשת קבצים סטטיים מהתיקייה public
// app.use(express.static('public'));

// // HTML ותסריט להצגת המפה והגרף
// app.get('/', (req, res) => {
//     res.send(`
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Graph Visualization</title>
//     <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
//     <style>
//         #map {
//             height: 100vh;
//             width: 100%;
//         }
//     </style>
// </head>
// <body>
//     <div id="map"></div>
//     <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
//     <script src="https://d3js.org/d3.v6.min.js"></script>
//     <script>
//         async function loadGraphData() {
//             const response = await fetch('/graph');
//             return await response.json();
//         }

//         function drawGraph(nodes, edges) {
//             const map = L.map('map').setView([31.801447, 34.643497], 13);

//             L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                 maxZoom: 19,
//             }).addTo(map);

//             edges.forEach(edge => {
//                 const source = nodes[edge.source];
//                 const target = nodes[edge.target];
//                 L.polyline([source, target], { color: 'blue' }).addTo(map);
//             });

//             Object.values(nodes).forEach(node => {
//                 L.circleMarker(node, { radius: 5, color: 'red' }).addTo(map);
//             });
//         }

//         loadGraphData().then(graph => {
//             drawGraph(graph.nodes, graph.edges);
//         });
//     </script>
// </body>
// </html>
//     `);
// });

// // הפעלת השרת
// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });


// const axios = require('axios');
// const fs = require('fs');
// const API_KEY = 'API_KEY'; // החלף את זה במפתח ה-API שלך
// const express = require('express');
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// const app = express();
// const port = 3000;

// async function fetchPlaces() {
//   const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=streets+in+Ashdod&key=${API_KEY}`;
  
//   try {
//     const response = await axios.get(url);
//     const places = response.data.results;
//     return places.map(place => ({
//       name: place.name,
//       location: place.geometry.location
//     }));
//   } catch (error) {
//     console.error('Error fetching places:', error);
//     return [];
//   }
// }

// fetchPlaces().then(places => {
//   fs.writeFileSync('./DAL/places.json', JSON.stringify(places, null, 2));
//   console.log('Places saved to places.json');
// });

//const places = JSON.parse(fs.readFileSync('./DAL/places.json'));
//console.log(places.slice(0, 10)); // הדפסת 10 הרחובות הראשונים לבדיקה


// async function fetchDirections(origin, destination) {
//   const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving&key=${API_KEY}`;
  
//   try {
//     const response = await axios.get(url);
//     const route = response.data.routes[0];
//     return route ? route.legs[0].steps.map(step => ({
//       start: step.start_location,
//       end: step.end_location,
//       distance: step.distance.value,
//       duration: step.duration.value
//     })) : [];
//   } catch (error) {
//     console.error('Error fetching directions:', error);
//     return [];
//   }
// }

// async function buildGraph() {
//   const graph = {};
  
//   for (let i = 0; i < places.length; i++) {
//     for (let j = i + 1; j < places.length; j++) {
//       const origin = places[i].location;
//       const destination = places[j].location;
//       const steps = await fetchDirections(origin, destination);

//       if (!graph[places[i].name]) {
//         graph[places[i].name] = [];
//       }

//       if (!graph[places[j].name]) {
//         graph[places[j].name] = [];
//       }

//       steps.forEach(step => {
//         graph[places[i].name].push({
//           street: places[j].name,
//           start: step.start,
//           end: step.end,
//           distance: step.distance,
//           duration: step.duration
//         });

//         graph[places[j].name].push({
//           street: places[i].name,
//           start: step.start,
//           end: step.end,
//           distance: step.distance,
//           duration: step.duration
//         });
//       });
//     }
//   }

//   fs.writeFileSync('./DAL/graph.json', JSON.stringify(graph, null, 2));
//   console.log('Graph saved to graph.json');
// }

// buildGraph();

// // הגשת קבצים סטטיים מהתיקייה public
// app.use(express.static('public'));

// // HTML ותסריט להצגת המפה והגרף
// app.get('/', (req, res) => {
//     res.send(`
// <!DOCTYPE html>
// <html>
// <head>
//   <title>Graph Street Segments Coloring</title>
//   <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
//   <style>
//     #map {
//       height: 600px;
//       width: 100%;
//     }
//   </style>
// </head>
// <body>
//   <div id="map"></div>
//   <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
//   <script>
//     fetch('./DAL/graph.json')
//       .then(response => response.json())
//       .then(graph => {
//         const map = L.map('map').setView([31.801447, 34.643497], 13); // מרכז אשדוד
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           maxZoom: 19
//         }).addTo(map);

//         // להוסיף קווים בין נקודות ההתחלה והסיום בגרף
//         graph.forEach(edge => {
//           const start = edge.start;
//           const end = edge.end;
//           const color = edge.color; // צבע הקו (אדום, כחול, וכו')

//           // ליצור קו על מפה מנקודת ההתחלה לנקודת הסיום
//           L.polyline([
//             [start.lat, start.lng],
//             [end.lat, end.lng]
//           ], { color: color }).addTo(map);
//         });
//       })
//       .catch(error => console.error('Error loading graph:', error));
//   </script>
// </body>
// </html>
//     `);
// });

// // הפעלת השרת
// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });

// // הגשת קבצים סטטיים מהתיקייה public
// app.use(express.static('public'));

// // HTML ותסריט להצגת המפה והגרף
// app.get('/', (req, res) => {
//     res.send(`
// <!DOCTYPE html>
// <html>
// <head>
//   <title>Graph Street Segments Coloring</title>
//   <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
//   <style>
//     #map {
//       height: 600px;
//       width: 100%;
//     }
//   </style>
// </head>
// <body>
//   <div id="map"></div>
//   <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
//   <script>
//     fetch('/graph')
//       .then(response => response.json())
//       .then(graph => {
//         const map = L.map('map').setView([31.801447, 34.643497], 13); // מרכז אשדוד
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           maxZoom: 19
//         }).addTo(map);

//         // להוסיף קווים בין נקודות ההתחלה והסיום בגרף
//         graph.edges.forEach(edge => {
//           const start = graph.nodes[edge.source];
//           const end = graph.nodes[edge.target];

//           // ליצור קו על מפה מנקודת ההתחלה לנקודת הסיום
//           L.polyline([
//             [start.lat, start.lng],
//             [end.lat, end.lng]
//           ], { color: 'blue' }).addTo(map); // צבע כחול לכל הקווים
//         });
//       })
//       .catch(error => console.error('Error loading graph:', error));
//   </script>
// </body>
// </html>
//     `);
// });

// // נתב HTTP שמחזיר את הגרף
// app.get('/graph', (req, res) => {
//     fs.readFile('./DAL/graph.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading graph.json:', err);
//             res.status(500).send('Error reading graph');
//             return;
//         }
//         try {
//             const graph = JSON.parse(data);
//             res.json(graph);
//         } catch (err) {
//             console.error('Error parsing graph.json:', err);
//             res.status(500).send('Error parsing graph');
//         }
//     });
// });

// // הפעלת השרת
// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });

// const axios = require('axios');
// const fs = require('fs');
// const API_KEY = 'API_KEY';

// const cityCenter = {
//     lat: 31.801447,
//     lng: 34.643497
// };
// const cityRadius = 10000; // רדיוס של 10 ק"מ

// async function getPlaces() {
//     try {
//         const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${cityCenter.lat},${cityCenter.lng}&radius=${cityRadius}&key=${API_KEY}`);
//         if (response.data && response.data.results) {
//             return response.data.results.map(place => place.geometry.location);
//         } else {
//             console.error('No places found in response');
//             return [];
//         }
//     } catch (error) {
//         console.error('Error fetching places:', error);
//         return [];
//     }
// }

// async function getDirections(start, end) {
//     try {
//         const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&key=${API_KEY}`);
//         if (response.data && response.data.routes && response.data.routes.length > 0) {
//             return response.data.routes[0].legs[0].steps;
//         } else {
//             console.error('No routes found in response');
//             return [];
//         }
//     } catch (error) {
//         console.error('Error fetching directions:', error);
//         return [];
//     }
// }

// async function buildGraph() {
//     const places = await getPlaces();

//     if (!places.length) {
//         console.error('No places found, cannot build graph');
//         return;
//     }

//     const graph = {};

//     for (let i = 0; i < places.length - 1; i++) {
//         const start = places[i];
//         const end = places[i + 1];
//         const directions = await getDirections(start, end);

//         directions.forEach(step => {
//             const startPoint = `${step.start_location.lat},${step.start_location.lng}`;
//             const endPoint = `${step.end_location.lat},${step.end_location.lng}`;
//             const distance = step.distance.value; // distance in meters
//             const duration = step.duration.value; // duration in seconds

//             if (!graph[startPoint]) graph[startPoint] = [];
//             graph[startPoint].push({
//                 end: endPoint,
//                 distance: distance,
//                 duration: duration
//             });
//         });
//     }

//     fs.writeFileSync('graph.json', JSON.stringify(graph, null, 2));
//     console.log('Graph built and saved to graph.json');
// }

// buildGraph();


// const fs = require('fs');

// // קריאת הקובץ JSON
// const rawData = fs.readFileSync('graph.json');
// const graphData = JSON.parse(rawData);

// // בניית הגרף
// const graph = {};

// // הוספת הצמתים והקשתות
// for (const [startNode, edges] of Object.entries(graphData)) {
//   if (!graph[startNode]) {
//     graph[startNode] = [];
//   }
//   for (const edge of edges) {
//     graph[startNode].push({ end: edge.end, distance: edge.distance, duration: edge.duration });
//   }
// }

// // הדפסת הצמתים והקשתות
// console.log('created graph:');
// for (const [node, edges] of Object.entries(graph)) {
//   console.log(`verties: ${node}`);
//   for (const edge of edges) {
//     console.log(`  edge: ${node} -> ${edge.end}, distance: ${edge.distance}, time: ${edge.duration}`);
//   }
// }

// // בדיקת הכיסוי של כל העיר
// const allNodes = new Set(Object.keys(graph));
// for (const edges of Object.values(graph)) {
//   for (const edge of edges) {
//     allNodes.add(edge.end);
//   }
// }

// console.log(`sum all verties: ${allNodes.size}`);
// console.log('sum all edges:', [...allNodes].join(', '));



// const axios = require('axios');
// const API_KEY = 'API_KEY'; // החלף את זה במפתח ה-API שלך

// // פונקציה שמביאה את הכבישים בין שתי צמתים
// async function getRoadsBetweenNodes(startNode, endNode) {
//     const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startNode.lat},${startNode.lng}&destination=${endNode.lat},${endNode.lng}&mode=driving&key=${API_KEY}`;

//     try {
//         const response = await axios.get(url);
//         const route = response.data.routes[0];
//         if (route && route.legs.length > 0) {
//             return route.legs[0].steps.map(step => ({
//                 start: step.start_location,
//                 end: step.end_location,
//                 distance: step.distance.value,
//                 duration: step.duration.value,
//                 instructions: step.html_instructions
//             }));
//         } else {
//             throw new Error('No route found');
//         }
//     } catch (error) {
//         console.error('Error fetching roads:', error);
//         throw error;
//     }
// }

// // דוגמת שימוש בפונקציה
// (async () => {
//     const startNode = { lat: 31.7909808 , lng: 34.6641221  }; // נקודת התחלה לדוגמה
//     const endNode = { lat: 31.7895899 , lng:34.662333}; // נקודת סיום לדוגמה

//     try {
//         const roads = await getRoadsBetweenNodes(startNode, endNode);
//         console.log('Roads between nodes:', roads);
//     } catch (error) {
//         console.error('Failed to get roads:', error);
//     }
// })();
