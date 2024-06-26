const fs = require('fs');
const axios = require('axios');
const { Graph } = require('graphlib');

let vertices;
try {
  const data = fs.readFileSync('./DAL/elad_nodes.json', 'utf8');
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
  const data = fs.readFileSync('./DAL/elad_edges.json', 'utf8');
  const jsonData = JSON.parse(data);
  ways = jsonData.elements.map(element => ({
    id: element.id,
    nodes: element.geometry
  }));
} catch (error) {
  console.error("Error reading or parsing edges.json:", error);
  process.exit(1);
}


function roundCoordinate(coord) {
  return Math.round(coord * 10000) / 10000;
}


// פונקציה לבניית הגרף
async function buildGraph() {
    const graph = new Graph();
  
    // אתחול גרף עם צמתים ריקים
    vertices.forEach(vertex => {
      graph.setNode(vertex.id, { coordinates: [vertex.lat, vertex.lng], edges: [] });
    });
   // console.log(vertices);

    ways.forEach(way => {
        const nodes = way.nodes;  
    //console.log(nodes);

        for (let i = 0; i < nodes.length - 1; i++) {
          let ver=vertices.find(v=>(roundCoordinate(v.lat) == roundCoordinate(nodes[i].lat)) && (roundCoordinate(v.lng) == roundCoordinate(nodes[i].lon))
                                && (v.lat != nodes[i].lat && v.lng != nodes[i].lon))
          if (graph.hasNode(nodes[i]) || ver!=undefined ){
            graph.setEdge(ver.id, way.id);

            graph.node(ver.id).edges.push(nodes[i]);
          }
        }
      });

      
      //מחיקת צמתים ריקים
        let nodesList=graph.nodes()
        nodesList.forEach(nodeName => {
        if(graph.node(nodeName)!=undefined&&graph.node(nodeName).edges.length==0){
            graph.removeNode(nodeName);

        }
      });
  
    // שמירת הגרף לקובץ
    fs.writeFileSync('graph_elad.json', JSON.stringify(graph, null, 2), 'utf8');
    b()
  }
  function b(){;

    // Read the JSON file
    let rawData;
    try {
      rawData = fs.readFileSync('./graph_elad.json', 'utf8');
    } catch (error) {
      console.error("Error reading or parsing nodes.json:", error);
      process.exit(1);
    }
    
    const jsonData = JSON.parse(rawData);
    
    // Create GeoJSON structure
    const geoJson = {
      type: "FeatureCollection",
      features: []
    };
    
    // Add nodes as GeoJSON points
    Object.keys(jsonData._nodes).forEach(nodeId => {
      const node = jsonData._nodes[nodeId];
      geoJson.features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: node.coordinates
        },
        properties: {
          id: nodeId,
          edges: node.edges
        }
      });
    });
    
    // Write GeoJSON to a file
    const geoJsonData = JSON.stringify(geoJson, null, 2);
    fs.writeFileSync('graph_elad.geojson', geoJsonData, 'utf8');
    
    console.log('GeoJSON file created successfully');
    }


  // קריאה לפונקציה לבניית הגרף
  buildGraph().then(() => {
    console.log('Graph built successfully');
  }).catch(err => {
    console.error('Error building graph:', err);
  });


  

// const fs = require('fs');
// const axios = require('axios');
// const apiKey = 'AIzaSyDYircLat1lZ745yEtD9rVCDtc5JwpV9BU'; // החלף במפתח ה-API שלך

// // קריאת קובץ הצמתים
// let vertices;
// try {
//   const data = fs.readFileSync('./DAL/nodes.json', 'utf8');
//   const jsonData = JSON.parse(data);
//   vertices = jsonData.elements.map(element => ({
//     id: element.type + '/' + element.id,
//     lat: element.lat,
//     lng: element.lon
//   }));
// } catch (error) {
//   console.error("Error reading or parsing nodes.json:", error);
//   process.exit(1);
// }

// // פונקציה לקבלת נתוני כביש ישיר בין שני צמתים במצב רכיבה על אופניים
// async function getRoadData(start, end) {
//   const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&mode=bicycling&key=${apiKey}`;
//   try{
//   const response = await axios.get(url);
//   const data = response.data;

//   if (data.routes.length > 0 && data.routes[0].legs.length > 0) {
//     const steps = data.routes[0].legs[0].steps;
//     if (steps.length === 1) {
//       return {
//         fromCoordinates: { lat: start.lat, lng: start.lng },
//         toCoordinates: { lat: end.lat, lng: end.lng },
//         distance: steps[0].distance.value, //מחזיר את המרחק במטרים
//         duration: steps[0].duration.value, //מחזיר את הזמן בשניות
//         closed_street: true
//       };
//     }
//   }
// }
// catch (error) {
//   console.error(`Error fetching road data: ${error}`);
// }
//   return null;
// }


// // פונקציה לקבלת גובה של נקודה
// async function getElevation(location) {
//   const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${location.lat},${location.lng}&key=${apiKey}`;
//   try {
//     const response = await axios.get(url);
//     const data = response.data;
//     if (data.results.length > 0) {
//       return data.results[0].elevation;
//     }
//   } catch (error) {
//     console.error(`Error fetching elevation data: ${error}`);
//   }
//   return null;
// }


// // פונקציה לבניית הגרף
// async function buildGraph() {
//   const graph = {};

//   // אתחול גרף עם צמתים ריקים
//   vertices.forEach(vertex => {
//     graph[vertex.id] = { coordinates: [vertex.lat, vertex.lng], edges: [] };
//   });

//  // לולאה על כל זוגות הצמתים לבדיקת כבישים ישירים
//   for (let i = 0; i < vertices.length; i++) {
//     for (let j = i + 1; j < vertices.length; j++) {
//       const start = vertices[i];
//       const end = vertices[j];
//       const roadData = await getRoadData(start, end);
//       //אם החזיר מידע אודות הכביש
//       if (roadData) {
//         const startElevation = await getElevation(start);//פונקציה להחזרת השיפוע
//         const endElevation = await getElevation(end);
//         //חישוב השיפוע בין שתי הנקודות
//         if (startElevation !== null && endElevation !== null) {
//           const elevationDifference = endElevation - startElevation;
//           const distance = roadData.distance; // במטרים
//           const slope = parseFloat((elevationDifference / distance).toFixed(2));
          
//           const complex_transition = slope; //מעבר מורכב-בהתחלה שווה לשיפוע, בהמשך על פי המשתמשים

//         graph[start.id].edges.push({
//           to: end.id,
//           toCoordinates: roadData.toCoordinates,
//           distance: roadData.distance,
//           duration: roadData.duration,
//           slope: slope,
//           complex_transition: complex_transition,
//           closed_street: roadData.closed_street
//         });
//         graph[end.id].edges.push({
//           to: start.id,
//           toCoordinates: roadData.fromCoordinates,
//           distance: roadData.distance,
//           duration: roadData.duration,
//           slope: -slope, //השיפוע נגדי מהכיוון הנגדי
//           complex_transition: complex_transition,
//           closed_street: roadData.closed_street
//         });
//       }
//     }
//   }
// }

//   // שמירת הגרף לקובץ
//   fs.writeFileSync('graph.json', JSON.stringify(graph, null, 2), 'utf8');
// }

// // קריאה לפונקציה לבניית הגרף
// buildGraph().then(() => {
//   console.log('Graph built successfully');
// }).catch(err => {
//   console.error('Error building graph:', err);
// });

