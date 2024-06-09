const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = 3000;

// קריאה ל-API של הכבישים באשדוד
async function fetchRoadsData() {
    try {
        const response = await fetch('https://data.gov.il/api/3/action/datastore_search?resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b&q=%D7%90%D7%A9%D7%93%D7%95%D7%93');
        const data = await response.json();
        return data.result.records;
    } catch (error) {
        console.error('Error fetching roads data:', error);
        return [];
    }
}

// השהיה של 200ms בין הבקשות ל-Google Maps Geocoding API
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// המרת כתובת לקואורדינטות באמצעות API של Google Maps Geocoding
async function geocodeAddress(address) {
    try {
        await delay(200); // השהיה של 200ms
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', אשדוד, ישראל')}&key=YOUR_API_KEY`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            console.error('No results found for address:', address);
            return null;
        }
    } catch (error) {
        console.error('Error geocoding address:', error);
        return null;
    }
}

// קבלת נתיב כביש מ-Google Maps Roads API
async function getRoadsPath(location) {
    try {
        await delay(200); // השהיה של 200ms
        const response = await fetch(`https://roads.googleapis.com/v1/nearestRoads?points=${location.lat},${location.lng}&key=YOUR_API_KEY`);
        const data = await response.json();
        return data.snappedPoints;
    } catch (error) {
        console.error('Error fetching roads path:', error);
        return null;
    }
}

// יצירת קשתות בין הצמתים באשדוד
async function createGraph() {
    const roadsData = await fetchRoadsData();
    const nodes = {};
    const edges = [];

    // יצירת צמתים וקשתות ביניהם
    for (const road of roadsData) {
        const address = road.שם_רחוב;

        // המרת כתובת לקואורדינטות
        const location = await geocodeAddress(address);
        if (!location) continue;

        // קבלת נתיב הכביש מ-Google Maps Roads API
        const roadPath = await getRoadsPath(location);
        if (!roadPath) continue;

        // הוספת הצמתים והקשתות לגרף
        roadPath.forEach((point, index) => {
            const nodeKey = `${point.location.latitude},${point.location.longitude}`;
            if (!nodes[nodeKey]) {
                nodes[nodeKey] = { lat: point.location.latitude, lng: point.location.longitude };
            }
            if (index > 0) {
                const previousPoint = roadPath[index - 1];
                const edge = {
                    source: `${previousPoint.location.latitude},${previousPoint.location.longitude}`,
                    target: nodeKey
                };
                edges.push(edge);
            }
        });
    }

    return { nodes, edges };
}

// נתב HTTP שמחזיר את הגרף
app.get('/graph', async (req, res) => {
    try {
        const graph = await createGraph();
        res.json(graph);
        console.log(graph.nodes);
        console.log(graph.edges);
    } catch (error) {
        res.status(500).send('Error generating graph');
    }
});

// הגשת קבצים סטטיים מהתיקייה public
app.use(express.static('public'));

// HTML ותסריט להצגת המפה והגרף
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Graph Visualization</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        #map {
            height: 100vh;
            width: 100%;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://d3js.org/d3.v6.min.js"></script>
    <script>
        async function loadGraphData() {
            const response = await fetch('/graph');
            return await response.json();
        }

        function drawGraph(nodes, edges) {
            const map = L.map('map').setView([31.801447, 34.643497], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(map);

            edges.forEach(edge => {
                const source = nodes[edge.source];
                const target = nodes[edge.target];
                L.polyline([source, target], { color: 'blue' }).addTo(map);
            });

            Object.values(nodes).forEach(node => {
                L.circleMarker(node, { radius: 5, color: 'red' }).addTo(map);
            });
        }

        loadGraphData().then(graph => {
            drawGraph(graph.nodes, graph.edges);
        });
    </script>
</body>
</html>
    `);
});

// הפעלת השרת
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
