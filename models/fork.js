
    async function ForkReference(input) {
        console.log(input)
        process.send({counter:input})


    }
    process.on('message', async (message) => {
        const numberOfMailsSend = await ForkReference(message);
    });