import { ChatSendBeforeEvent, Player, system, world } from "@minecraft/server";
import * as DyPropArray from "./lib/DyPropArray";
import { WhiteList } from "./form";

export class command {
    /**
     * 
     * @param {Player} player 
     * @param {ChatSendBeforeEvent} ev 
     */
    constructor(player, ev) {
        this.player = player;
        this.ev = ev;
    };

    check() {
        const message = this.ev.message;

        if (message.startsWith("wl")) {
            this.ev.cancel = true;
            const option = message.replace("wl ", "");
            const command = option.split(" ")[0];
            switch (command) {
                case "on": return this.on();
                case "off": return this.off();
                case "add": return this.add(option.split(" ")[1]);
                case "remove": return this.remove(option.split(" ")[1]);
                case "list": return this.list();
                default: return this.player.sendMessage("§f[§aWL§f] §cコマンドが正しくありません");
            }
        }
    }

    on() {
        const whitelistStateString = world.getDynamicProperty("whitelistState");
        const whitelistState = JSON.parse(whitelistStateString);
        if (whitelistState) return this.player.sendMessage("§f[§aWL§f] §cすでにオンになっています");

        world.setDynamicProperty("whitelistState", true);
        this.player.sendMessage("§f[§aWL§f] §bホワイトリストが§e有効§bになりました");
    }

    off() {
        const whitelistStateString = world.getDynamicProperty("whitelistState");
        const whitelistState = JSON.parse(whitelistStateString);
        if (!whitelistState) return this.player.sendMessage("§f[§aWL§f] §cすでにオフになっています");

        world.setDynamicProperty("whitelistState", false);
        this.player.sendMessage("§f[§aWL§f] §bホワイトリストが§c無効§bになりました");
    }

    add(PlayerName) {
        if (!DyPropArray.hasValue("whitelist", PlayerName)) {
            DyPropArray.add("whitelist", PlayerName);
            this.player.sendMessage(`§f[§aWL§f] §d${PlayerName}§bをホワイトリストに§e追加§bしました`);
        } else {
            this.player.sendMessage(`§f[§aWL§f] §d${PlayerName}§cはすでにホワイトリストに追加されています`);
        }
    }

    remove(PlayerName) {
        const result = DyPropArray.remove("whitelist", PlayerName);

        if (result) {
            this.player.sendMessage(`§f[§aWL§f] §d${PlayerName}§bをホワイトリストから§c削除§bしました`);
        } else {
            this.player.sendMessage(`§f[§aWL§f] §d${PlayerName}§cはすでにホワイトリストから削除されています`);
        }
    }

    list() {
        system.run(() => {
            WhiteList(this.player, true);
        });
    }
}