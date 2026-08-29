import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import figlet from 'figlet';
import clear from 'clear';
import Table from 'cli-table3';
import gradient from 'gradient-string';
import { input } from '@inquirer/prompts';
import fs from 'fs';
import { validateProduct } from './validator';
import { mergeData } from './merger';

function colorizeError(message: string): string {
  if (message.startsWith('SEO:')) return chalk.cyanBright(message);
  if (message.startsWith('Content:')) return chalk.blueBright(message);
  if (message.startsWith('Conversion:')) return chalk.yellowBright(message);
  if (message.startsWith('Inventory:')) return chalk.magentaBright(message);
  if (message.startsWith('Pricing:')) return chalk.greenBright(message);
  return chalk.red(message);
}

// 🔥 THE ASCII ANIMATION ENGINE 🔥
async function playIntroAnimation() {
  const frames = [
    "🛒                       📦",
    "  🛒                     📦",
    "    🛒                   📦",
    "      🛒                 📦",
    "        🛒               📦",
    "          🛒             📦",
    "            🛒           📦",
    "              🛒         📦",
    "                🛒       📦",
    "                  🛒     📦",
    "                    🛒   📦",
    "                      🛒 📦",
    "                        🛒📦",
    "                          🛒",
    "                            🛒",
    "                              🛒",
  ];

  console.log(chalk.cyanBright('\n⚙️  Booting TalkXO Environment...'));
  
  // Iterate through frames, using '\r' to overwrite the line smoothly
  for (let i = 0; i < frames.length; i++) {
    process.stdout.write(`\r${frames[i]}`);
    await new Promise(resolve => setTimeout(resolve, 60)); // speed of animation
  }
  
  // Pause for a split second before the massive logo drops
  await new Promise(resolve => setTimeout(resolve, 400));
}

const program = new Command();
program.name('shopify-sync-audit').version('2.0.0');

program
  .command('audit')
  .description('Audit products against 2026 Shopify Best Practices')
  .option('-c, --csv <path>')
  .option('-i, --images <path>')
  .action(async (options) => {
    
    clear();
    await playIntroAnimation(); // Run the animation!
    clear(); // Clear it out for the big reveal
    
    console.log(gradient.pastel.multiline(figlet.textSync('TalkXO', { horizontalLayout: 'full', font: 'Slant' })));
    console.log(boxen(chalk.white.bold('Shopify Catalog Consistency Engine v2.0') + '\n' + chalk.gray('Engineered by the TalkXO Agency'), { padding: 1, borderStyle: 'double', borderColor: 'magenta' }));

    let csvPath = options.csv;
    let imagesPath = options.images;

    if (!csvPath) csvPath = await input({ message: '📄 Enter CSV file path:', default: 'dummy.csv' });
    if (!imagesPath) imagesPath = await input({ message: '🖼️  Enter Images folder path:', default: 'assets' });

    console.log(''); 
    const spinner = ora({ text: 'Compiling product matrices...', color: 'cyan' }).start();

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const products = await mergeData(csvPath, imagesPath);
      spinner.succeed(chalk.green(`Indexed ${products.length} product records.`));
      
      console.log('\n' + chalk.bold.white('⚡ Executing 2026 E-Commerce Standards Audit...') + '\n');

      let passed = 0;
      let failed = 0;
      let txtReport = "TALKXO CATALOG AUDIT REPORT\n===========================\n\n";
      
      const errorTable = new Table({
        head: [chalk.bold.white('CSV Row'), chalk.bold.white('Product Handle'), chalk.bold.white('Data Field'), chalk.bold.white('Resolution Required')],
        colWidths: [12, 20, 20, 50], wordWrap: true, style: { head: [], border: ['gray'] }
      });

      const auditSpinner = ora({ text: 'Analyzing compliance...', color: 'magenta' }).start();
      await new Promise(resolve => setTimeout(resolve, 1200));

      products.forEach(product => {
        try {
          validateProduct(product);
          passed++;
        } catch (error: any) {
          failed++;
          if (error.issues) {
            error.issues.forEach((issue: any) => {
              const rowStr = `Row ${product._csvRow}`;
              errorTable.push([ chalk.yellowBright(rowStr), chalk.bold.white(product.handle), chalk.dim.gray(issue.path.join('.')), colorizeError(issue.message) ]);
              txtReport += `[${rowStr}] Handle: ${product.handle} | Field: ${issue.path.join('.')} | Error: ${issue.message}\n`;
            });
          }
        }
      });

      if (failed > 0) {
        auditSpinner.fail(chalk.red.bold(`Audit failed: ${failed} product(s) violated strict standards.`));
        console.log('\n' + errorTable.toString() + '\n');
        fs.writeFileSync('TalkXO_Audit_Report.txt', txtReport);
        console.log(boxen(chalk.red.bold('❌ COMPLIANCE FAILURE\n\n') + chalk.white(`Metrics: ${chalk.greenBright(passed + ' Passed')} | ${chalk.redBright(failed + ' Failed')}\n\n`) + chalk.cyan('📄 A full punch-list has been saved to: ') + chalk.bold('TalkXO_Audit_Report.txt'), { padding: 1, borderColor: 'red', borderStyle: 'bold' }));
      } else {
        auditSpinner.succeed(chalk.green.bold(`Perfect compliance! All products passed.`));
      }
    } catch (e: any) {
      spinner.fail(chalk.red(`System Error: ${e.message}`));
    }
  });

program.parse(process.argv);
