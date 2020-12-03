(async () => {

    async function f() {
        const p = Promise.reject();
        p.catch(() => { });
        return p;
    }

    const q = await f();
})();
