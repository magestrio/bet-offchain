//const cors = require('cors');
import express, { json } from 'express';
import cors from 'cors';
import fs from 'fs';

import {
  isReady,
  PrivateKey,
  Field,
  MerkleTree,
  Poseidon,
  Signature,
  PublicKey,
  fetchAccount,
  Mina,
  MerkleMap,
  Circuit,
} from 'snarkyjs';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// ==============================================================================

const maxHeight = 256;

const useLocalBlockchain = false;

const Local = Mina.LocalBlockchain();
if (useLocalBlockchain) {
  Mina.setActiveInstance(Local);
} else {
  const Berkeley = Mina.Network(
    'https://proxy.berkeley.minaexplorer.com/graphql'
  );
  Mina.setActiveInstance(Berkeley);
}

const saveFile = 'database.json';

// ==============================================================================
type data_obj_map = {
  [state: string]: { content: Array<element> }
}

type element = {
  key: string
  value: string
}

let new_database: {
  [zkAppAddress: string]: {
    state2data: data_obj_map
  }
} = {};

let serverPrivateKey: PrivateKey;
if (fs.existsSync(saveFile)) {
  var fileData = fs.readFileSync(saveFile, 'utf8');
  const data = JSON.parse(fileData);
  new_database = data.new_database;
  serverPrivateKey = PrivateKey.fromBase58(data.serverPrivateKey58);
  console.log('found database');
} else {
  serverPrivateKey = PrivateKey.random();

  fs.writeFileSync(
    saveFile,
    JSON.stringify({
      new_database,
      serverPrivateKey58: serverPrivateKey.toBase58(),
    }),
    'utf8'
  );
}

const serverPublicKey = serverPrivateKey.toPublicKey();

console.log('Server using public key', serverPublicKey.toBase58());

// ==============================================================================

app.get('/users', (req, res) => {
  console.log('users');
  const zkAppAddress58 = req.query.zkAppAddress;

  if (typeof zkAppAddress58 == 'string') {
    console.log('getting', zkAppAddress58);
    if (!(zkAppAddress58 in new_database)) {
      res.json({})
    }
    res.json({
      items: new_database[zkAppAddress58].state2data["users"].content,
    });
  } else {
    res.status(400).send('bad query parameters');
  }
})

app.post('/users', (req, res) => {
  console.log('users')
  const zkAppAddress58: string = req.body.zkAppAddress
  console.log('item', req.body.items);

  const items: element[] = req.body.items;

  if (!(zkAppAddress58 in new_database)) {
    new_database[zkAppAddress58] = {
      state2data: {},
    };
  }

  new_database[zkAppAddress58].state2data["users"] = {
    content : items
  }

  fs.writeFileSync(
    saveFile,
    JSON.stringify({
      new_database,
      serverPrivateKey58: serverPrivateKey.toBase58(),
    }),
    'utf8'
  );

  res.status(201).send()
});

// ==============================================================================

app.get('/publicKey', (req, res) => {
  res.json({
    serverPublicKey58: serverPublicKey.toBase58(),
  });
});

// ==============================================================================

app.listen(port, () =>
  console.log(`Storage Server listening on port ${port}!`)
);

// ==============================================================================
