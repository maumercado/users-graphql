const graphql = require("graphql");

const axios = require("axios");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString }
    }
});

const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            async resolve ({ companyId }) {
                try {
                    const response = await axios.get(
                        `http://localhost:3000/companies/${companyId}`
                    );
                    return response.data;
                } catch (error) {
                    return error;
                }
            }
        }
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
                    const response = await axios.get(
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
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            async resolve (parentValue, { id }) {
                try {
                    const response = await axios.get(
                        `http://localhost:3000/companies/${id}`
                    );
                    return response.data;
                } catch (error) {
                    return error;
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
