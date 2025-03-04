import * as authService from "../services/authService.js";

// Signup Controller
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const result = await authService.signup(name, email, password);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

//Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ msg: error.message });
    }
};
