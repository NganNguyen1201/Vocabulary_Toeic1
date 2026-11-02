const XLSX = require("xlsx");

function parseExcel(filePath){

    const workbook =
        XLSX.readFile(filePath);

    const sheet =
        workbook.Sheets[
            workbook.SheetNames[0]
        ];

    const rows =
        XLSX.utils.sheet_to_json(
            sheet,
            {
                defval: ""
            }
        );

    console.log(
        "EXCEL DATA:",
        JSON.stringify(
            rows,
            null,
            2
        )
    );

    return rows;
}

module.exports = parseExcel;