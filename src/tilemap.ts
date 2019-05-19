import { astar } from "./astar";
import { getImage, RenderableBehaviour, SerilizeField, propertyEditor_None } from "./gameengine";
export class TileMapRenderer extends RenderableBehaviour {


    @SerilizeField(propertyEditor_None)
    tileData: number[][] = [];

    grid: astar.Grid;

    onStart() {
        this.displayObject.renderNode = this;
        this.grid = new astar.Grid(6, 4);

        for (let rowIndex = 0; rowIndex < this.tileData.length; rowIndex++) {
            const row = this.tileData[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const walkable = row[colIndex] == 1 ? false : true;
                this.grid.setWalkable(colIndex, rowIndex, walkable)
            }
        }
    }
    onUpdate() {
    }

    onRender(context: CanvasRenderingContext2D) {
        for (let rowIndex = 0; rowIndex < this.tileData.length; rowIndex++) {
            const row = this.tileData[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const data = row[colIndex];
                const imageUrl = `assets/${data}.png`;
                const image = getImage(imageUrl);
                context.drawImage(image, colIndex * 64, rowIndex * 64);
            }
        }
    }


    getRenderArea() {
        return {
            x: 0,
            y: 0,
            width: this.grid.numCols * 64,
            height: this.grid.numRows * 64
        }
    }
}