'use strict';

import * as _ from 'lodash';
import * as express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('<html><body>chorebot home</body></html>');
});

app.listen(4321, () => {
  console.log('listening on 4321...');
});
