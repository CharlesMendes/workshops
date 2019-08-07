"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// importamos a lib express e guardamos ela na variavel de mesmo nome
var express = require("express");
var App = /** @class */ (function () {
    function App() {
        this.app = express();
        this.route();
    }
    App.prototype.route = function () {
        // assim que acessarmos a url principal, irá acessar essa rota default
        this.app.route('/').get(function (req, res) { return res.status(200).json({ "result": "Vai Corinthians" }); });
    };
    return App;
}());
exports.default = new App();
