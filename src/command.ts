export class CommandPool {


    private _commandList: CommandBase[] = [];
    private currentCommand: CommandBase = null;

    push(command: CommandBase) {
        if (this.currentCommand) {
            this._commandList = [];
            this.currentCommand.cancel();
            this.currentCommand = null;
        }
        this._commandList.push(command);
    }

    seriesExecuteAllCommand() {
        this.pickAndExecuteFirstCommand();
    }

    private pickAndExecuteFirstCommand() {
        if (this.currentCommand) {
            return;
        }
        if (this._commandList.length == 0) {
            return;
        }
        const command = this._commandList.shift();
        this.currentCommand = command;
        command.onFinished = () => {
            this.currentCommand = null;
            this.pickAndExecuteFirstCommand();
        }
        command.execute();



    }
}

export abstract class CommandBase {


    onFinished: () => void;

    abstract execute(): void;

    abstract cancel(): void;
}