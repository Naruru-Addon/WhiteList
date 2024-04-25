import { system, world } from "@minecraft/server";
import * as UI from "@minecraft/server-ui";
import * as DyPropArray from "./lib/DyPropArray";

export async function WhiteList(player, busy, search) {
    const jsons = DyPropArray.get("whitelist");
    const form = new UI.ActionFormData();

    form.title("ホワイトリスト");
    if (search) form.body(`「${search}」の検索結果`);
    form.button("§l検索", "textures/ui/magnifyingGlass");
    form.button("§l追加", "textures/ui/color_plus");

    for (const json of jsons) {
        for (const playerName of json) {
            if (search) {
                if (playerName.includes(search)) {
                    form.button(playerName, "textures/ui/Friend1");
                }
            } else {
                form.button(playerName, "textures/ui/Friend1");
            }
        }
    }

    const { selection, canceled } = busy
        ? await formbusy(player, form)
        : await form.show(player);
    if (canceled) return;
    if (selection === 0) return WhiteList_search(player, search);
    if (selection === 1) return WhiteList_add(player, search);
    let i = 2;
    for (const json of jsons) {
        for (const playerName of json) {
            if (i === selection) {
                return WhiteList_select(player, playerName, search);
            }
            i++;
        }
    }
}

async function WhiteList_search(player, search) {
    const form = new UI.ModalFormData();

    form.title("ホワイトリスト/検索");
    form.textField("検索", "", search ? search : "");
    form.submitButton("検索");

    const { formValues, canceled } = await form.show(player)
    if (canceled) return;
    if (!formValues[0] || formValues[0].trim() === "") {
        WhiteList(player, true);
    } else {
        WhiteList(player, true, formValues[0]);
    }
}

async function WhiteList_add(player, search) {
    const form = new UI.ModalFormData();

    form.title("ホワイトリスト/追加");
    form.textField("追加", "", "");
    form.submitButton("追加");

    const { formValues, canceled } = await form.show(player)
    if (canceled) return;
    if (!formValues[0] || formValues[0].trim() === "") {
        WhiteList(player, true, search);
    } else {
        if (!DyPropArray.hasValue("whitelist", formValues[0])) {
            DyPropArray.add("whitelist", formValues[0]);
        }
        WhiteList(player, true, search);
    }
}

async function WhiteList_select(player, PlayerName, search) {
    const form = new UI.MessageFormData()

    form.title(`ホワイトリスト/${PlayerName}`);
    form.body(`§d${PlayerName}§fをホワイトリストから§c削除§fしますか？`);
    form.button2("§c削除");
    form.button1("キャンセル");

    const { selection, canceled } = await form.show(player);
    if (canceled) return;
    if (selection === 0) return WhiteList(player, true, search);
    if (selection === 1) {
        DyPropArray.remove("whitelist", PlayerName);
        WhiteList(player, true, search);
    }
}

function formbusy(player, form) {
    return new Promise(res => {
        system.run(async function run() {
            const response = await form.show(player);
            const { canceled, cancelationReason: reason } = response;
            if (canceled && reason === UI.FormCancelationReason.UserBusy) return system.run(run);
            res(response);
        });
    });
}