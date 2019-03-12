const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP  = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express(); // node express로 서버 생성하기

const events = [];

app.use(bodyParser.json());

app.use(
    '/graphql', 
    graphqlHTTP ({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: { // resolver functions
            events: () => {
                return events;
            },
            createEvent: (args) => {
                const event = {
                    _id: Math.random().toString(),
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    // date: new Date().toISOString()
                    date: args.eventInput.date
                };
                // console.log(args);
                events.push(event);
                return event;
            }
        },
        graphiql: true
    })
);


app.listen(3000); 
