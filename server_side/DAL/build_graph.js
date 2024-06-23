const fs = require('fs');
const axios = require('axios');
const { Graph } = require('graphlib');

let vertices;
try {
  const data = fs.readFileSync('./DAL/nodes.json', 'utf8');
  const jsonData = JSON.parse(data);
  vertices = jsonData.elements.map(element => ({
    id: element.id,
    lat: element.lat,
    lng: element.lon
  }));
} catch (error) {
  console.error("Error reading or parsing nodes.json:", error);
  process.exit(1);
}

let ways;
try {
  const data = fs.readFileSync('./DAL/edges.json', 'utf8');
  const jsonData = JSON.parse(data);
  ways = jsonData.elements.map(element => ({
    id: element.id,
    nodes: element.nodes
  }));
} catch (error) {
  console.error("Error reading or parsing edges.json:", error);
  process.exit(1);
}

// פונקציה לבניית הגרף
async function buildGraph() {
    const graph = new Graph();
  
    // אתחול גרף עם צמתים ריקים
    vertices.forEach(vertex => {
      graph.setNode(vertex.id, { coordinates: [vertex.lat, vertex.lng], edges: [] });
    });

    ways.forEach(way => {
        const nodes = way.nodes;
        for (let i = 0; i < nodes.length - 1; i++) {
          if (graph.hasNode(nodes[i]) && graph.hasNode(nodes[i + 1])) {
            graph.setEdge(nodes[i], nodes[i + 1], way.id);
            graph.node(nodes[i]).edges.push(nodes[i + 1]);
            graph.node(nodes[i + 1]).edges.push(nodes[i]);
          }
        }
      });
  
    // שמירת הגרף לקובץ
    fs.writeFileSync('graph.json', JSON.stringify(graph, null, 2), 'utf8');
  }
  
  // קריאה לפונקציה לבניית הגרף
  buildGraph().then(() => {
    console.log('Graph built successfully');
  }).catch(err => {
    console.error('Error building graph:', err);
  });