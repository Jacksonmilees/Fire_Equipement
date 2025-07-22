const { exec } = require('child_process');

const runScript = (scriptName) => {
    return new Promise((resolve, reject) => {
        exec(`node scripts/${scriptName}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running ${scriptName}:`, error);
                reject(error);
            }
            console.log(`Output from ${scriptName}:`, stdout);
            resolve();
        });
    });
};

const main = async () => {
    try {
        console.log('Starting database population...');
        await runScript('populateCategories.js');
        await runScript('populateProducts.js');
        console.log('Database population completed successfully!');
    } catch (error) {
        console.error('Error during database population:', error);
    }
};

main();
