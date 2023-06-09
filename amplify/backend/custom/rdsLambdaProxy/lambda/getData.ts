//import { APIGatewayProxyResultV2 } from 'aws-lambda';
// @ts-nocheck
import { Stadium } from './sequelize';

exports.handler = async function (): Promise<any> {
  try {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await Stadium.findAll())
    };
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(error)
    }
  }
};
