module.exports = async function() {
    // await global.__MONGOD__.stop();
    console.log("global teardown");
    await global.__replSet__.stop();
};
