const Series = require('promise-series')
const uuid = require('node-uuid')

const DRY_RUN = !!process.env.DRY_RUN || false

function cloneObject (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function oldGetFiles (engine) {
  return new Promise((resolve, reject) => {
    engine.all((err, files) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(files)
      }
    })
  })
}

function oldGetStorage (engine, id) {
  return new Promise((resolve, reject) => {
    engine.get(id, (err, buffer) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(buffer)
      }
    })
  })
}

function transformRecords (records) {
  return records.map(record => {
    return {
      _oldId: record.id,
      id: uuid.v4(),
      name: record.fileName,
      size: record.fileSize,
      mimeType: record.mimeType
    }
  })
}

function migrateData (plugin, record) {
  return function () {
    let r = cloneObject(record)
    delete r._oldId

    if (DRY_RUN) {
      return Promise.resolve(r)
    } else {
      return plugin.put(r)
    }
  }
}

function migrateStorage (src, dest, record) {
  return function () {
    return oldGetStorage(src, record._oldId).then(buffer => {
      if (DRY_RUN) {
        return Promise.resolve(buffer)
      } else {
        return dest.put(record.id, buffer)
      }
    })
  }
}

function upgradeLibrarianInstall (options) {
  return oldGetFiles(options.from.metadataEngine).then(files => {
    let series = new Series;
    files.forEach(file => series.add(migrateData(options.to.data, file)))
    return series.run().then(() => {
      return files
    })
  }).then(files => {
    let series = new Series;
    files.forEach(file => {
      return series.add(migrateStorage(options.from.storageEngine, options.to.storage, file))
    })
    return series.run().then(() => {
      return files
    })
  }).then(files => {
    return files.reduce((previous, file) => {
      previous[file._oldId] = file.id
      return previous
    }, {})
  })
}

module.exports = upgradeLibrarianInstall
