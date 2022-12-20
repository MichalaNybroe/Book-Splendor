export function adminGuard(req, res, next) {
    loggedinGuard()

    if (req.session.admin !== true) {
        return res.status(401).send({ message: "Not authorized." })
    }
    next()
}

export function userGuard(req, res, next) {
    loggedinGuard()

    if (req.session.userid !== req.params.id) {
        return res.status(401).send({ message: "Not authorized." })
    }

    next()
}

export function loggedinGuard(req, res, next) {
    if (req.session.IsLoggedIn !==true) {
        return res.status(401).send({ message: "Not signed in. " })
    }
    next()
}