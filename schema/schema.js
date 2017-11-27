const graphql = require("graphql");

const axios = require("axios");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            async resolve (parentValue, { id }) {
                try {
                    let response = await axios.get(
                        `http://localhost:3000/users/${id}`
                    );
                    return response.data;
                } catch (error) {
                    // for now this simply returns an error, but we could
                    // create an error normalizer that returns a specific
                    // error object per http status
                    return error;
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
