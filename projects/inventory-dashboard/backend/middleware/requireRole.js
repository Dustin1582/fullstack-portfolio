const requireRole = (allowedRole) => {

    return (req, res, next) => {
        if(!req.role) {
            return res.sendStatus(401).json({message: "Privilege not found."});
        }

        const isAllowed = allowedRole.includes(req.role);

        if(!isAllowed){
            return res.sendStatus(401).json({message: "Access Denied."})
        }

        next();
    }
}

module.exports = requireRole;