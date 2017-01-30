'use strict';

import * as _ from 'lodash';
import * as express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('<html><body>chorebot home</body></html>');
});

app.listen(3000, () => {
  console.log('chorebot listening on port 3000...');
});
