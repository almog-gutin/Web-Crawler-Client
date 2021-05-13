const chalk = require('chalk');
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(chalk.green.bold('Server connected on port:'), port));
