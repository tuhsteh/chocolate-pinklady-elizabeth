// require('@dotenvx/dotenvx').config();
require('dotenv').config();
const { pool } = require('./config/database');
const express = require('express');

const app = express();
require('./routes/inviteRoutes.js')(app);
require('./routes/userRoutes.js')(app);

app.use(express.json());

// stop telling our whole trauma story to the world
app.use((err, req, res, next) => {
  if (req.xhr) {
    var errResponse = {
      message:
        app.get('env') !== 'dev'
          ? 'something went wrong.  ' +
            "maybe it's something you did wrong.  " +
            'maybe you should feel bad about it.  ' +
            'think about it.  ' +
            "think about what you've done wrong."
          : err.message,
    };
    console.log(`${new Date().toISOString()}  ${err.message}`);
    res.status(500).json(errResponse);
  } else if (err.code && err.reason) {
    console.error(`CodedError:  ${err.reason}`);
    return res.status(err.code).json({ message: err.reason });
  }
  next(err);
});


app.post('/hello', async (req, res) => {
  try {
    const { name = 'user' } = req.body;
    const query = {
      text: 'SELECT NOW();',
      values: [],
    };
    pool.query(query, (err, result) => {
      if (err) {
        console.error(`Database query error:  ${err}`);
        return res.status(500).json({ message: 'Database query failed' });
      }
      return res
        .status(200)
        .json({ message: `Hello ${name}.  ` + result.rows[0].now });
    });
  } catch (err) {
    console.error(`Error in /hello:  ${JSON.stringify(err)}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = app;
