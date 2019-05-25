export namespace astar {

    export class Node {

        x: number;
        y: number;
        f: number;
        g: number;
        h: number;
        walkable: boolean = true;
        parent: Node;
        costMultiplier: number = 1.0;
        inPath: boolean = false;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        toString() {
            if (this.inPath) {
                return "国"
            }
            else if (!this.walkable) {
                return "田"
            }
            else {
                return "口"
            }
        }
    }


    export class Grid {

        private _nodes: Node[][];
        private _numCols: number;
        private _numRows: number;

        constructor(numCols: number, numRows: number) {
            this._numCols = numCols;
            this._numRows = numRows;
            this._nodes = [];
            for (var i: number = 0; i < this._numCols; i++) {
                this._nodes[i] = [];
                for (var j: number = 0; j < this._numRows; j++) {
                    this._nodes[i][j] = new Node(i, j);
                }
            }
        }

        clear() {
            for (var i: number = 0; i < this._numCols; i++) {
                for (var j: number = 0; j < this._numRows; j++) {
                    const node = this._nodes[i][j];
                    node.f = node.g = node.h = 0;
                    node.inPath = false;
                    node.parent = null;
                }
            }
        }

        public getNode(x: number, y: number): Node {
            return this._nodes[x][y];
        }

        public setWalkable(x: number, y: number, value: boolean): void {
            this._nodes[x][y].walkable = value;
        }


        public get numCols(): number {
            return this._numCols;
        }

        public get numRows(): number {
            return this._numRows;
        }

        public getNeighbors(node: Node): Node[] {
            const result = [];
            const startX = Math.max(0, node.x - 1);
            const endX = Math.min(this.numCols - 1, node.x + 1);
            const startY = Math.max(0, node.y - 1);
            const endY = Math.min(this.numRows - 1, node.y + 1);
            for (let i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    result.push(this.getNode(i, j));
                }
            }
            return result;
        }

        public toString() {

            var result = "";

            for (var y = 0; y < this._numRows; y++) {
                for (var x = 0; x < this._numCols; x++) {
                    result += this._nodes[x][y].toString();
                }
                result += "\n"
            }
            return result;
        }

    }


    const STRAIGHT_COST = 1;

    const DIAG_COST = Math.SQRT2;

    export class FindPath {

        private _heuristic: Function;

        manhattan(node: Node, endNode: Node): number {
            const cost = Math.abs(node.x - endNode.x) * STRAIGHT_COST
                + Math.abs(node.y + endNode.y) * STRAIGHT_COST;
            return cost;
        }

        euclidian(node: Node, endNode: Node): number {
            const dx = node.x - endNode.x;
            const dy = node.y - endNode.y;
            return Math.sqrt(dx * dx + dy * dy) * STRAIGHT_COST;
        }


        diagonal(node: Node, endNode: Node): number {
            const dx = Math.abs(node.x - endNode.x);
            const dy = Math.abs(node.y - endNode.y);
            const diag = Math.min(dx, dy);
            const straight = dx + dy;
            return DIAG_COST * diag + STRAIGHT_COST * (straight - 2 * diag);
        }

        constructor() {

        }

        public setHeurisitic(heuristic: Function) {
            this._heuristic = heuristic;
        }

        public findPath(grid: Grid, startX: number, startY: number, endX: number, endY: number): Node[] {
            grid.clear();
            const startNode = grid.getNode(startX, startY);
            const endNode = grid.getNode(endX, endY);
            startNode.g = 0;
            startNode.h = this._heuristic(startNode, endNode);
            startNode.f = startNode.g + startNode.h;
            const openList = [];
            const closedList = [];
            let currentNode = startNode;
            while (currentNode != endNode) {
                const neighbors = grid.getNeighbors(currentNode);
                for (let i = 0; i < neighbors.length; i++) {
                    const testNode = neighbors[i];
                    if (testNode == currentNode ||
                        !testNode.walkable) {
                        continue;
                    }
                    let cost = STRAIGHT_COST;
                    if (!((currentNode.x == testNode.x) || (currentNode.y == testNode.y))) {
                        cost = DIAG_COST;
                    }
                    const g = currentNode.g + cost * testNode.costMultiplier;
                    const h = this._heuristic(testNode, endNode);
                    const f = g + h;
                    if (openList.indexOf(testNode) >= 0 || closedList.indexOf(testNode) >= 0) {
                        if (testNode.f > f) {
                            testNode.f = f;
                            testNode.g = g;
                            testNode.h = h;
                            testNode.parent = currentNode;
                        }
                        else {
                            //什么也不做
                        }
                    }
                    else {
                        testNode.f = f;
                        testNode.g = g;
                        testNode.h = h;
                        testNode.parent = currentNode;
                        openList.push(testNode);

                    }
                }
                closedList.push(currentNode);

                if (openList.length == 0) {
                    console.log("no path found");
                    return null;
                }
                openList.sort((a, b) => a.f - b.f);
                currentNode = openList.shift();
            }
            const path = [];
            let nodeInPath = endNode;
            path.push(nodeInPath);
            nodeInPath.inPath = true;
            while (nodeInPath != startNode) {
                nodeInPath = nodeInPath.parent;
                path.unshift(nodeInPath);
                nodeInPath.inPath = true;
            }
            return path;
        }
    }
}
