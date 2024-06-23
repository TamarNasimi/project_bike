
const fs = require('fs');
const axios = require('axios');
const apiKey = 'YOUR_API'; // החלף במפתח ה-API שלך

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
  try{
  const response = await axios.get(url);
  const data = response.data;

  if (data.routes.length > 0 && data.routes[0].legs.length > 0) {
    const steps = data.routes[0].legs[0].steps;
    if (steps.length === 1) {
      return {
        fromCoordinates: { lat: start.lat, lng: start.lng },
        toCoordinates: { lat: end.lat, lng: end.lng },
        distance: steps[0].distance.value, //מחזיר את המרחק במטרים
        duration: steps[0].duration.value, //מחזיר את הזמן בשניות
        closed_street: true
      };
    }
  }
}
catch (error) {
  console.error(`Error fetching road data: ${error}`);
}
  return null;
}


// פונקציה לקבלת גובה של נקודה
async function getElevation(location) {
  const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${location.lat},${location.lng}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.results.length > 0) {
      return data.results[0].elevation;
    }
  } catch (error) {
    console.error(`Error fetching elevation data: ${error}`);
  }
  return null;
}


// פונקציה לבניית הגרף
async function buildGraph() {
  const graph = {};

  // אתחול גרף עם צמתים ריקים
  vertices.forEach(vertex => {
    graph[vertex.id] = { coordinates: [vertex.lat, vertex.lng], edges: [] };
  });

  // לולאה על כל זוגות הצמתים לבדיקת כבישים ישירים
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const start = vertices[i];
      const end = vertices[j];
      const roadData = await getRoadData(start, end);
      //אם החזיר מידע אודות הכביש
      if (roadData) {
        const startElevation = await getElevation(start);//פונקציה להחזרת השיפוע
        const endElevation = await getElevation(end);
        //חישוב השיפוע בין שתי הנקודות
        if (startElevation !== null && endElevation !== null) {
          const elevationDifference = endElevation - startElevation;
          const distance = roadData.distance; // במטרים
          const slope = parseFloat((elevationDifference / distance).toFixed(2));
          
          const complex_transition = slope; //מעבר מורכב-בהתחלה שווה לשיפוע, בהמשך על פי המשתמשים

        graph[start.id].edges.push({
          to: end.id,
          toCoordinates: roadData.toCoordinates,
          distance: roadData.distance,
          duration: roadData.duration,
          slope: slope,
          complex_transition: complex_transition,
          closed_street: roadData.closed_street
        });
        graph[end.id].edges.push({
          to: start.id,
          toCoordinates: roadData.fromCoordinates,
          distance: roadData.distance,
          duration: roadData.duration,
          slope: -slope, //השיפוע נגדי מהכיוון הנגדי
          complex_transition: complex_transition,
          closed_street: roadData.closed_street
        });
      }
    }
  }
}

  // שמירת הגרף לקובץ
  fs.writeFileSync('graph2.json', JSON.stringify(graph, null, 2), 'utf8');
}

// קריאה לפונקציה לבניית הגרף
buildGraph().then(() => {
  console.log('Graph built successfully');
}).catch(err => {
  console.error('Error building graph:', err);
});

