"use strict";
/// <reference path="../page.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let $acc = $("#account");
function show_acc_items(reload = true) {
    return __awaiter(this, void 0, void 0, function* () {
        let list = yield eel.get_client_users()();
        onClick();
        function onClick() {
            $acc.one("click", ".account_items", function () {
                let user = this.dataset.username;
                console.log(user);
                eel.auto_login(user);
                setTimeout(() => { onClick(); }, 1000);
            });
        }
        $acc.on("click", ".account_items p", (event) => {
            event.stopPropagation();
        });
        let session = false;
        let Sdata = localStorage.getItem("better_steam_tool$get_client_users");
        if (Sdata !== null && reload) {
            session = true;
            Sdata = JSON.parse(Sdata);
        }
        let loop = { org: [], url: [] };
        $.each(list, function (key, val) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Sdata[val.AccountID]) {
                    $acc.append(`
            <div class="account_items" data-username="${val.AccountName}" data-steamid="${key}" style="background-image:url('${Sdata[val.AccountID]["avatar_url"]};order:${val.AccountID};')">
                <p>${val.PersonaName}</p>
            </div>
            `);
                }
                else {
                    session = false;
                    loop["url"].push(`https://steamcommunity.com/miniprofile/${val.AccountID}/json`);
                    val["steamid"] = key;
                    loop["org"].push(val);
                }
            });
        });
        if (!session) {
            console.log(loop);
            eel.get(loop["url"], loop["org"]);
        }
    });
}
function get_req(data, original) {
    if (data === "") {
        let avatar_url;
        try {
            avatar_url = JSON.parse(localStorage.getItem("better_steam_tool$get_client_users"))[original.AccountID]["avatar_url"];
        }
        catch (e) {
            avatar_url = "/img/user_noimg.png";
        }
        $acc.append(`
        <div class="account_items" data-username="${original.AccountName}" data-steamid="${original.steamid}" style="background-image:url('${avatar_url}');order:${original.AccountID};">
            <p>${original.PersonaName}</p>
        </div>
        `);
    }
    else {
        $acc.append(`
    <div class="account_items" data-username="${original.AccountName}" data-steamid="${original.steamid}" style="background-image:url('${data.avatar_url}');order:${original.AccountID};">
        <p>${original.PersonaName}</p>
    </div>
    `);
        let $data = JSON.parse(localStorage.getItem("better_steam_tool$get_client_users"));
        if ($data === null) {
            $data = {};
        }
        $data[original.AccountID] = data;
        localStorage.setItem("better_steam_tool$get_client_users", JSON.stringify($data));
    }
}
$("#reload").on("click", () => {
    let list = $acc;
    list.fadeOut(100, () => {
        list
            .off()
            .html("")
            .show();
        show_acc_items(false);
    });
});
$("#delete").on("click", function () {
    let acc = $acc;
    let used = this.dataset;
    if (used.use == "false") {
        acc
            .off()
            .addClass("del_mode")
            .on("click", ".account_items", function () {
            acc
                .removeClass("del_mode")
                .off()
                .on("click", ".account_items p", (event) => {
                event.stopPropagation();
            });
            used.use = "false";
            eel.del_client_user(this.dataset.steamid);
            let $this = $(this);
            $this
                .addClass("will_del")
                .fadeOut(400, () => {
                $this.remove();
                onClick();
            });
            console.log("delete mode:false");
        });
        used.use = "true";
    }
    else {
        acc
            .removeClass("del_mode")
            .off();
        onClick();
        used.use = "false";
    }
    function onClick() {
        acc.one("click", ".account_items", function () {
            let user = this.dataset.username;
            console.log(user);
            eel.auto_login(user);
            setTimeout(() => { onClick(); }, 1000);
        });
    }
    console.log("delete mode:" + used.use);
});
main.on("mouseenter mouseleave", ".account_items", function () {
    $acc.toggleClass("act");
});
show_acc_items();
console.log("settings is ready");
