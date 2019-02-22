module.exports = async function() {
    console.log("global teardown");
    // await global['__app__'].close();
    await global['__replSet__'].stop();

};
