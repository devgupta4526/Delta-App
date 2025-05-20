import ApiError from "../utils/ApiError.js";

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.user?.roles || [];

        const isAuthorized = userRoles.some(role => allowedRoles.includes(role));

        if (!isAuthorized) {
            throw new ApiError(403, "Access denied: You do not have permission to perform this action.");
        }

        next();
    };
};

export default authorizeRoles;
