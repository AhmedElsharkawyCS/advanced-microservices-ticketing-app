"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meRouter = void 0;
const express_1 = require("express");
const router = express_1.Router();
exports.meRouter = router;
router.get("/users/me", (req, res, next) => {
    res.send("Hi user!");
});
//# sourceMappingURL=me.js.map