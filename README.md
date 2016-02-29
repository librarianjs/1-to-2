# Librarian 1 to 2 upgrade tool

## Installation

```sh
npm install librarian-1-to-2
```

## Usage

```javascript
const upgrade = require('librarian-1-to-2')

upgrade({
  from: {
    metadataEngine: oldMetadataEngine, // use options.metadataEngine from your old librarian install
    storageEngine: oldStorageEngine // use options.storageEngine from your old librarian install
  },
  to: {
    data: newDataPlugin, // use options.data from your new librarian install
    storage: newStoragePlugin // use options.storage from your new librarian install
  }
}).then(function (map) {
  // Map will be an object in this format
  //
  // {
  //   "902e53e3": "8262540f-b00f-4bc2-a199-d2a58907dd20",
  //   "302e81e5": "22488f00-f93f-43ed-b32d-14c711cded95",
  //   "08e721e3": "bea4751b-76ac-495f-9bc2-33b0cf0c7899",
  //   "d4e655e8": "efbbd275-b335-4dc3-a867-7c06e088b914",
  //   "34e126e6": "da0c9228-a74c-4df0-9258-927aa44bcae6",
  //   "80e215e1": "b241d502-2fa9-4e87-8443-4773e0d90574",
  //   "02e347e6": "40a00176-4173-40fb-89e7-25b9d0f7aeb8"
  // }
})
```
