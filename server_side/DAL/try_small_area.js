
const fs = require('fs');
const axios = require('axios');
const apiKey = 'API_KEY'; // החלף במפתח ה-API שלך

// קריאת קובץ הצמתים
let vertices;
try {
  const data = fs.readFileSync('./DAL/vertices.json', 'utf8');
  const jsonData = JSON.parse(data);
  vertices = jsonData.features.map(feature => ({
    id: feature.id,
    lat: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0]
  }));
} catch (error) {
  console.error("Error reading or parsing vertices.json:", error);
  process.exit(1);
}

// פונקציה לקבלת נתוני כביש ישיר בין שני צמתים במצב רכיבה על אופניים
async function getRoadData(start, end) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&mode=bicycling&key=${apiKey}`;
  const response = await axios.get(url);
  const data = response.data;

  if (data.routes.length > 0 && data.routes[0].legs.length > 0) {
    const steps = data.routes[0].legs[0].steps;
    if (steps.length === 1) {
      return {
        fromCoordinates: { lat: start.lat, lng: start.lng },
        toCoordinates: { lat: end.lat, lng: end.lng },
        distance: steps[0].distance.text,
        duration: steps[0].duration.text
      };
    }
  }
  return null;
}

// פונקציה לבניית הגרף
async function buildGraph() {
  const graph = {};

  // אתחול גרף עם צמתים ריקים
  vertices.forEach(vertex => {
    graph[vertex.id] = { edges: [], coordinates: [vertex.lng, vertex.lat]};
  });

  // לולאה על כל זוגות הצמתים לבדיקת כבישים ישירים
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const start = vertices[i];
      const end = vertices[j];
      const roadData = await getRoadData(start, end);

      if (roadData) {
        graph[start.id].edges.push({
          to: end.id,
          //fromCoordinates: roadData.fromCoordinates,
          toCoordinates: roadData.toCoordinates,
          distance: roadData.distance,
          duration: roadData.duration,
          closed_street: true
        });
        graph[end.id].edges.push({
          to: start.id,
         // fromCoordinates: roadData.toCoordinates,
          toCoordinates: roadData.fromCoordinates,
          distance: roadData.distance,
          duration: roadData.duration,
          closed_street: true
        });
      }
    }
  }

  // שמירת הגרף לקובץ
  fs.writeFileSync('graph1.json', JSON.stringify(graph, null, 2), 'utf8');
}

// קריאה לפונקציה לבניית הגרף
buildGraph().then(() => {
  console.log('Graph built successfully');
}).catch(err => {
  console.error('Error building graph:', err);
});

