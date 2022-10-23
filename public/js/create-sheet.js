const xl = require('excel4node')
const wb = new xl.Workbook()
const ws = wb.addWorksheet('Relatorio')

var styleHeader = wb.createStyle({
    font:{
        color: 'black',
        weigth: 900,
        size: 13,
        bold: true
    },

    alignment:{
        horizontal: 'center'
    },

    border:{
        left:{style: 'thin', color: 'black'},
        right:{style: 'thin', color: 'black'},
        top:{style: 'thin', color: 'black'},
        bottom:{style: 'thin', color: 'black'}
    }
})

var styleData = wb.createStyle({
    alignment:{
        horizontal: 'center'
    },

    border:{
        left:{style: 'thin', color: 'black'},
        right:{style: 'thin', color: 'black'},
        top:{style: 'thin', color: 'black'},
        bottom:{style: 'thin', color: 'black'}
    }
})

module.exports = function createSheet(arquivo){

    const header = ['Descrição', 'Valor', 'Data']
    const vazio = ['', '', '']

    let headerIndex = 1

    header.forEach(heading => {
        ws.cell(1, headerIndex++).string(heading).style(styleHeader)
    })

    let row = 2

   while(row <= 1000){
        vazio.forEach(clear => {
            ws.cell(row, 1).string(clear)
            ws.cell(row, 2).string(clear)
            ws.cell(row, 3).string(clear)
            row++
        })
    }

    let rowIndex = 2
    arquivo.forEach(record => {
        let columnIndex = 1
        Object.keys(record).forEach(columnName => {
            ws.cell(rowIndex, columnIndex++).string(record[columnName]).style(styleData)
        })
        rowIndex++
    })

    wb.write('relatorio-de-contas.xlsx')
}