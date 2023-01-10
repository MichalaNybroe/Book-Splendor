export function adminGuard(req, res, next) {
    if (req.session.admin !== true) {
        return res.status(401).send({ message: "Not authorized." })
    }
    next()
}

export function userGuard(req, res, next) {
    if (req.session.userid !== Number(req.params.id)) {
        return res.status(401).send({ message: "Not authorized." })
    }

    next()
}

export function loggedinGuard(req, res, next) {
    if (req.session.isLoggedIn !==true) {
        return res.status(401).send({ message: "Not signed in." })
    }
    next()
}