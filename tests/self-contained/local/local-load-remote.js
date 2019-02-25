(test, assert) => {
    let add = ff('https://gist.githubusercontent.com/devmachiine/4433df78dc698aebad5aa37be15475fa/raw/59fdf8c2031d2418539adb98dfad73fcd1469acd/add.js')
    let thousand = await add(123, 877)

    return test('local functions can load remote functions', () => assert(`${thousand} == 1000`))
}