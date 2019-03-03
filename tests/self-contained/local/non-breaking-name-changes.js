(confirm, validate) => confirm("Caller sends (test, assert) but this function binds it to (confirm, validate)",
    () => validate(true, !!"Parameter and argument names can differ"))
