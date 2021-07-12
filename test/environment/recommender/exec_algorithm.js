process.chdir('/')

const R2SPath = '../../..'
const host = "tcp://10.0.0.11:5555"

const logHandler = require(R2SPath + '/src/util/logHandler.js');
const fileHandler = require(R2SPath + '/src/util/fileHandler.js');

const python     = require(R2SPath + '/src/util/pythonBridge.js');

const assert     = require('assert');
const expect     = require('chai').expect;

const uuidV4     = require("uuid/v4");

let Options = {
  "r2sPid": uuidV4(),
  "ret": 0,
  "log": "",
  "logfile": "/source/R2S/log/R2SS.log",
  "function": ""
}




function DictToParams(opt) {

    let params = [];

    for (const [k,v] of Object.entries(opt)) {
       params.push("--" + k + "=" + v + "") 

    } 

    return params;


}


describe('structural tests', function() {
  let args = ['/source/R2S/test/python/IntegrationTests.py']

  describe('Executing a python Script', function() {

    describe('Calling the script', function() {
      it('should call a python script and return the r2sPid', async () => {
        ret = await python.run(args.concat(DictToParams(Options)))
        assert.strictEqual(ret['r2sPid'], Options.r2sPid)
      
      })
    })

    describe('Calling the script remotelly', function() {
       it('should call a python script and return the r2sPid', async () => {
        ret = await python.runRemote(host, args.concat(DictToParams(Options)),Options.r2sPid)
        assert.strictEqual(ret['r2sPid'], Options.r2sPid)
      }) 
    })


  })  

  describe('Checking the script output', function() {
    it('should be able to see the status of the script 1-fail', async () => {
        Options.ret = 1
        ret = await python.run(args.concat(DictToParams(Options)))
       
        assert.strictEqual(ret['exitCode'], Options.ret)
    })

    it('should be able to see the status of the script 0-success', async () => {
      Options.ret = 0
      ret = await python.run(args.concat(DictToParams(Options)))
      assert.strictEqual(ret['exitCode'], Options.ret)
    })
  
    it('should be able to see the status of the script 1-fail - Remotelly', async () => {
      Options.ret = 1
      ret = await python.runRemote(host, args.concat(DictToParams(Options)), Options.r2sPid)
      assert.strictEqual(ret['exitCode'], Options.ret)
    })

    it('should be able to see the status of the script 0-success  - Remotelly ', async () => {
      Options.ret = 0
      ret = await python.runRemote(host, args.concat(DictToParams(Options)), Options.r2sPid)
      assert.strictEqual(ret['exitCode'], Options.ret)
    })
  });


  describe('Viewing script log', function() {
      let logmessage = 'test'

      it('should be able to monitor the log of a specific r2sPid', async () => {
        Options.log = logmessage
        ret = await python.run(args.concat(DictToParams(Options)))
        let logRead = await logHandler.readbyr2sPid(Options.logfile,Options.r2sPid)
        assert.deepStrictEqual([logmessage], logRead)
      })

      it('should be able to monitor the log of a specific r2sPid -- Remotelly', async () => {
        Options.r2sPid = uuidV4()
        Options.log = logmessage
        Options.logfile =  "/source/R2S/log/R2SD.log"
        ret = await python.runRemote(host, args.concat(DictToParams(Options)),Options.r2sPid)
        let logRead = await logHandler.readbyr2sPid(Options.logfile,Options.r2sPid)
        assert.deepStrictEqual([logmessage], logRead)


      })
  });




  describe('Handling files and folders', function(){

    xit("Should be able to create a new folder")

    xit("Should be able to rename a existing folder and create a new one with the same name")

    xit("Should be able to list all files of a specific extension")

    xit("Should be able to get the size of a file")


  })


  describe('Calling an Arrow Script', function() {
      
      it('should be able to use Arrow on R2SData', async () => {
        Options.function = "ArrowTesting"  
        Options.ret = ""
        ret = await python.runRemote(host, args.concat(DictToParams(Options)),Options.r2sPid)
        assert.strictEqual(ret['tCompare'], true)
      })

      xit('should be able to read a CSV file to a Arrow Table')

      xit('should be able to read a Parquet file')

      xit('should be able to write a Parquet file')
      

  })




});
