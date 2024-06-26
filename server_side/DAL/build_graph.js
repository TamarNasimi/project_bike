
const fs = require('fs');
const axios = require('axios');
const { Graph } = require('graphlib'); // require graphlib

  const nodesMap = {};
const graph = new Graph({ directed: false }); // create an undirected graph

// פונקציה לקבלת המידע אודות הכבישים של עיר שהתקבלה
async function fetchWaysFromOverpass(cityName) {

const overpassQuery = `
[out:json][timeout:25];
area[name="${cityName}"]->.ny;
way(area.ny)["highway"~"^(trunk|primary|secondary|tertiary|unclassified|residential)$"];
out body geom;
`;
  try {
    const response = await axios.post('https://overpass-api.de/api/interpreter', overpassQuery, {
      headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Overpass API:', error);
    return null;
  }
}
//פונקציה לבניית הגרף
async function buildGraph(cityName) {

  //זימון פונקציה לקבלת המידע אודות העיר
  const jsonData = await fetchWaysFromOverpass(cityName);
  if (!jsonData) return;

// מיפוי כל הצמתים בדרכים
jsonData.elements.forEach(way => {
  way.nodes.forEach((nodeId, index) => {
    if (!nodesMap[nodeId]) {
      const { lat, lon } = way.geometry[index];
      nodesMap[nodeId] = {
        type: 'node',
        id: nodeId,
        lat: lat,
        lng: lon,
        edges: []
      };
      graph.setNode(nodeId, { lat, lon }); // add node to the graph
    }
  });
});


 // מעבר על כל הדרכים והוספת חיבורים ישירים
 jsonData.elements.forEach(way => {
  if (way.type === 'way' && way.nodes && way.nodes.length > 1) {
    for (let i = 0; i < way.nodes.length - 1; i++) {
      const source = way.nodes[i];
      const target = way.nodes[i + 1];
       if (nodesMap[source] && nodesMap[target]) {
        if (!nodesMap[source].edges.some(edge => edge.id === target)) {
          nodesMap[source].edges.push({
            id: target,
            lat: nodesMap[target].lat,
            lng: nodesMap[target].lng
          });
          graph.setEdge(source, target); // add edge to the graph
        }
        if (!nodesMap[target].edges.some(edge => edge.id === source)) {
          nodesMap[target].edges.push({
            id: source,
            lat: nodesMap[source].lat,
            lng: nodesMap[source].lng
          });
          graph.setEdge(target, source); // add edge to the graph
        }
       }
    }
  }
});
}

let cityName = "אלעד";

buildGraph(cityName).then(() => {
  console.log('Graph built successfully');
  fs.writeFileSync('nodes.json', JSON.stringify(nodesMap, null, 2));
  fs.writeFileSync('graph.json', JSON.stringify(graph, null, 2));
}).catch(err => {
  console.error('Error building graph:', err);
});
