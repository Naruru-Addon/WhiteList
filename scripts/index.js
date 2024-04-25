import { system, world } from "@minecraft/server";
import * as DyPropArray from "./lib/DyPropArray";
import { command } from "./command";
import { allowlist } from "./allowlist";

system.run(() => {
    if (!world.getDynamicProperty("whitelistState")) {
        world.setDynamicProperty("whitelistState", false);
    }

    for (const playerName of allowlist) {
        const result = DyPropArray.hasValue("whitelist", playerName);

        if (!result) {
            DyPropArray.add("whitelist", playerName);
        }
    }
});

world.afterEvents.playerSpawn.subscribe(ev => {
    const { initialSpawn, player } = ev;
    const playerName = player.name;
    const whitelistStateString = world.getDynamicProperty("whitelistState");
    const whitelistState = JSON.parse(whitelistStateString);
    const result = DyPropArray.hasValue("whitelist", playerName);

    if (whitelistState && !result && !allowlist.includes(playerName)) {
        player.triggerEvent("whitelist:kick");
    }
});

world.beforeEvents.chatSend.subscribe(ev => {
    const { sender, message } = ev;

    if (sender.isOp()) {
        new command(sender, ev).check();
    }
});