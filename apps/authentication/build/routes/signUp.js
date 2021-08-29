"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const router = express_1.Router();
exports.signUpRouter = router;
router.post("/users/signup", [
    express_validator_1.body("email").isEmail().withMessage("Email must be valid"),
    express_validator_1.body("password").trim().isLength({ min: 4, max: 25 }).withMessage("Password must be between 4 and 25 chars"),
], (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).send(errors.array());
    const { email, password } = req.body;
    console.log("Creating a user...");
    res.send({});
});
//# sourceMappingURL=signUp.js.map