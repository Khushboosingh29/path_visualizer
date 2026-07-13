class Graph {
    constructor() {
        this.nodes = new Set();
        this.adjacencyList = new Map();
    }
    addNode(node) {
        this.nodes.add(node);
        this.adjacencyList.set(node, []);
    }
    addEdge(node1, node2, weight) {
        if (!this.adjacencyList.has(node1) || !this.adjacencyList.has(node2)) {
            alert('Both cities must exist in the graph');
            return;
        }
        this.adjacencyList.get(node1).push({ node: node2, weight: weight });
        this.adjacencyList.get(node2).push({ node: node1, weight: weight });
    }
    dijkstra(startNode, endNode) {
        let distances = {};
        let prev = {};
        let pq = new PriorityQueue();
        distances[startNode] = 0;
        pq.enqueue(startNode, 0);
        this.nodes.forEach(node => {
            if (node !== startNode) distances[node] = Infinity;
            prev[node] = null;
        });
        while (!pq.isEmpty()) {
            let minNode = pq.dequeue().element;
            if (minNode === endNode) break;
            this.adjacencyList.get(minNode).forEach(neighbor => {
                let alt = distances[minNode] + neighbor.weight;
                if (alt < distances[neighbor.node]) {
                    distances[neighbor.node] = alt;
                    prev[neighbor.node] = minNode;
                    pq.enqueue(neighbor.node, alt);
                }
            });
        }
        let path = [];
        let u = endNode;
        while (prev[u]) {
            path.unshift(u);
            u = prev[u];
        }
        path.unshift(startNode);
        return path;
    }
}
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    enqueue(element, priority) {
        let qElement = new QElement(element, priority);
        let contain = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
        if (!contain) {
            this.items.push(qElement);
        }
    }
    dequeue() {
        if (this.isEmpty()) return "Underflow";
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length === 0;
    }
}
class QElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}
const graph = new Graph();

const nodes = [
    'Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad',
    'Greater Noida', 'Meerut', 'Rohtak', 'Panipat', 'Sonipat',
    'Palwal', 'Rewari', 'Bahadurgarh', 'Ballabhgarh', 'Hapur',
    'Bhiwadi', 'Dadri', 'Modinagar', 'Loni', 'Narela'
];
nodes.forEach(node => graph.addNode(node));

graph.addEdge('Delhi', 'Noida', 45);
graph.addEdge('Delhi', 'Gurgaon', 50);
graph.addEdge('Delhi', 'Ghaziabad', 40);
graph.addEdge('Delhi', 'Faridabad', 45);
graph.addEdge('Noida', 'Greater Noida', 45);
graph.addEdge('Noida', 'Ghaziabad', 35);
graph.addEdge('Faridabad', 'Greater Noida', 55);
graph.addEdge('Delhi', 'Meerut', 90);
graph.addEdge('Delhi', 'Panipat', 110);
graph.addEdge('Delhi', 'Sonipat', 70);
graph.addEdge('Gurgaon', 'Rewari', 80);
graph.addEdge('Faridabad', 'Palwal', 60);
graph.addEdge('Delhi', 'Bahadurgarh', 50);
graph.addEdge('Gurgaon', 'Bhiwadi', 65);
graph.addEdge('Ghaziabad', 'Hapur', 45);
graph.addEdge('Noida', 'Dadri', 40);
graph.addEdge('Ghaziabad', 'Modinagar', 50);
graph.addEdge('Ghaziabad', 'Loni', 30);
graph.addEdge('Delhi', 'Narela', 55);


const coordinates = {
    'Delhi': { x: 200, y: 200 },
    'Noida': { x: 300, y: 240 },
    'Gurgaon': { x: 440, y: 260 },
    'Ghaziabad': { x: 420, y: 180 },
    'Faridabad': { x: 380, y: 320 },
    'Greater Noida': { x: 460, y: 300 },
    'Meerut': { x: 450, y: 60 },
    'Rohtak': { x: 200, y: 180 },
    'Panipat': { x: 280, y: 40 },
    'Sonipat': { x: 320, y: 100 },
    'Palwal': { x: 370, y: 390 },
    'Rewari': { x: 250, y: 320 },
    'Bahadurgarh': { x: 280, y: 160 },
    'Ballabhgarh': { x: 310, y: 370 },
    'Hapur': { x: 580, y: 180 },
    'Bhiwadi': { x: 220, y: 380 },
    'Dadri': { x: 520, y: 250 },
    'Modinagar': { x: 240, y: 140 },
    'Loni': { x: 410, y: 200 },
    'Narela': { x: 550, y: 110 }
};


const canvas = document.getElementById('map');
const ctx = canvas.getContext('2d');
const busImage = new Image();
const background = new Image();
background.src = "images/road2.jpg";
let isBgLoaded = false;

