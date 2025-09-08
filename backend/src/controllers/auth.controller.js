const { User, Role } = require('../models');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');

function setRefreshCookie(res, token) {
    res.cookie('refresh_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

exports.login = async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.scope('withSecret').findOne({ where: { email }, include: Role });
    if (!user || !(await user.checkPassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    setRefreshCookie(res, refreshToken);
    return res.json({ accessToken });
};

exports.refresh = async (req, res) => {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: 'Missing refresh token' });
    try {
        const payload = verifyRefresh(token);
        const user = await User.findByPk(payload.sub, { include: Role });
        if (!user) return res.status(401).json({ message: 'User not found' });
        const accessToken = signAccess(user);
        return res.json({ accessToken });
    } catch (e) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
};

exports.logout = async (req, res) => {
    res.clearCookie('refresh_token', { path: '/api/auth' });
    return res.json({ ok: true });
};

exports.me = async (req, res) => {
    const { id, email, Roles } = req.user;
    return res.json({ id, email, roles: Roles.map(r => r.name) });
};
