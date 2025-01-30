const adminLogin = (req, res) => {
    const { username, password } = req.body;

    // Hardcoded admin credentials
    const ADMIN_USERNAME = 'admin'; // Your hardcoded username
    const ADMIN_PASSWORD = '1729'; // Your hardcoded password

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // If credentials match, send a success response
        return res.json({ message: 'Login successful' });
    }

    // If credentials don't match, send an error message
    return res.status(400).json({ message: 'Invalid credentials' });
};

module.exports = { adminLogin };
