
const axios = require('axios');
const Vertices = require('./Vertices');
const Edges = require('./Edges');

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

    async fetchFromGoogleMaps(address) {
        const apiKey = 'AIzaSyDYircLat1lZ745yEtD9rVCDtc5JwpV9BU';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            const location = response.data.results[0].geometry.location;
            return {
                coordinate_x: location.lat,
                coordinate_y: location.lng
            };
        } catch (error) {
            console.error('Error fetching data from Google Maps:', error);
            return null;
        }
    }

    async addVertexWithAddress(vertex_id, address) {
        const coordinates = await this.fetchFromGoogleMaps(address);
        if (coordinates) {
            this.addVertex({ vertex_id, address, ...coordinates });
        }
    }
}

export default Graph;
