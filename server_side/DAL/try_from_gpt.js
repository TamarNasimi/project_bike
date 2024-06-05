const axios = require('axios');

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

    async fetchCoordinates(address) {
        const apiKey = 'AIzaSyDYircLat1lZ745yEtD9rVCDtc5JwpV9BU'; // Replace with your Google Maps API Key
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            const location = response.data.results[0].geometry.location;
            return {
                coordinate_x: location.lat,
                coordinate_y: location.lng
            };
        } catch (error) {
            console.error('Error fetching coordinates from Google Maps:', error);
            return null;
        }
    }

    async fetchNearbyRoads(lat, lng) {
        const apiKey = 'AIzaSyDYircLat1lZ745yEtD9rVCDtc5JwpV9BU'; // Replace with your Google Maps API Key
        const url = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            return response.data.snappedPoints;
        } catch (error) {
            console.error('Error fetching roads from Google Maps:', error);
            return [];
        }
    }

    async addVertexWithAddress(vertex_id, address) {
        const coordinates = await this.fetchCoordinates(address);
        if (coordinates) {
            this.addVertex({ vertex_id, address, ...coordinates });
            const roads = await this.fetchNearbyRoads(coordinates.coordinate_x, coordinates.coordinate_y);
            roads.forEach((road, index) => {
                this.addVertex({
                    vertex_id: `${vertex_id}_${index}`,
                    coordinate_x: road.location.latitude,
                    coordinate_y: road.location.longitude,
                    address: road.placeId // You can fetch detailed address using Place Details API if needed
                });

                if (index > 0) {
                    this.addEdge({
                        edge_id: `${vertex_id}_${index - 1}_${index}`,
                        time: 0, // Replace with actual travel time if needed
                        sum_of_sport: 0,
                        sum_of_traveling: 0,
                        slope: 0, // Replace with actual slope if needed
                        distance: 0, // Replace with actual distance if needed
                        closed_street: false,
                        complex_transition: false,
                        from: `${vertex_id}_${index - 1}`,
                        to: `${vertex_id}_${index}`
                    });
                }
            });
        }
    }
}

module.exports = Graph;

// Usage example
(async () => {
    const graph = new Graph();
    await graph.addVertexWithAddress('vertex_1', 'Rav Hisda Street, Ashdod');
    console.log(graph.getVertices());
    console.log(graph.getEdges());
})();