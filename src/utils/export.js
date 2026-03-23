import Papa from 'papaparse'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Export array of plain objects to CSV file
 * @param {Array<Object>} data - Array of objects (keys are column headers)
 * @param {string} filename - Filename without extension
 */
export function exportToCSV(data, filename = 'export') {
  if (!data?.length) return
  const csv = Papa.unparse(data, { header: true })
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export array of objects to PDF table
 * @param {Array<Object>} data - Source data
 * @param {string[]} fields - Keys to extract from each item
 * @param {string[]} headers - Column header labels
 * @param {string} title - Document title
 * @param {Function} formatter - Optional (field, value) => string formatter
 */
export function exportToPDF(data, fields, headers, title = 'Reporte', formatter = null) {
  if (!data?.length) return

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 14, 20)

  // Subtitle with date
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
  doc.text(`Generado: ${new Date().toLocaleString('es-ES')}  |  Total registros: ${data.length}`, 14, 27)
  doc.setTextColor(0, 0, 0)

  const rows = data.map(item =>
    fields.map(field => {
      const value = item[field]
      if (formatter) return formatter(field, value) ?? value ?? '-'
      return value ?? '-'
    })
  )

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 33,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  })

  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`)
}
