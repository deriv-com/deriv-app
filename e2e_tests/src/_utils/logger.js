const fs = require('fs');

const Colors = {
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgWhite: "\x1b[37m",
    RESET: "\x1b[0m"
}

const output_dir = `${__dirname}/../../states/logger`

class logger {

    /**
     * Save results of a test
     * @param test_path
     * @param name
     * @param results
     * @returns {Promise<void>}
     */
    static save = (test_path, name, results) => {
        const split = test_path.split('/')
        const test_name = split.pop().split('.')[0];
        const category = split.pop()
        const file_path = `${output_dir}/${category}_${test_name}.json`
        if (!fs.existsSync(output_dir)) fs.mkdirSync(output_dir)
        if (!fs.existsSync(file_path))
            fs.writeFileSync(file_path, JSON.stringify([{ name, results }]));
        else {
            let data = JSON.parse(fs.readFileSync(file_path));
            data.push({ name, results })
            fs.writeFileSync(file_path, JSON.stringify(data))
        }
    }

    static log = () => {
        if (!fs.existsSync(output_dir)) return
        const files = fs.readdirSync(output_dir)
        if (files.length) console.log(Colors.FgGreen, '\nTEST RESULTS\n', Colors.RESET);
        files.forEach(file => {
            const data = JSON.parse(fs.readFileSync(`${output_dir}/${file}`));
            data.forEach(item => {
                console.log(Colors.FgRed, '\n>', Colors.FgYellow, item.name, Colors.RESET);
                console.log(item.results, '\n');
            })
            fs.unlinkSync(`${output_dir}/${file}`)
        });
    }
}


module.exports = logger