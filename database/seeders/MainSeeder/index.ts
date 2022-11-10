import Database from '@ioc:Adonis/Lucid/Database';
/* eslint-disable max-len */
/* eslint-disable one-var */
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { getJsDateFromExcel } from 'excel-date-to-js';
import { DateTime } from 'luxon';
import XLSX from 'xlsx';

export default class ExcelSeeder extends BaseSeeder
{
    public async run ()
    {
        // le o arquivo excel
        const workbook = XLSX.readFile('database/seeders/egress.xlsx');
        // pega a primeira aba do arquivo
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        // converte a aba em um array de objetos
        let data = XLSX.utils.sheet_to_json(sheet);

        // percorre o array de objetos
        for (let row of data as any)
        {
            // formata row.aniversario para o formato de data
            row.Aniversário = DateTime.fromISO(getJsDateFromExcel(row.Aniversário).toISOString()).toFormat('yyyy-MM-dd');

            console.log('row ~ ', row);
            // insere dados no banco 
            await Database
                .table('egresses')
                .insert({
                    name: row.Nome,
                    CGM_id: row.CGM,
                    arq_id: row.ID,
                    birth_date: row.Aniversário,
                    responsible_name: row.Responsável,
                });
        }
    }
}
