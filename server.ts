import('selenium-webdriver/lib/input');
import('zone.js/dist/zone-node');
import('reflect-metadata');
import { readFileSync } from 'fs';
import * as path from 'path';
import * as express from 'express';
import { renderModuleFactory } from '@angular/platform-server';
const { AppServerModuleNgFactory } = require('./dist-server/main');

import { enableProdMode } from '@angular/core';

enableProdMode();

const app = express();

const template = readFileSync(
  path.resolve(__dirname, 'dist', 'index.html'),
  'utf-8'
);

app.get('*.*',
  express.static(path.resolve(__dirname, 'dist'), {
    maxAge: '1y'
  })
);

app.get('*', (req, res) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    document: template,
    url: req.url
  })
    .then(html => {
      return res.send(html);
    })
    .catch(error => {
      return res.sendStatus(500);
    });
});

app.listen(4000, () => {
  console.log('Angular Universal Server is listening on port 4000');
});
