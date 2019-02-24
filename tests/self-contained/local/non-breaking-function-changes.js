() => {
    // (test, assert) => still sent in from outside.
    return {
        description: "passing more arguments than a function expects are simply ignored",
        extra: "sending out extra things than before",
        stuff: "also simply ignored by the caller" 
        // if the caller doesn't expect the output to be constrained within a schema
    }
    // as this function doesn't have a name and only a path, that cannot be a breaking change
}