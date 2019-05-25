let platform: Platform;

export function getPlatform() {
    if (platform) {
        return platform;
    }
    if (window['canvas']) {
        platform = new WxgamePlatform();
    }
    else {
        platform = new BrowserPlatform();
    }
    return platform;
}

abstract class Platform {

    abstract loadText(url: string, callback: Function): void;

    abstract getMainCanvas(): HTMLCanvasElement;

    abstract isEditorMode(): boolean;

    abstract listenClick(callback): void;

    abstract listenTouch(callabck: (event: {clickX:number,clickY:number,touchId:number,type:"touchstart" | "touchend"}) => void): void;
}


class BrowserPlatform extends Platform {


    listenTouch(callback) {
        const canvas = this.getMainCanvas();
        canvas.ontouchstart = (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                const event = { clickX: touch.clientX, clickY: touch.clientY, touchId: touch.identifier ,type:"touchstart"};
                callback(event)
            }
            e.preventDefault();
        }
        // canvas.ontouchmove = (event) => {
        //     callback(event)
        // }
        canvas.ontouchend = (e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                const event = { clickX: touch.clientX, clickY: touch.clientY, touchId: touch.identifier ,type:"touchend"};
                callback(event)
            }
            e.preventDefault();
        }
    }


    listenClick(callback: any): void {
        const canvas = this.getMainCanvas();
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = Math.round(e.clientX - rect.left);
            const clickY = Math.round(e.clientY - rect.top);
            callback(clickX, clickY);
        }
    }



    isEditorMode(): boolean {
        return location.search.indexOf("editorMode=1") >= 0;
    }
    getMainCanvas(): HTMLCanvasElement {
        return document.getElementById("gameCanvas") as HTMLCanvasElement;
    }
    loadText(url: string, callback: Function): void {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            callback(xhr.responseText);
        }
        xhr.open("get", url);
        xhr.send();
    }

}

class WxgamePlatform extends Platform {

    private scale: number = 1;

    listenTouch(callback) {
        wx.onTouchStart((event) => {
            callback(event)
        });
        wx.onTouchMove((event) => {
            callback(event)
        })
        wx.onTouchEnd((event) => {
            callback(event)
        });
    }

    listenClick(callback: any): void {
        wx.onTouchStart(result => {
            const touch = result.touches[0]
            const clientX = touch.clientX / this.scale;
            const clientY = touch.clientY / this.scale;
            console.log(clientX, clientY, this.scale);
            callback(clientX, clientY);
        })
    }
    isEditorMode(): boolean {
        return false;
    }
    getMainCanvas(): HTMLCanvasElement {
        const canvas = window['canvas'];
        const width = canvas.width;
        const height = canvas.height;
        const scale = width / height;
        // canvas.width = 1080;
        // canvas.height = Math.floor(1080 / scale);
        this.scale = scale;

        canvas.height=720;
        canvas.width=Math.floor(scale * 720);

        const ctx=canvas.getContext("2d");
        ctx.scale(width/canvas.width,width/canvas.width);

        return canvas;
    }
    loadText(url: string, callback: Function): void {
        const fs = wx.getFileSystemManager();
        const content = fs.readFileSync(url, 'utf-8');
        callback(content);
    }

}

declare var wx: any