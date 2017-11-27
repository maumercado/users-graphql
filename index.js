const express = require("express");
const expressGraphQL = require("express-graphql");

const initializeApp = async () => {
    const app = express();

    app.use(
        "/graphql",
        expressGraphQL({
            graphiql: true
        })
    );

    try {
        app.listen(3000);
        console.log("App listening port 3000");
    } catch (error) {
        console.error(error);
    }
};

initializeApp();
