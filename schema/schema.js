const axios = require("axios");
const graphql = require("graphql");
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            async resolve ({ id }) {
                try {
                    const response = await axios.get(
                        `http://localhost:3000/companies/${id}/users`
                    );
                    return response.data;
                } catch (error) {
                    return error;
                }
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
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
    })
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

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            async resolve (parentValue, { firstName, age }) {
                try {
                    const response = await axios.post(
                        `http://localhost:3000/users`,
                        {
                            firstName,
                            age
                        }
                    );
                    return response.data;
                } catch (error) {
                    return error;
                }
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve (parentValue, { id }) {
                try {
                    const response = await axios.delete(
                        `http://localhost:3000/users/${id}`
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
    query: RootQuery,
    mutation
});
