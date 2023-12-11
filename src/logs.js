const fs = require('fs');
const path = require('path');
module.exports = {
    logEvent: async (entityName, action, additionalData) => {
      const eventData = {
        entity: entityName,
        action: action,
        timestamp: new Date().toISOString(),
        data: additionalData,
      };
      const rootDirectory = process.cwd();
      const logDirectory = path.resolve(rootDirectory, 'src/logs');
      const filePath = path.resolve(logDirectory, 'logfile.json');
  
      try {
        const existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
  
        existingData.push(eventData);
  
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
      } catch (error) {
        console.error('Error saving eventData to JSON file:', error);
      }
    },
  };