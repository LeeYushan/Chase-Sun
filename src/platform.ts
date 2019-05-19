let platform:Platform;

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

    abstract isEditorMode():boolean;

    abstract listenTouchEvent(callback):void;
}


class BrowserPlatform extends Platform {
    listenTouchEvent(callback: any): void {
        const canvas = this.getMainCanvas();
        canvas.onclick = (e) => {
            console.log ('helloworld')
            const rect = canvas.getBoundingClientRect();
            const clickX = Math.round(e.clientX - rect.left);
            const clickY = Math.round(e.clientY - rect.top);
            callback(clickX,clickY);
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

    private scale:number = 1;
    listenTouchEvent(callback: any): void {
        wx.onTouchStart(result => {
            const touch = result.touches[0];
            const clientX = touch.clientX / this.scale;
            const clientY = touch.clientY / this.scale;
            console.log (clientX,clientY,this.scale);
            callback(clientX,clientY);
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
        canvas.width = 600;
        canvas.height = Math.floor(600 / scale);
        this.scale = scale;
        return canvas;
    }
    loadText(url: string, callback: Function): void {
        const fs = wx.getFileSystemManager()
        const content = fs.readFileSync(url, 'utf-8');
        callback(content);
    }

}

declare var wx: any;