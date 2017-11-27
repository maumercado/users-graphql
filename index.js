const express = require("express");
const expressGraphQL = require("express-graphql");
const schema = require("./schema/schema");

const initializeApp = async () => {
    const app = express();

    app.use(
        "/graphql",
        expressGraphQL({
            schema,
            graphiql: true
        })
    );

    try {
        app.listen(4000);
        console.log("App listening port 4000");
    } catch (error) {
        console.error(error);
    }
};

initializeApp();