background.onload = function () {
  isBgLoaded = true;
  drawGraph(); // draw once when background is ready
};

busImage.src = 'js/bus.png';
const maxX = Math.max(...Object.values(coordinates).map(coord => coord.x));
const maxY = Math.max(...Object.values(coordinates).map(coord => coord.y));
canvas.width = maxX + 50; 
canvas.height = maxY + 50;

busImage.onload = function() {
    drawGraph();
    populateCitySelection();
    document.getElementById('notification').textContent = 'Distance traveled: 0 km';
};
function drawGraph() {
   // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';
    //ctx.fillStyle = '#000';
  //ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (isBgLoaded) {
    ctx.globalAlpha = 0.2;
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
  }

  // continue drawing edges, labels, etc

    graph.nodes.forEach(node => {
        graph.adjacencyList.get(node).forEach(neighbor => {
            ctx.beginPath();
            ctx.moveTo(coordinates[node].x, coordinates[node].y);
            ctx.lineTo(coordinates[neighbor.node].x, coordinates[neighbor.node].y);
            ctx.stroke();
            const midX = (coordinates[node].x + coordinates[neighbor.node].x) / 2;
            const midY = (coordinates[node].y + coordinates[neighbor.node].y) / 2;
            ctx.fillText(neighbor.weight, midX, midY);
        });
    });
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    graph.nodes.forEach(node => {
        const { x, y } = coordinates[node];
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(node, x - 20, y - 10);
    });
}
function drawPath(path) {
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(coordinates[path[0]].x, coordinates[path[0]].y);
    for (let i = 1; i < path.length; i++) {
        const { x, y } = coordinates[path[i]];
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}
function moveBus(startNode, endNode) {
    const path = graph.dijkstra(startNode, endNode);
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const node = path[i];
        const neighbor = graph.adjacencyList.get(node).find(n => n.node === path[i + 1]);
        if (neighbor) {
            totalDistance += neighbor.weight;
        }
    }
    let traveledDistance = 0;
    document.getElementById('notification').textContent = `Total distance to be traveled: ${totalDistance} km`;
    drawPath(path);
    let index = 0;
    function animate() {
        if (index < path.length - 1) {
            const start = coordinates[path[index]];
            const end = coordinates[path[index + 1]];
            const duration = 2000;
            const startTime = performance.now();
            function move(time) {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const x = start.x + (end.x - start.x) * progress;
                const y = start.y + (end.y - start.y) * progress;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawGraph();
                drawPath(path); 
                ctx.drawImage(busImage, x - 10, y - 10, 20, 20);
                if (progress < 1) {
                    requestAnimationFrame(move);
                } else {
                    index++;
                    animate();
                }
            }
            requestAnimationFrame(move);
        } 
        else {
            drawGraph();
            updateCitySelection();
            document.getElementById('notification').textContent = `Distance traveled: 0 km`;
        }
    }
    setTimeout(animate, 500);
}
function populateCitySelection() {
    const startSelect = document.getElementById('start-city');
    const endSelect = document.getElementById('end-city');
    graph.nodes.forEach(node => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = option2.value = node;
        option1.text = option2.text = node;
        startSelect.add(option1);
        endSelect.add(option2);
    });
}
function updateCitySelection() {
    const startSelect = document.getElementById('start-city');
    const endSelect = document.getElementById('end-city');
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';
    populateCitySelection();
}
document.getElementById('visualize-path').addEventListener('click', () => {
    const startCity = document.getElementById('start-city').value;
    const endCity = document.getElementById('end-city').value;
    if (startCity && endCity) {
        moveBus(startCity, endCity);
    }
});
document.getElementById('add-city').addEventListener('click', () => {
    const newCity = document.getElementById('new-city').value;
    if (newCity && !graph.nodes.has(newCity)) {
        graph.addNode(newCity);
        coordinates[newCity] = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
        updateCitySelection();
        drawGraph();
        document.getElementById('new-city').value = '';
    } else {
        alert('City already exists or input is empty.');
    }
});
document.getElementById('add-edge').addEventListener('click', () => {
    const city1 = document.getElementById('edge-city1').value;
    const city2 = document.getElementById('edge-city2').value;
    const weight = parseInt(document.getElementById('edge-weight').value);
    if (city1 && city2 && weight > 0 && graph.nodes.has(city1) && graph.nodes.has(city2)) {
        graph.addEdge(city1, city2, weight);
        drawGraph();
        document.getElementById('edge-city1').value = '';
        document.getElementById('edge-city2').value = '';
        document.getElementById('edge-weight').value = '';
    } else {
        alert('Invalid input. Ensure cities exist and distance is positive.');
    }
});



