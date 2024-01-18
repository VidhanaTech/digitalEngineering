const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    HOST: Joi.string().required().description('mysql DB url'),
    USER: Joi.string().required().description('mysql user name'),
    PASSWORD: Joi.string().required().description('mysql password'),
    DATABASE: Joi.string().required().description('default database for the application'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  host: envVars.HOST,
  user: envVars.USER,
  password: envVars.PASSWORD,
  database: envVars.DATABASE,
};
