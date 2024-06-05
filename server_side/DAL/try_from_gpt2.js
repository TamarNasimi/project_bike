const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

class Graph {
    constructor() {
        this.vertices = [];
        this.edges = [];
    }

    addVertex(vertex) {
        this.vertices.push(vertex);
    }

    addEdge(edge) {
        this.edges.push(edge);
    }

    getVertices() {
        return this.vertices;
    }

    getEdges() {
        return this.edges;
    }

    findVertexById(vertex_id) {
        return this.vertices.find(v => v.vertex_id === vertex_id);
    }

    findEdgeById(edge_id) {
        return this.edges.find(e => e.edge_id === edge_id);
    }

    async fetchCityBoundaries(city) {
        const apiKey = 'your Google Maps API Key'; // Replace with your Google Maps API Key
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            const result = response.data.results[0];
            return result.geometry.viewport;
        } catch (error) {
            console.error('Error fetching city boundaries from Google Maps:', error.response.data);
            return null;
        }
    }

    async fetchRoadsNearPoint(lat, lng) {
        const apiKey = 'your Google Maps API Key'; // Replace with your Google Maps API Key
        const url = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            return response.data.snappedPoints || [];
        } catch (error) {
            console.error('Error fetching roads from Google Maps:', error.response.data);
            return [];
        }
    }

    calculateDistance(point1, point2) {
        const R = 6371e3; // Earth's radius in meters
        const lat1 = point1.lat * Math.PI / 180;
        const lat2 = point2.lat * Math.PI / 180;
        const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
        const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    // async constructRoadNetwork(city) {
    //     const boundaries = await this.fetchCityBoundaries(city);
    //     if (!boundaries) {
    //         console.error('Failed to fetch city boundaries');
    //         return [];
    //     }

    //     const northEast = boundaries.northeast;
    //     const southWest = boundaries.southwest;
    //     const extremePoints = [
    //         { lat: northEast.lat, lng: northEast.lng },
    //         { lat: northEast.lat, lng: southWest.lng },
    //         { lat: southWest.lat, lng: northEast.lng },
    //         { lat: southWest.lat, lng: southWest.lng }
    //     ];

    //     const visited = new Set();
    //     const queue = [...extremePoints];

    //     let roadId = 1;
    //     const roads = [];
    //     const roadMap = new Map();

    //     while (queue.length > 0) {
    //         const current = queue.shift();
    //         if (!current.lat || !current.lng) {
    //             continue; // Skip invalid points
    //         }

    //         const points = await this.fetchRoadsNearPoint(current.lat, current.lng);

    //         points.forEach((point, index) => {
    //             const vertexId = `vertex_${point.location.latitude}_${point.location.longitude}`;
    //             const vertex = {
    //                 id: vertexId,
    //                 lat: point.location.latitude,
    //                 lng: point.location.longitude
    //             };
    //             this.addVertex(vertex);

    //             if (index > 0) {
    //                 const prevPoint = points[index - 1];
    //                 const prevVertexId = `vertex_${prevPoint.location.latitude}_${prevPoint.location.longitude}`;
    //                 const distance = this.calculateDistance(prevPoint.location, point.location);

    //                 const edge = {
    //                     id: `edge_${roadId}`,
    //                     start: vertex,
    //                     end: this.vertices.find(v => v.id === prevVertexId),
    //                     length: distance,
    //                     slope: 0 // Flat terrain assumption
    //                 };
    //                 this.addEdge(edge);
    //                 roadId++;
    //             }

    //             const pointStr = `${point.location.latitude},${point.location.longitude}`;
    //             if (!visited.has(pointStr)) {
    //                 visited.add(pointStr);
    //                 queue.push(point.location);
    //             }
    //         });
    //     }

    //     return { vertices: this.getVertices(), edges: this.getEdges() };
    // }
    async constructRoadNetwork(city) {
        const boundaries = await this.fetchCityBoundaries(city);
        if (!boundaries) {
            console.error('Failed to fetch city boundaries');
            return [];
        }
    
        const northEast = boundaries.northeast;
        const southWest = boundaries.southwest;
        const initialPoint = { lat: (northEast.lat + southWest.lat) / 2, lng: (northEast.lng + southWest.lng) / 2 };
    
        let roadId = 1;
        const roads = [];
        const visited = new Set();
        const queue = [initialPoint];
    
        while (queue.length > 0) {
            const current = queue.shift();
            if (!current.lat || !current.lng) {
                continue; // Skip invalid points
            }
    
            const points = await this.fetchRoadsNearPoint(current.lat, current.lng);
    
            points.forEach((point, index) => {
                const vertexId = `vertex_${point.location.latitude}_${point.location.longitude}`;
                const vertex = {
                    id: vertexId,
                    lat: point.location.latitude,
                    lng: point.location.longitude
                };
                this.addVertex(vertex);
    
                if (index > 0) {
                    const prevPoint = points[index - 1];
                    const prevVertexId = `vertex_${prevPoint.location.latitude}_${prevPoint.location.longitude}`;
                    const distance = this.calculateDistance(prevPoint.location, point.location);
    
                    const edge = {
                        id: `edge_${roadId}`,
                        start: vertex,
                        end: this.vertices.find(v => v.id === prevVertexId),
                        length: distance,
                        slope: 0 // Flat terrain assumption
                    };
                    this.addEdge(edge);
                    roadId++;
                }
    
                const pointStr = `${point.location.latitude},${point.location.longitude}`;
                if (!visited.has(pointStr)) {
                    visited.add(pointStr);
                    queue.push(point.location);
                }
            });
        }
    
        return { vertices: this.getVertices(), edges: this.getEdges() };
    }
    
    
}

app.get('/roads', async (req, res) => {
    const graph = new Graph();
    const { vertices, edges } = await graph.constructRoadNetwork('Ashdod, Israel');
    console.log(vertices);
    console.log(edges);
    res.json({ vertices, edges });
});

//Serve the HTML page for the root route
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Road Map</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
            <style>
                #map {
                    height: 100vh;
                }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
            <script>
                // Initialize the map
                const map = L.map('map').setView([31.8043, 34.6553], 13);

                // Add a tile layer to the map
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Fetch the road data from the server
                fetch('/roads')
                    .then(response => response.json())
                    .then(data => {
                        const { vertices, edges } = data;

                        vertices.forEach(vertex => {
                            L.marker([vertex.lat, vertex.lng]).addTo(map).bindPopup(\`Vertex: \${vertex.id}\`);
                        });

                        edges.forEach(edge => {
                            if (edge.start && edge.end) {
                                L.polyline([
                                    [edge.start.lat, edge.start.lng],
                                    [edge.end.lat, edge.end.lng]
                                ], { color: 'blue' }).addTo(map).bindPopup(\`Edge: \${edge.id}\`);
                            }
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching roads data:', error);
                    });
            </script>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


