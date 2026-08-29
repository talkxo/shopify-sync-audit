"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const boxen_1 = __importDefault(require("boxen"));
const figlet_1 = __importDefault(require("figlet"));
const clear_1 = __importDefault(require("clear"));
const cli_table3_1 = __importDefault(require("cli-table3"));
const gradient_string_1 = __importDefault(require("gradient-string"));
const prompts_1 = require("@inquirer/prompts");
const fs_1 = __importDefault(require("fs"));
const validator_1 = require("./validator");
const merger_1 = require("./merger");
function colorizeError(message) {
    if (message.startsWith('SEO:'))
        return chalk_1.default.cyanBright(message);
    if (message.startsWith('Content:'))
        return chalk_1.default.blueBright(message);
    if (message.startsWith('Conversion:'))
        return chalk_1.default.yellowBright(message);
    if (message.startsWith('Inventory:'))
        return chalk_1.default.magentaBright(message);
    if (message.startsWith('Pricing:'))
        return chalk_1.default.greenBright(message);
    return chalk_1.default.red(message);
}
const program = new commander_1.Command();
program.name('shopify-sync-audit').version('2.0.0');
program
    .command('audit')
    .description('Audit products against 2026 Shopify Best Practices')
    .option('-c, --csv <path>')
    .option('-i, --images <path>')
    .action(async (options) => {
    (0, clear_1.default)();
    console.log(gradient_string_1.default.pastel.multiline(figlet_1.default.textSync('TalkXO', { horizontalLayout: 'full', font: 'Slant' })));
    console.log((0, boxen_1.default)(chalk_1.default.white.bold('Shopify Catalog Consistency Engine v2.0') + '\n' + chalk_1.default.gray('Engineered by the TalkXO Agency'), { padding: 1, borderStyle: 'double', borderColor: 'magenta' }));
    let csvPath = options.csv;
    let imagesPath = options.images;
    if (!csvPath)
        csvPath = await (0, prompts_1.input)({ message: '📄 Enter CSV file path:', default: 'dummy.csv' });
    if (!imagesPath)
        imagesPath = await (0, prompts_1.input)({ message: '🖼️  Enter Images folder path:', default: 'assets' });
    console.log('');
    const spinner = (0, ora_1.default)({ text: 'Compiling product matrices...', color: 'cyan' }).start();
    try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const products = await (0, merger_1.mergeData)(csvPath, imagesPath);
        spinner.succeed(chalk_1.default.green(`Indexed ${products.length} product records.`));
        console.log('\n' + chalk_1.default.bold.white('⚡ Executing 2026 E-Commerce Standards Audit...') + '\n');
        let passed = 0;
        let failed = 0;
        let txtReport = "TALKXO CATALOG AUDIT REPORT\n===========================\n\n";
        const errorTable = new cli_table3_1.default({
            head: [chalk_1.default.bold.white('CSV Row'), chalk_1.default.bold.white('Product Handle'), chalk_1.default.bold.white('Data Field'), chalk_1.default.bold.white('Resolution Required')],
            colWidths: [12, 20, 20, 50], wordWrap: true, style: { head: [], border: ['gray'] }
        });
        const auditSpinner = (0, ora_1.default)({ text: 'Analyzing compliance...', color: 'magenta' }).start();
        await new Promise(resolve => setTimeout(resolve, 1200));
        products.forEach(product => {
            try {
                (0, validator_1.validateProduct)(product);
                passed++;
            }
            catch (error) {
                failed++;
                if (error.issues) {
                    error.issues.forEach((issue) => {
                        const rowStr = `Row ${product._csvRow}`;
                        // Push to UI Table
                        errorTable.push([chalk_1.default.yellowBright(rowStr), chalk_1.default.bold.white(product.handle), chalk_1.default.dim.gray(issue.path.join('.')), colorizeError(issue.message)]);
                        // Push to Text Report
                        txtReport += `[${rowStr}] Handle: ${product.handle} | Field: ${issue.path.join('.')} | Error: ${issue.message}\n`;
                    });
                }
            }
        });
        if (failed > 0) {
            auditSpinner.fail(chalk_1.default.red.bold(`Audit failed: ${failed} product(s) violated strict standards.`));
            console.log('\n' + errorTable.toString() + '\n');
            // Export the report file automatically
            fs_1.default.writeFileSync('TalkXO_Audit_Report.txt', txtReport);
            console.log((0, boxen_1.default)(chalk_1.default.red.bold('❌ COMPLIANCE FAILURE\n\n') +
                chalk_1.default.white(`Metrics: ${chalk_1.default.greenBright(passed + ' Passed')} | ${chalk_1.default.redBright(failed + ' Failed')}\n\n`) +
                chalk_1.default.cyan('📄 A full punch-list has been saved to: ') + chalk_1.default.bold('TalkXO_Audit_Report.txt'), { padding: 1, borderColor: 'red', borderStyle: 'bold' }));
        }
        else {
            auditSpinner.succeed(chalk_1.default.green.bold(`Perfect compliance! All products passed.`));
        }
    }
    catch (e) {
        spinner.fail(chalk_1.default.red(`System Error: ${e.message}`));
    }
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map