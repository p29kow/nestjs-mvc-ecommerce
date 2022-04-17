class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConflictError';
    }
}

class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

class UnauthorisedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'The user is not authorised';
    }
}

class InternalServerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'There is a problem with the server. Please try again later';
    }
}

export {
    ConflictError,
    NotFoundError,
    UnauthorisedError,
    InternalServerError
}